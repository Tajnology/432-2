require('dotenv').config();
const AWS = require('aws-sdk');

store = new Object();
store._apiVersion = '2006-03-01';

store.create = function(bucketName) {
    return bucketPromise = new AWS.S3( {apiVersion: this._apiVersion})
    .createBucket({Bucket:bucketName}).promise();
}

store.put = function(bucketName, key, value, expirationDays = 1) {
    if(typeof value === 'object'){
        value = JSON.stringify(value);
    }

    const objectParams = {Bucket: bucketName, Key: key, Body: value, Expi};
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
                resolve(JSON.parse(result));
            } catch (ex) {
                resolve(result);
            }
        });
    });
}

module.exports = store;