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

exports.oauth = function(req, res, next) {//将school_id与corp_id 的基本信息绑定到session里

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
        var appid = (req.params.appid || req.query.appid);
        if(util.isNullOrUndefined(corp_id)){
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('未设置企业号')));
        }else{
            var wechatObj = wechat.getCorpManager(corp_id,appid);
            if(util.isNullOrUndefined(req.query.code)) {
                res.redirect(wechatObj.api.getAuthorizeURL(base_config.getURL() + req.originalUrl));
            }else{
                return new Promise(function(resolve, reject){
                    //此时返回的code
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
                        //在这里做一个异步进行的avatar获取
                        WxUser.Initialization_avatar_byuserid(result.UserId);
                        return WxUser.Initialization_school_bycorpid(corp_id);//修改
                    }else{
                        return Promise.reject(new Error('微信信息获取失败'));
                    }
                }).then(function(result){
                    if(result){
                        result.map(function(elem){
                                req.session.weixin_school = {//这里配置所有学校的信息
                                corpId:corp_id,
                                school_id:elem.schoolId,
                                teacherdep_id:elem.teacherdep_id,
                                parentdep_id:elem.parentdep_id,
                                homeworkapp_id:elem.homeworkapp_id,
                                performanceapp_id:elem.performanceapp_id,
                                classnoticeapp_id:elem.classnoticeapp_id,
                                questionnairapp_id:elem.questionnairapp_id,
                                studentsaveapp_id:elem.studentsaveapp_id,
                                token:elem.token,
                                secret:elem.secret,
                                encodingAESKey:elem.encodingAESKey,
                                otherapp_id:0
                            };
                        });
                        console.log("配饰企业号和school_id：：：："+JSON.stringify(req.session.weixin_school));
                    }else{
                        return Promise.reject(new Error('微信信息获取失败'));
                    }
                })
                .then(function() {
                    console.log("111"+req.originalUrl);
                    return res.redirect(req.originalUrl);
                }).catch(function(err){
                    return res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI(err.message)));
                });
            }
        }
    }
};