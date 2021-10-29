const redis = require('redis');

cache = new Object();
cache._redisClient = redis.createClient();

module.exports = cache;
