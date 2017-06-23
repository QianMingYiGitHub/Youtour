var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var util = require('util');

var express = require('express');
var router = express.Router();
var wechat = require('../../api/wechat');
var request = require('request');
var fs = require('fs');
var path = require('path');
var config = require('../../api/config');
var crypto = require('../../api/crypto');
var WXBizMsgCrypt = require('wechat-crypto');
var access_token = require('../../api/get_accesstoken');
//var wechat = require('wechat-enterprise');
var API = wechat.API;
var wechat_api = require('wechat-enterprise-api');
var Api_one=wechat_api.API;
// var departmentSvc = require('../service/department');
// var userSvc = require('../service/user');

var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function generateMixed(n) {
    var res = '';
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}
/* GET users listing. */
//企业号回调函数配置
router.get('/msg', function (req, res, next) {
    var msg_signature = req.query.msg_signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;
	var cryptor = new WXBizMsgCrypt(config.getToken(), config.getEncodingAESKey(), req.query.corpId)
	var s = cryptor.decrypt(echostr);
	res.send(s.message);
});
router.post('/msg', function (req, res, next) {//不加会报错
    var msg_signature = req.query.msg_signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	//var echostr = req.query.echostr;
	//var cryptor = new WXBizMsgCrypt(config.getToken(), config.getEncodingAESKey(), req.query.corpId)
	//var s = cryptor.decrypt(echostr);
	res.send();
});
//获取access_token
router.get('/get_accesstoken', function (req, res, next) {
    access_token.get_accesstoken(function(err,result){
        if(err){
            console.log(err);
        }else{
           res.json({
               data:result
           })
        }
    });
});
//发送消息
router.get('/send', function (req, res, next) {
    console.log("当前时间："+new Date().toLocaleString());
var config = {
	token: 'vdb7w44H4nEMPpt9',
 	encodingAESKey: '5zmGYZVoOi7qgMjRDJVy84T4HvbBo7uX0dEHWy9Xmqr',
  	corpId: 'wx89c411811fef7bc6',
  	secret: 'MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1',
  	agentid : 19
};
var api = new API(config.corpId, config.secret, config.agentid);
var id={touser:"18304077397"};
var massage={
    msgtype: "text",
    text: {
        content: "您的孩子于"+new Date().toLocaleString()+"出入学校"
    },
    safe:0
    };
    api.send(id,massage,function(err,result){//给用户发送消息
        if(err){
            console.log(err);
            res.json({
                data:"fail"
            });
        }else{
            res.json({
                data:result
            });
        }
    });
});
router.get('/msg_access_token', function (req, res, next) {
    if (req.query.corpId && req.query.appid) {
        var info={corpId:req.query.corpId,secret:config.getCorpSecret(req.query.corpId)};
        var corpApp_one = wechat.createCorpManager(info);
        var corpApp = wechat.getCorpManager(req.query.corpId,req.query.appid);
        if (corpApp) {
           // WXBizMsgCrypt.VerifyURL校验方法 
            //xcpt = new WXBizMsgCrypt(sToken, sEncodingAESKey, sCorpID);//这是一个校验方法
           // sEchoStr = wxcpt.VerifyURL(sVerifyMsgSig, sVerifyTimeStamp,sVerifyNonce, sVerify
           console.log("需要解密的密文："+req.query.echostr);
           var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}} 
           var decodedString = Base64.decode(req.query.echostr);
            console.log(decodedString);
          // var key = "123456789";
          // console.log(crypto.aesDecryption(req.query.echostr,key));
           res.send();//返回解密的明文msg
           
            // 1.对密文BASE64解码：aes_msg=Base64_Decode(msg_encrypt)
            // 2.使用AESKey做AES解密：rand_msg=AES_Decrypt(aes_msg)
            // 3.验证解密后$CorpID、msg_len
            // 4.去掉rand_msg头部的16个随机字节，4个字节的msg_len,和尾部的$CorpID即为最终的消息体原文msg
            //corpApp.middlewarify(req, res, next);
        } else {
            var err = 'corpid :' + req.query.corpId + ', appid : ' + req.query.appid + ' --is not created';
            console.log(new Error(err));
            res.send(err);
        }
    } else {
        res.send('invalid request');
    }
});
router.post('/msg', function (req, res, next) {
    if (req.query.corpId && req.query.appid) {
        var corpApp = wechat.getCorpManager(req.query.corpId, req.query.appid);
        if (corpApp) {
            corpApp.middlewarify(req, res, next);
        } else {
            var err = 'corpid :' + req.query.corpid + ', appid : ' + req.query.appid + ' --is not created';
            console.log(new Error(err));
            res.send(err);
        }
    } else {
        res.send('invalid request');
    }
});


