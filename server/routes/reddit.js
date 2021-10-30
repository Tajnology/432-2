const express = require("express");
const https = require('https');
const axios = require("axios");

const router = express.Router();
const cache = require("../utils/cache");
const store = require("../utils/object-store");
const hash = require("../utils/hash");

//const { json } = require("stream/consumers");

const defaultSort = "relevance";
const postType = "link";
const defaultLimit = 10;
const chunkSize = 200;

const searchTermPrefix = "search:";
const postPrefix = "post:";
const afterPrefix = "after:";

const postBucket = "taj-max-post-bucket";
const searchBucket = "taj-max-search-bucket";

const searchQueryCacheExpiry = 60*60; // seconds
const postCacheExpiry = 24*60*60; // seconds

const getPostsTimeout = 50; // ms

store.create(postBucket)
.then((data) => {
	console.log("Successfully created bucket for posts.");
})
.catch((reason) => {
	return;
})

store.create(searchBucket)
.then((data) => {
	console.log("Successfully created bucket for searches.");
})
.catch((reason) => {
	return;
})

function handleRedditResponse(redditRes, postsCallback) {
	let body = [];

	redditRes.on('data',function(chunk) {
		body.push(chunk);
	});
	redditRes.on('end', function() {
		const bodyString = body.join('');
		const rsp = JSON.parse(bodyString);

		const postArray = rsp.data.children;
		const n = rsp.data.dist;

		if(n == 0) postsCallback(null);

		postsFound = [];
		lastSeen = null;

		for(let i = 0; i < n; i++){
			const content = postArray[i].data.selftext; // Constains the body text from a Reddit post
			if(content.length != 0) {
				postObject = {
					title: postArray[i].data.title,
					content: content,
					redditScore: postArray[i].data.score,
					permalink: "https://www.reddit.com" + postArray[i].data.permalink,
					id: postArray[i].data.name
				};

				postsFound.push(postObject);

				// Put the post in the cache
				cache.put(postPrefix + postObject.id,postObject,postCacheExpiry);
				store.put(postBucket,hash(postObject.id),postObject);
			}

			lastSeen = postArray[i].data.name;
		}

		postsCallback({posts:postsFound,lastId:lastSeen});
	})
}

function postsById(postIDs) {
	return new Promise((posts) => {
		const options = createPostsByIdOptions(postIDs);
		const redditReq = https.request(options,(redditRes) => handleRedditResponse(redditRes,posts));
		redditReq.on('error', (e) => {
			console.error(e);
		});
		redditReq.end();
	});
}

function createPostsByIdOptions(postIDs) {
	const options = {
	  hostname: "www.reddit.com",
	  port: 443,
	  path: "/api/info.json?",
	  method: "GET"
	}
  
	let str = 'method=' + options.method
	  + '&id=' + postIDs.join(',');
  
	options.path += str;
	return options;
}

function redditSearch(query, after, sort, limit) {
	return new Promise((posts) => {
		const options = createRedditOptions(query,limit,sort,after);
		const redditReq = https.request(options,(redditRes) => handleRedditResponse(redditRes,posts));
		redditReq.on('error', (e) => {
			console.error(e);
		});
		redditReq.end();
	});
}

function createRedditOptions(query, limit = 25, sort = "relevance", after = null) {
	const options = {
	  hostname: "www.reddit.com",
	  port: 443,
	  path: "/search.json?",
	  method: "GET"
	}
  
	let str = 'method=' + options.method
	  + '&q=' + query
	  + '&type=' + postType
	  + '&sort=' + sort
	  + '&limit=' + defaultLimit;
  
	if (after != null) {
	  // If this isn't the first 'page' of results, after will be a valid link ID
	  str = str + '&after=' + after;
	}
  
	options.path += str;
	return options;
}
  


function appendPosts(postArray, query, sort, limit, chunkSize, lastId) {
	return new Promise((resolve) => {
		if(lastId == null && postArray.length >= 1) {
			lastId = postArray[postArray.length-1].id;
		}

		redditSearch(query,lastId,sort,chunkSize)
		.then((value) => {
			if(value == null){
				resolve(null);
				return null;
			}

			lastId = value.lastId;
			posts = value.posts;

			for (let i = 0; i < posts.length; i++) {
				const post = posts[i];
				
				if(postArray.length < limit){
					postArray.push(post);
				}else{
					resolve(lastId);
					return;
				}
			}

			resolve(lastId);
		})
		.catch(
			error => console.log(error)
		);
	});
}

function checkPostCache(postID){
	return cache.get(postPrefix + postID).catch((err) => {console.log("Problem fetching a post from the cache: ", err)});
}

