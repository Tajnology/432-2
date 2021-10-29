const express = require("express");
const https = require('https');
const axios = require("axios");

const router = express.Router();
const cache = require("../utils");

const defaultSort = "relevant";
const postType = "link";
const defaultLimit = 25;
const chunkSize = 25;

const searchTermPrefix = "search:";
const postPrefix = "post:";

const searchQueryCacheExpiry = 60*60; // seconds
const postCacheExpiry = 24*60*60; // seconds

const getPostsTimeout = 50; // ms

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

		if(n == 0) resolve(null);

		postsFound = [];

		for(let i = 0; i < n; i++){
			const content = postArray[i].data.selftext; // Constains the body text from a Reddit post
			if(content.length != 0) {
				postsFound.push({
					title: postArray[i].data.title,
					content: content,
					redditScore: postArray[i].data.score,
					permalink: "https://www.reddit.com" + postArray[i].data.permalink,
					id: postArray[i].data.name
				});
			}
		}

		postsCallback(postsFound);
	})
}

function postsById(postIDs) {
	return new Promise((posts) => {
		const options = createPostsByIdOptions(postIDs);
		const redditReq = https.request(options,(redditRes) => handleRedditResponse(redditRes,postsCallback));
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
	  + '&limit=' + limit;
  
	if (after != null) {
	  // If this isn't the first 'page' of results, after will be a valid link ID
	  str = str + '&after=' + after;
	}
  
	options.path += str;
	return options;
}
  

function appendPosts(postArray, query, sort, limit, chunkSize) {
	return new Promise((resolve) => {
		lastPost = postArray[postArray.length - 1];

		redditSearch(query,lastPost.id,sort,chunkSize)
		.then(posts => {
			for (let i = 0; i < posts.length; i++) {
				const post = posts[i];

				// Put the post into the redis cache
				cache.put(postPrefix + post.id,postCacheExpiry,post);
				
				if(postArray.length < limit){
					postArray.push(post);
				}else{
					resolve(true);
					return true;
				}
			}
		})
		.catch(
			error => console.log(error)
		);
	});
}

function checkPostCache(postID){
	return cache.get(postPrefix + query).catch((err) => {console.log("Problem fetching a post from the cache: ", err)});
}

function checkSearchCache(query,sort){
	// Check the cache for the search
	return cache.get(searchTermPrefix + sort + query).catch((err) => {console.log("Problem fetching search results from cache: ",err)});
} 

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

	return checkSearchCache(query,sort)
	.then((postIDs) => {
		return new Promise((partialPosts) => {
			if(postIDs != null){
				for(let i = 0; i < postIDs.length; i++) {
					
				}
			}
		});
	}).then((partialPosts) => {
		if(partialPosts.length >= limit) return true;

		return new Promise((success) => {
			function getSomePosts() {
				if(partialPosts.length < limit) {
					appendPosts(posts,query,sort,limit,chunkSize)
					.then((success) => {
						getSomePosts();
					})
				}else{
					success(true);
				}
			}
			
			getSomePosts();
		});
		
	}).then((success) => {
		
	})
	.catch((err) => console.log(err));
	
/*
	function foundAllPosts() {
		return res.status(200).json({status:true,data:posts});
	}

	function appendPost(post) {
		if(posts.length >= limit) return;

		posts.push(post);

		if(posts.length >= limit) {
			foundAllPosts();
		}
	}

	function needMorePosts() {
		return posts.length < limit;
	}
 */
});

module.exports = router;