router.post('/jsconfig/get', function (req, res, next) {
    var corpApp = wechat.getCorpManager((req.session.corpId || req.body.corpId),(req.session.appid || req.body.appid));
    if (corpApp === null) {
        return res.json({
            success: -1,
            desc: 'no corpId',
            data: {}
        });
    }
    console.log('/jsconfig/get.body:' + JSON.stringify(req.body));
    new Promise(function (resolve, reject) {
        corpApp.api.getJsConfig({
            debug: (req.body.debug || false),
            jsApiList: req.body.jsApiList,
            url: (req.body.url || req.headers.referer)
        }, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    }).then(function (result) {
        return res.json({
            success: 0,
            desc: 'success',
            data: result
        });
    }).catch(function (err) {
        return res.json({
            success: -1,
            desc: err.message,
            data: {}
        });
    });
});
//上传图片修改
router.post('/upload/image', function (req, res, next) {
    //无按钮传图片 
    var form = new multiparty.Form({
       uploadDir:path.join(__dirname, '../..', 'public','integration_image') //join是路径的合并
    });
    //设置单文件大小限制
    form.maxFilesSize = 4 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和
    form.parse(req, function(err, fields, files) {
        if(err){
            console.log("错误信息："+err);
            res.json({
                success: -1,
                desc: err.message,
                data:{}
            });
        }else{
            if(util.isNullOrUndefined(fields.imgData) || fields.imgData.length === 0){//此时是批量上传
                return res.json({
                    success: -1,
                    desc: 'fail',
                    data:{}
                });
            }else{
                var promises = [];
                fields.imgData.forEach(function (imgData) {
                    promises.push(new Promise(function (resolve, reject) {
                        var match_array = imgData.match(/^data:image\/(\w+);base64,/);
                        console.log("match_array:"+match_array);
                        var ext = '';
                        if(match_array){
                            ext = ext.concat('.',match_array[1]);
                            console.log("ext:::::"+ext);
                            //console.log("generateMixed:"+generateMixed(5));
                            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
                            var dataBuffer = new Buffer(base64Data, 'base64');
                            var filename = path.join('/integration_image',Date.now() + '-'+ generateMixed(5)+ ext).replace(/\\/g,'/');
                            fs.writeFile(path.join(__dirname,'../..','public',filename), dataBuffer, function(err) {
                                if(err){
                                    return reject(err);
                                }else{
                                    return resolve(filename);
                                }
                            });
                        }else{
                            return reject(new Error('类型错误'));
                        }
                    }));
                });
                return Promise.all(promises).then(function (urls) {//注意promiss的使用
                    console.log("返回的url:"+urls);
                    return res.json({
                        success: 0,
                        desc:'success',
                        data:{
                            url:urls.toString()
                        }
                    });
                }).catch(function (err) {
                    return res.json({
                        success: -1,
                        desc: err.message,
                        data:{}
                    });
                });
            }
        }
    });
    // var corpApp = wechat.getCorpManager((req.session.corpId || req.body.corpId));
    // if (corpApp === null) {
    //     return res.json({
    //         success: -1,
    //         desc: 'no corpId',
    //         data: {}
    //     });
    // }
    // corpApp.api.getMedia(req.body.media_id, function (err, result, response) {
    //     if (err) {
    //         return Promise.reject(err);
    //     }
    //     console.log('res = ' + JSON.stringify(response));
    //     var image_name = '' + Date.now() + '-' + generateMixed(16);
    //     console.log('image_name = ' + image_name);
    //     fs.writeFile(path.join(__dirname, '../public/images/') + image_name, result, function (err) {
    //         if (err) {
    //             return res.json({
    //                 success: -1,
    //                 desc: err.message,
    //                 data: {}
    //             });
    //         }
    //         return res.json({
    //             success: 0,
    //             desc: 'success',
    //             data: { pic_url: '/images/' + image_name }
    //         });
    //     });
    // });
});

router.post('/upload/voice', function (req, res, next) {
    var corpApp = wechat.getCorpManager((req.session.corpId || req.body.corpId));
    if (corpApp === null) {
        return res.json({
            success: -1,
            desc: 'no corpId',
            data: {}
        });
    }
    corpApp.api.getMedia(req.body.media_id, function (err, result, response) {
        if (err) {
            return Promise.reject(err);
        }
        console.log('res = ' + JSON.stringify(response));
        fs.writeFile('public/voices/' + response.headers.filename, result, function (err) {
            if (err) {
                return res.json({
                    success: -1,
                    desc: err.message,
                    data: {}
                });
            }
            return res.json({
                success: 0,
                desc: 'success',
                data: { pic_url: '/voices/' + response.headers.filename }
            });
        });
    });
});

router.get('/sync_contact', function(req, res, next){
    return departmentSvc.syncWxDepartment(req.query.corpId).then(function(){
        return userSvc.syncWxContact(req.query.corpId);
    }).then(function(){
        return res.json({
            success:0,
            desc:'success',
            data:{}
        });
    }).catch(function(err){
        return res.json({
            success:-1,
            desc: err.message,
            data:{}
        });
    });
});
module.exports = router;
