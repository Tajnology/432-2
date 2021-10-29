cache = require("../utils/cache");

const teststring = "testcache123";

cache.get(teststring)
.then(
    (value) => {
        if(value == null){
            // Value was not in the cache or call failed
            console.log("Testing functionality of Redis cache");
            cache.put(teststring,{success:true},2);

            cache.get(teststring)
            .then(
                (value) => {
                    if(value != null) {
                        console.log("Value was successfully placed in cache");
                        setTimeout(function () {
                            cache.get(teststring)
                            .then(
                                (value) => {
                                    if(value == null){
                                        console.log("Value successfully expired");
                                        console.log("Unit test complete.");
                                    }else {
                                        console.log("Value did not expire: ", value);
                                    }
                                },
                                (reason) => {
                                    console.log("Error: ",reason);
                                }
                            )
                        },2000);
                    } else {
                        console.log("Key not placed in cache");
                    }
                },
                (reason) => {
                    console.log("Error: ", reason);
                }
            )
        }else{
            console.log("Value was already in the cache: ", value);
        }
    },
    (reason) => {
        console.log("Error: ",reason);
    }
);