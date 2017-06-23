var config = require('./config');
var request= require('request');
module.exports.get_accesstoken = function (cb) {
    //将上传的图片数据直接代理转向到服务号
    var zsks_mass_send_url= "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wx89c411811fef7bc6&corpsecret=MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1";
    request.get({url:zsks_mass_send_url}, function(err,httpResponse,body) {
        if(err || httpResponse.statusCode !== 200) {
            cb(new Error(err ? err.message : httpResponse.statusMessage));
        } else {
            console.log(JSON.stringify(body))
            cb(null,body);
        }
    });
};