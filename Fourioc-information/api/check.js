var wechat = require('../api/wechat');
var WxUser = require('../model/contact/wxUser');
var Teacher = require('../model/school/teacher');
var Parent = require('../model/school/parent');
var school_teacher = require('../model/school/school_teacher');
var school_parent = require('../model/school/school_parent');
var util = require('util');
exports.checkTeacher = function(user){
  return school_teacher.isTeacher(user.corpId, user.userid);
}

exports.checkParent = function(user){
  return school_parent.isParent(user.corpId, user.userid);
}
exports.checkUser = function(req, res, next){
  if(req.session.userid&&req.session.corpId){
    next();
  }else if(req.query.code){
      var wechatObj = wechat.getCorpManager(req.query.corp_id);
      if(util.isNullOrUndefined(wechatObj)){
          return res.send("无效请求");
      }
      new Promise(function(resolve, reject){
          wechatObj.api.getUserIdByCode(req.query.code, function(err,result){
              if(err){
                  return reject(new Error("您不在企业号通讯录中，请与管理员联系!"));
              }
              return resolve(result);
          });
      }).then(function(result){
          req.session.userid = result.UserId;
          req.session.corpId = req.query.corp_id;
          req.session.appid = req.query.appid;
          return WxUser.getUserByUserId(req.query.corp_id,result.UserId);
      }).then(function(result){
          req.session.deptid = result.department;
          req.session.username = result.name;
          req.session.sex = result.gender;
          req.session.headpic = result.avatar;
          next();
      }).catch(function(err){
          res.send(err.message);
      });
  }else if(req.query.user_id && req.query.corp_id && req.query.appid){
      // res.send("illegal request");
      WxUser.getUserByUserId(req.query.corp_id,req.query.user_id)
      .then(function(result){
          req.session.userid = req.query.user_id;
          req.session.appid = req.query.appid;
          req.session.corpId = req.query.corp_id;
          req.session.deptid = result.department;
          req.session.username = result.name;
          req.session.sex = result.gender;
          req.session.headpic = result.avatar;
          next();
      }).catch(function(err){
          res.send(err.message);
      });
  }else{
      wxUser.getUserByUserId("wx89c411811fef7bc6","tangzl")
      .then(function(result){
          req.session.userid = req.query.user_id;
          req.session.appid = req.query.appid;
          req.session.corpId = req.query.corp_id;
          req.session.deptid = result.department;
          req.session.username = result.name;
          req.session.sex = result.gender;
          req.session.headpic = result.avatar;
          next();
      }).catch(function(err){
          res.send(err.message);
      });
  }
}