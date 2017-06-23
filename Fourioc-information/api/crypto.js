var crypto = require('crypto');


//data 是准备加密的字符串,key是你的密钥
function aesEncryption(data, key) {
    var iv = "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);

    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));

    return cipherChunks.join('');
}
//data 是你的准备解密的字符串,key是你的密钥
function aesDecryption(data, key) {
    var iv = "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    decipher.setAutoPadding(true);

    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));

    return cipherChunks.join('');
}
// var encrypt_str = encryption("xxxxssss|ssssss|lllllll|ppppppp|mmmmmmmm","1234fghjnmlkiuhA");
// console.log(encrypt_str);
// console.log(decryption(encrypt_str,"1234fghjnmlkiuhA"));
var sha1Encode = function(method,url,json, key){
    var hmac = crypto.createHmac('sha1', key);
    hmac.update(encodeURIComponent(method.toLowerCase() + url + JSON.stringify(json)));
    return hmac.digest('hex');
}
exports.md5 = function (str) {
var md5sum = crypto.createHash('md5');
md5sum.update(str);
str = md5sum.digest('hex');
return str;
};
exports.sha1Encode = sha1Encode;
exports.aesEncryption = aesEncryption;
exports.aesDecryption = aesDecryption;
