
var path = require('path');

exports.getToken = function(corpId){
    return 'vdb7w44H4nEMPpt9';
}
exports.getEncodingAESKey = function(){
    return '5zmGYZVoOi7qgMjRDJVy84T4HvbBo7uX0dEHWy9Xmqr';
}

exports.getURL = function(){
   // return 'youtour.com.cn';
    //return 'http://youtour.frp1.chuantou.org';
    return 'youtour.tunnel.qydev.com';
}

exports.getSha1Key = function(){
    return 'okliujxhnmsmsyu1988';
}
// var corpSecret = {};
// exports.getCorpSecret = function(corpId) {
//     if(util.isNullOrUndefined(corpSecret[corpId])) {
//         corpSecret[corpId] = require(path.join(__dirname, 'corp', corpId));
//     }else{
//     return corpSecret[corpId];
//     }
// }
exports.getCorpSecret = function(corpId){
    if(corpId=="wx89c411811fef7bc6"){//配置企业号号
        return "MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1"
    }else{
        return"......";
    }
}
 