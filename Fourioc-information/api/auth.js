var util = require('util');
var wechat = require('./wechat');
var WxUser = require('../model/contact/wxUser');
var school_teacher = require('../model/school/school_teacher');
var school_parent = require('../model/school/school_parent');
/**
 * 合法用户校验
 */
exports.vaildUserCheck = function(session){
    if(util.isNullOrUndefined(session)){
        return false;
    }
    //判断是否存在用户id
    if(util.isNullOrUndefined(session.userid)){
        return false;
    }
    //判断用户来源，是微信还是web浏览器
    if(util.isNullOrUndefined(session.userfrom)){
        return false;
    }
    switch(session.userfrom){
        case 1://微信用户,判断是否为微信通讯录中用户
        break;
        case 2://非微信用户，通常是管理员
        break;
    }
    return true;
}
/**
 * 用户权限检测
 */
exports.permissionCheck = function(){
    return true;
}

exports.weixinUserCheck = function(req, res, next){
    
    var roles = {
        "invalid":0,
        "student":1, 
        "teacher":2, 
        "parent":3 
    };
    if(req.session.wx && req.session.wx.userid && req.session.wx.corpId){
        req.session.appid = req.query.appid;
        next();
    }else if(req.query.code){
        var wechatObj = wechat.getCorpManager(req.query.corp_id);
        if(util.isNullOrUndefined(wechatObj)){
            return res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('该企业号为无效用户')));
        }
        return new Promise(function(resolve, reject){
            wechatObj.api.getUserIdByCode(req.query.code, function(err, result){
                console.log("getUserIdByCode.result : " + JSON.stringify(result));
                if(err){
                    return reject(err);
                }
                if(util.isNullOrUndefined(result)){
                    return reject(new Error('您不在企业号通讯录中，请与管理员联系!'));
                }
                return resolve(result);
            })
        }).then(function(result){
            if(result){
                req.session.userid = result.UserId;
                req.session.corpId = req.query.corp_id;
                req.session.wx = {};
                req.session.wx.userid = result.UserId;
                req.session.wx.corpId = req.query.corp_id;
                req.session.appid = req.query.appid;
                return WxUser.getUserByUserId(req.query.corp_id,result.UserId);
            }else{
                return Promise.reject(new Error("微信信息获取失败"));
            }
        }).then(function(result){
            req.session.role = [];
            console.log("getUserByUserId.result : " + JSON.stringify(result));
            if(result){
                req.session.name = result.name;
                req.session.mobile = result.mobile;
                req.session.teacher = {};
                req.session.parents = [];
                return school_teacher.getTeacherByMobile(req.query.corp_id, result.mobile);
            }else{
                console.log('getUserByUserId return null!');
            }
        }).then(function(teacher){
            if(teacher){
                req.session.role.push(roles["teacher"]);
                req.session.teacher.id = teacher.userid;
                req.session.teacher.teacherId = teacher._id;
                req.session.teacher.name = teacher.teacherName;
                req.session.teacher.nickname = teacher.teacherNickName;
            }
            return school_parent.getParentsByMobile(req.query.corp_id, teacher.teacherTel).then(function (parents) {
                req.session.parents = parents;
                if(parents.length){
                    req.session.role.push(roles["parent"]);
                    req.session.role.push(roles["student"]);
                }
            });
        }).then(function(){
            next();
        }).catch(function(err){
            return res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI(err.message)));
        })
    }else{
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('请使用微信浏览')));
    }
}