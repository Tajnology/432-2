const redis = require('redis');

cache = new Object();
cache._redisClient = redis.createClient();
cache._redisClient.on('error', (err) => {

    console.log("Redis error " + err);
});

// Attempt to get the value associated with key from
// the caching system.
cache.get = function(key,callback) {
    return new Promise((resolve,reject) =>{
        this._redisClient.get(key,(err,val) => {
            if (err) {
                reject(err);
                return;
            }
            if(val == null) {
                resolve(null);
                return;
            }

            try{
                resolve(
                    JSON.parse(val)
                );
            } catch (ex) {
                resolve(val);
            }
        });
    });
    
}

// Put a value into the cache
cache.put = function(key, value,expiration = 3600) {
    if(typeof value === 'object'){
        value = JSON.stringify(value);
    }
    
    this._redisClient.setex(key,expiration,value);
}

module.exports = cache;
