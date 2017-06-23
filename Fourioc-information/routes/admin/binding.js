/**
 * Created by Think on 2016/11/30.
 */
var express = require('express');
var router = express.Router();
var oauth = require('../wxoauth');
var classes_c = require('../../controller/classes_c');
var Wechat = require('../../api/wechat');
var Check = require('../../api/check');
/* GET home page. */
//微信转接页
router.get('/binding_phone',oauth.oauth,function(req, res, next) {
   // var corp={corpId:"wx89c411811fef7bc6",secret:"MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1"};
   // Wechat.createCorpManager(corp);
  Check.checkTeacher(req.session)
    .then(function(isTeacher){
        if(isTeacher){
            res.redirect('/activity/activity_edit.html?identity=3&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您没有权限发布活动通知')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您没有权限发布活动通知')));
    }); 
});
router.get('/list_draft', oauth.oauth, function(req, res, next){
    // Check.checkTeacher(req.session)
    // .then(function(isTeacher){
    //     if(isTeacher){
    //         res.redirect('/activity/activity_list.html?identity=3&type=0&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
    //     }else{
    //         res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看草稿')));
    //     }
    // }).catch(function(err){
    //     res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看草稿')));
    // });
});
// router.get('/add_case_v',oauth({success:'/security_case/add_case_v'}), function(req, res, next) {
//     res.render('security_case_add_v', {});
// });
// router.get('/binding_parent_phone', function(req, res, next) {
//     classes_c.binding_parent_phone(req, res, next);
// });
// //web测试
// router.get('/binding_phone' ,function(req, res, next) {
//     //验证成功后可以根据这个openid  检测是否绑定+没绑定跳转+绑定页面||绑定+跳转location页面
//      classes_c.binding_Phone(req, res, next);
// });
module.exports = router;
