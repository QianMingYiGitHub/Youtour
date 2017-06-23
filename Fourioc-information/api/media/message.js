var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var path = require('path');
var config = require('../../api/config');
var crypto = require('../../api/crypto');
var WXBizMsgCrypt = require('wechat-crypto');
var access_token = require('../../api/get_accesstoken');
var wechat = require('wechat-enterprise');
var API = wechat.API;
var wechat_api = require('wechat-enterprise-api');
var Api_one=wechat_api.API;
var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// var base_config = {//去查询当前用户的学校id下的绑定信息
// 	token: 'vdb7w44H4nEMPpt9',
//  	encodingAESKey: '5zmGYZVoOi7qgMjRDJVy84T4HvbBo7uX0dEHWy9Xmqr',
//   	corpId: 'wx89c411811fef7bc6',//可以根据school_id进行绑定
//   	secret: 'MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1',//可以根据school_id进行绑定
//   	agentid:""//19//这个是appid
// };//这里得配置可以根据  存放到数据
//发送消息_安全守护
//var base_config2=get_allinfo();
module.exports.send_text= function(userid,text_content,base_config,cb) {
    var api = new API(base_config.corpId, base_config.secret, base_config.agentid);
    var id={touser:userid};
    var massage={
        msgtype: "text",
        text: {
            content: text_content
        },
        safe:0
        };
        api.send(id,massage,function(err,result){//给用户发送消息
            if(err){
                cb(err);
            }else{
                cb(null,result);
            }
        });
}
//新增通讯录人员
module.exports.add_user= function(userid,name,base_config,cb) {
    //config.agentid=19;//安全守护appid
    var api = new API(base_config.corpId, base_config.secret, base_config.agentid);
    var User={
        userid: userid,
        name: name,
        department: [base_config.agentid],//家长所在的部门id
        //position: "产品经理",
        mobile: userid,
        // gender: 1,
        // tel: "62394",
        // email: "zhangsan@gzdev.com",
        // weixinid: "zhangsan4dev"
        }
        api.createUser(User,function(err,result){//给用户发送消息
            if(err){
                cb(err);
            }else{
                cb(null,result);
            }
        });
}
//修改通讯录
module.exports.modify_user= function(userid,name,base_config,cb) {
    //config.agentid=19;//安全守护appid
    var api = new API(base_config.corpId, base_config.secret, base_config.agentid);
    var User={
        userid: userid,
        name: name,
       // department: [13],//家长所在的部门id
        //position: "产品经理",
        mobile: userid,
        // gender: 1,
        // tel: "62394",
        // email: "zhangsan@gzdev.com",
        // weixinid: "zhangsan4dev"
        }
        api.updateUser(User,function(err,result){//给用户发送消息
            if(err){
                cb(err);
            }else{
                cb(null,result);
            }
        });
}
//删除成员
module.exports.delete_user= function(userid,base_config,cb) {
    //config.agentid=19;//安全守护appid
    var api = new API(base_config.corpId, base_config.secret, base_config.agentid);
    var user_id=userid;
        api.deleteUser(user_id,function(err,result){//给用户发送消息
            if(err){
                cb(err);
            }else{
                cb(null,result);
            }
        });
}
//根据userid查询成员info
module.exports.get_user= function(userid,base_config,cb) {
    //config.agentid=19;//安全守护appid
    var api = new API(base_config.corpId, base_config.secret, base_config.agentid);
    var user_id=userid;
        api.getUser(user_id,function(err,result){//给用户发送消息
            if(err){
                cb(err);
            }else{
                cb(null,result);
            }
        });
}
//发送链接消息通知
module.exports.send_text_url= function(userid,appid,data,base_config,application_name,main_url,cb) {//测试成功
    base_config.agentid=appid;//安全守护appid
    var api = new API(base_config.corpId, base_config.secret, base_config.agentid);
    var id={touser:userid};
    var message = { msgtype: 'news',
                        news:{
                            articles:[
                                {
                                    title:data.student_name + application_name,
                                    description: data.teacher_name + ':' + decodeURI(decodeURI(data.content)),
                                    url:'http://' + config.getURL() +main_url+ '?corp_id='+base_config.corpId+'&appid='+appid + '&new_id=' + data.new_id +'&comment_id=' + data.comment_id 
                                }
                            ]
                         },
                    safe:0 }
        api.send(id,message,function(err,result){//给用户发送消息
            if(err){
                cb(err);
            }else{
                cb(null,result);
            }
        });
}
//随机获取五位数
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
