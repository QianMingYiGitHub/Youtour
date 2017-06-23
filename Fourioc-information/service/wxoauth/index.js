var util = require('util');
var wechat = require('../../api/wechat');
var base_config = require('../../api/config');
var WxUser = require('../../model/contact/wxUser');
var school_teacher = require('../../model/school/school_teacher');
var school_parent = require('../../model/school/school_parent');
function isOauthed(req) {
    return req.session.weixin && req.session.weixin.userid;
}
exports.isOauthed = isOauthed;

exports.oauth = function(req, res, next) {
    
    var roles = {
        'invalid':0,
        'student':1, 
        'teacher':2, 
        'parent':3 
    };
    if(isOauthed(req)) {
        next();
    }else {
        var corp_id = (req.params.corp_id || req.query.corp_id);
        if(util.isNullOrUndefined(corp_id)){
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('未设置企业号')));
        }else{
            var wechatObj = wechat.getCorpManager(corp_id);
            if(util.isNullOrUndefined(req.query.code)) {
                res.redirect(wechatObj.api.getAuthorizeURL(base_config.getURL() + req.originalUrl));
            }else{
                return new Promise(function(resolve, reject){
                    wechatObj.api.getUserIdByCode(req.query.code, function(err, result){
                        if(err){
                            return reject(err);
                        }
                        if(util.isNullOrUndefined(result)){
                            return reject(new Error('您不在企业号通讯录中，请与管理员联系!'));
                        }
                        return resolve(result);
                    });
                }).then(function(result){
                    if(result){
                        req.session.weixin = {
                            corpId: corp_id,
                            userid: result.UserId,
                            appid: result.appid
                        };
                        req.session.userid = result.UserId;
                        req.session.corpId = corp_id;
                        req.session.wx = {};
                        req.session.wx.userid = result.UserId;
                        req.session.wx.corpId = corp_id;
                        req.session.appid = req.query.appid;
                        return WxUser.getUserByUserId(corp_id,result.UserId);
                    }else{
                        return Promise.reject(new Error('微信信息获取失败'));
                    }
                }).then(function(result){
                    req.session.role = [];
                    console.log('getUserByUserId.result : ' + JSON.stringify(result));
                    if(result){
                        req.session.name = result.name;
                        req.session.mobile = result.mobile;
                        req.session.teacher = {};
                        req.session.parents = [];
                        return school_teacher.getTeacherByMobile(corp_id, result.mobile);
                    }else{
                        console.log('getUserByUserId return null!');
                    }
                }).then(function(teacher){
                    if(teacher){
                        req.session.role.push(roles['teacher']);
                        req.session.teacher.id = teacher.userid;
                        req.session.teacher.teacherId = teacher._id;
                        req.session.teacher.name = teacher.teacherName;
                        req.session.teacher.nickname = teacher.teacherNickName;
                        console.log('teacher = ' + JSON.stringify(teacher));
                        return school_parent.getParentsByMobile(corp_id, teacher.teacherTel).then(function (parents) {
                            req.session.parents = parents;
                            if(parents.length){
                                req.session.role.push(roles['parent']);
                                req.session.role.push(roles['student']);
                            }
                            return Promise.resolve();
                        });
                    } else {
                        return Promise.resolve();
                    }
                }).then(function() {
                    return res.redirect(req.originalUrl);
                }).catch(function(err){
                    return res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI(err.message)));
                });
            }
        }
    }
};