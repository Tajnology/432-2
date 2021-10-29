const redis = require('redis');

cache = new Object();
cache._redisClient = redis.createClient();
cache._redisClient.on('error', (err) => {

    console.log("Redis error " + err);
});

// Attempt to get the value associated with key from
// the caching system. callback is a function with
// string error and JSON object value.
cache.get = function(key,callback) {
    return this._redisClient.get(key,(err,result) => {
        if(result) {
            callback(null,JSON.parse(result));
        }else{
            callback("Key not not stored in cache.",null);
        }
    });
}

// Put a value into the cache
cache.put = function(key, value) {
    return this._redisClient.setex(key,3600,JSON.stringify(value));
}

module.exports = cache;
