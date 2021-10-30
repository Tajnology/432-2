const crypto = require("crypto");

function hash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

module.exports = hash;