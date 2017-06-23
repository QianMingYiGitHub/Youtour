var crypto = require('crypto');  
module.exports.AES192_MD5 = {
    //加密
    AES192MD5: function (str) {
        var secret="987654321";//默认设置秘钥可以改变
        var cipher = crypto.createCipher('aes192', secret);  
        var AES192 = cipher.update(str, 'utf8', 'hex');  
            AES192 += cipher.final('hex');  
        console.log("AES192:"+AES192);
         //加密+MD5
        var MD5=crypto.createHash('md5');
        MD5.update(AES192);
        var AES192MD5 = MD5.digest('hex');
        console.log("AES192+MD5："+AES192MD5);

        return AES192MD5;  
    }  
}
