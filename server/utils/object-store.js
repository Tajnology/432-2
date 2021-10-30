require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({region:"ap-southeast-2"});

store = new Object();
store._apiVersion = '2006-03-01';

store.create = function(bucketName) {
    console.log("Trying to create a bucket");
    return new AWS.S3( {apiVersion: this._apiVersion})
    .createBucket({Bucket:bucketName}).promise();
}

store.delete = function(bucketName) {

    return new AWS.S3( {apiVersion: this._apiVersion})
    .deleteBucket({Bucket: bucketName}).promise();
}

store.put = function(bucketName, key, value) {
    if(typeof value === 'object'){
        value = JSON.stringify(value);
    }

    const objectParams = {Bucket: bucketName, Key: key, Body: value};
    return new AWS.S3({apiVersion: this._apiVersion}).putObject(objectParams).promise();
}

store.get = function(bucketName, key) {
    return new Promise((resolve,reject) => {
        const objectParams = {Bucket: bucketName, Key: key};
        return new AWS.S3({apiVersion: this._apiVersion}).getObject(objectParams, (err,result) => {
            if(err) {
                reject(err);
                return;
            }
            
            if(result == null) {
                resolve(null);
                return;
            }

            try{
                resolve(JSON.parse(result.Body));
            } catch (ex) {
                resolve(result.Body);
            }
        });
    });
}

module.exports = store;