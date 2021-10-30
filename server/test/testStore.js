store = require("../utils/object-store.js");

const bucketName = "n10216791-test";

function testBucket(){
    
}

store.create(bucketName)
.then((data) => {
    return store.put(bucketName,"key1","value1");
})
.then((data) => store.get(bucketName,"key1"))
.then((value) => {
    console.log(value.body);

    if(value == "value1"){
        console.log("Received expected value");
        return Promise.resolve();
    }else{
        console.log("Store test failed");
        return Promise.reject("Test failed");
    }
})
.then(() => {
    console.log("Passed test");
    store.delete(bucketName)
    .then((data) => {
        return;
    })
})
.catch((reason) => {
    console.log(reason);
    store.delete(bucketName)
    .then((data) => {
        return;
    })
});