function checkPostBucket(postID){
	return store.get(postBucket,hash(postID)).catch((err) => {console.log("Problem fetching a post from object store: ",err)});
}

function checkSearchCache(query,sort){
	// Check the cache for the search
	return cache.get(searchTermPrefix + sort + query).catch((err) => {console.log("Problem fetching search results from cache: ",err)});
} 

function checkSearchBucket(query,sort){
	return store.get(searchBucket,hash(sort+query)).catch((err) => {console.log("Problem fetching search from object store: ",err)});
}

// Query parameters
// q - the string query that will be searched on reddit
// limit - the number of posts that will be found (default = 10)
// sort - the sorting order of the posts, one of (relevance, hot, top, new, comments) (default = relevance)
router.get("/", (req, res) => {
    const query = req.query.q;
	var limit = defaultLimit;
	var sort = defaultSort;
	if(req.query.sort != null) sort = req.query.sort;
	if(req.query.limit != null) limit = req.query.limit;

	if(query == undefined) {
		return res.status(400).json({status:false,message:"No query [q] provided"});
	}

	let posts = [];

	// Check the cache for the query and sort combination
	return checkSearchCache(query,sort)
	.then((postIDs) => {
		// Promise to return the posts corresponding to the IDs that have been cached
		return new Promise((processPostIDs) => {
			if(postIDs == null){
				checkSearchBucket(query,sort)
				.then((postIDs) => {
					if(postIDs == null) {
						processPostIDs(null);
						return;
					}else{
						console.log("Got post IDs from object store");

						cache.put(searchTermPrefix + query,postIDs,postCacheExpiry);
						processPostIDs(postIDs);
						return;
					}
				})
			}else{
				console.log("Got post IDs from cache");

				processPostIDs(postIDs);
				return;
			}
		});
	}).then((postIDs) =>{
		if(postIDs == null) return Promise.resolve();

		let idsNotFound = [];

		let idsChecked = 0;
		for(let i = 0; i < postIDs.length; i++){
			// Look in the cache for a post matching the ith ID
			checkPostCache(postIDs[i])
			.then((post) => {
				if(post == null){
					checkPostBucket(postIDs[i])
					.then((post) => {
						if(post == null){
							// Add unfound post to the cache miss array
							idsNotFound.push(postIDs[i]);
						}else{
							console.log("Got a post from the object store");
							cache.put(postPrefix + postIDs[i],post);
							posts.push(post);
							idsChecked++;
						}

						if(idsChecked == postIDs.length){
							// Check if there is anything in the cache miss array
							return Promise.resolve(idsNotFound);
						}
					})
				}else{
					console.log("Got a post from the cache");
					// If the post was in the cache, add it to the post array
					posts.push(post);
					idsChecked++;
					// If this is the last post ID to be processed
					if(idsChecked == postIDs.length){
						// Check if there is anything in the cache miss array
						return Promise.resolve(idsNotFound);
					}
				}					
			})
		}
	}).then((idsNotFound) => {
		if(idsNotFound == null) return Promise.resolve();

		if(idsNotFound.length > 0){
			// Get the posts matching the cached IDs from the Reddit API
			postsById(idsNotFound)
			.then((value) => {
				// Push the additional posts and resolve the promise
				newPosts  = value.posts;
				posts.push(newPosts);
				return Promise.resolve();
			});
		}else{
			// If not, resolve the promise with the post array
			return Promise.resolve();
		}
	}).then(() => {
		// If there are already enough posts, satisfy the promise
		if(posts.length >= limit) return true;
		let lastId = null;

		// Promise to return a success boolean when the posts array has been filled to limit
		return new Promise((success) => {
			// Function to allow self-calls if more posts are needed
			function getSomePosts() {
				// If more posts are needed
				if(posts.length < limit) {

					// Get the posts from reddit
					appendPosts(posts,query,sort,limit,chunkSize, lastId)
					.then((lastIdRet) => {
						// Get more posts
						lastId = lastIdRet;
						getSomePosts();
					})
				}else{
					// When enough posts are found resolve the promise
					success(true);
				}
			}
			
			getSomePosts();
		});
		
	}).then((success) => {
		let postIDs = [];

		for(let i = 0; i < posts.length; i++){
			postIDs.push(posts[i].id);
		}

		// Update the cache with the most recent search results
		cache.put(searchTermPrefix + sort + query,postIDs,searchQueryCacheExpiry);
		store.put(searchBucket,hash(sort + query),postIDs);

		// Send the HTTP response
		res.status(200).json({status:success,data:posts});
	})
	.catch((err) => console.log(err));

});

module.exports = router;


