var express = require('express');
var router = express.Router();
var oauth = require('../wxoauth');
var wx_questionnair_c = require('../../controller/wxrequest_c/wx_questionnair_c');
var Wechat = require('../../api/wechat');
var Check = require('../../api/check');
var classes_c = require('../../controller/classes_c');
//var rateController = require('../model/school/rate');
 
var logger = require('./../../api/logger').logger;

//新建草稿=====老师发送消息
router.post('/save_draft', function(req, res, next){
    wx_questionnair_c.save_draft(req, res, next);
})
//查询草稿
router.post('/get_draft', function(req, res, next){
    wx_questionnair_c.teacher_getcomment(req, res, next);
})

router.get('/add_questionnair', oauth.oauth, function(req, res, next) {
    Check.checkTeacher(req.session).then(function(isTeacher){
      if(isTeacher){
          res.redirect('/questionnaire/questionnaire_edit.html?identity=3&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
      }else{
          res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限发布问卷')));
      }
  }).catch(function(err){
      res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限发布问卷')));
  });
});
router.get('/list_draft', oauth.oauth, function(req, res, next) {
  // res.redirect('/homework/homework_list.html?&user_id=tangzl&homework_id=5742c78c338e680c19d06c63')  
  // res.end('no html!');
    Check.checkTeacher(req.session).then(function(isTeacher){
      if(isTeacher){
          res.redirect('/questionnaire/questionnaire_list.html?type=0&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
      }else{
          res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看草稿')));
      }
  }).catch(function(err){
      res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看草稿')));
  });
});
router.get('/list_publish', oauth.oauth, function(req, res, next) {
    Check.checkTeacher(req.session).then(function(isTeacher){
      if(isTeacher){
          res.redirect('/questionnaire/questionnaire_list.html?type=1&user_id='+ req.session.userid + '&corp_id='+req.session.corpId);
      }else{
          res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布作业')));
      }
  }).catch(function(err){
      res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布作业')));
  });
  // res.redirect('http://m.sui.taobao.org/demos/');
});
router.get('/list_closed', oauth.oauth, function(req, res, next) {
    Check.checkTeacher(req.session)
  .then(function(isTeacher){
      if(isTeacher){
          res.redirect('/questionnaire/questionnaire_list.html?type=2&user_id='+ req.session.userid + '&corp_id='+req.session.corpId);
      }else{
          res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已关闭作业')));
      }
  }).catch(function(err){
      res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已关闭作业')));
  });
  // res.redirect('http://gmu.baidu.com/demo/#');
});
router.get('/list_unjoined', oauth.oauth, function(req, res, next) {
    res.redirect('/questionnaire/questionnaire_list.html?type=3&user_id='+ req.session.userid + '&corp_id='+req.session.corpId);
  // res.redirect('http://t.amazeui.org/kitchen-sink/');
});
router.get('/list_joined', oauth.oauth, function(req, res, next) {
    res.redirect('/questionnaire/questionnaire_list.html?type=4&user_id='+ req.session.userid + '&corp_id='+req.session.corpId);
  // res.redirect('http://frozenui.github.io/frozenui/demo/index.html');
});

router.get('/read_questionnair', oauth.oauth, function(req, res, next) {
    if(req.session.corpId != req.query.corp_id){
        return res.redirect('/common/invalid.html?&msg='+encodeURI(encodeURI('对不起，您无法查看该问卷调查')) + '&reason=' + encodeURI(encodeURI('不在相同企业号内')));
    }else if(req.session.userid !== req.query.user_id){
        return res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您无法查看他人的问卷调查')));
    }else{
        return res.redirect('/questionnaire/questionnaire_detail.html?type='+req.query.type + '&corp_id=' + req.session.corpId + '&questionnaire_id=' + req.query.questionnaire_id + '&user_id=' + req.query.user_id + '&identity=' + req.query.identity + '&sid=' + req.query.ext);
    }
});

router.get('/message_push', oauth.oauth, function(req, res, next){
    if(req.session.corpId != req.query.corp_id){
        return res.redirect('/common/invalid.html?&msg='+encodeURI(encodeURI('对不起，您无法查看该问卷调查')) + '&reason=' + encodeURI(encodeURI('不在相同企业号内')));
    }else if(req.session.userid !== req.query.user_id){
        return res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您无法查看他人的问卷调查')));
    }else{
        return res.redirect('/questionnaire/questionnaire_detail.html?' + Object.keys(req.query).map(function(key){
            return '' + key + '=' + req.query[key];
        }).join('&'));
    }
});
module.exports = router;