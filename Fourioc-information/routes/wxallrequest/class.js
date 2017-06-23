/**
 * Created by Think on 2016/11/30.
 */
var express = require('express');
var router = express.Router();
var oauth = require('../wxoauth');
var wx_class_m = require('../../model/wxrequest_m/wx_class_m');
var wx_class_c = require('../../controller/wxrequest_c/wx_class_c');
var Wechat = require('../../api/wechat');
var Check = require('../../api/check');
var classes_c = require('../../controller/classes_c');
var Rate = require('../../model/school/rate');
var util=require('util');
//var rateController = require('../model/school/rate');
 
var logger = require('./../../api/logger').logger;
/* GET home page. */
//微信转接页  班级信息以及管理

//日常表现
//新建评语=====老师发送消息成功
router.post('/teacher_addcomment', function(req, res, next){
    wx_class_c.teacher_addcomment(req, res, next);
})
//页面获取我发起的评语
router.post('/teacher_getcomment', function(req, res, next){
    wx_class_c.teacher_getcomment(req, res, next);
})
//查看评语
router.post('/teacher_seecomment', function(req, res, next){
    wx_class_c.teacher_seecomment(req, res, next);
})
//页面获取班级家长信息//根据教师的phone获取  班级家长的信息
router.post('/teacher_getparentinfo', function(req, res, next   ){
    wx_class_c.teacher_getparentinfo(req, res, next);
})

//页面获取班级家长信息//根据教师的phone获取  班级家长的信息
router.post('/teacher_getallteacherinfo', function(req, res, next   ){
    wx_class_c.teacher_getparentinfo(req, res, next);
})


//获取个人信息
router.get('/getOwnInfo', function(req, res, next){
    wx_class_c.getOwnInfo(req, res, next);
})
//获取个人所在班级
router.get('/classes', function(req, res, next){
    wx_class_c.get_classes(req, res, next);
})
//页面跳转+路由
router.get('/add_rate', oauth.oauth, function(req, res, next){
    Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
            res.redirect('/daily_performance/daily_performance_edit.html?identity=1&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限发布评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限发布评语')));
    });    
});
//我发起的=====老师
router.get('/list_publish', oauth.oauth, function(req, res, next){
    Check.checkTeacher(req.session).then(function(isParent){
        if(isParent){
            console.log(req.session.corpId);
            res.redirect('/daily_performance/daily_performance_list.html?identity=1&type=1&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布评语')));
    });
});
//查看评语======家长已阅读
router.get('/list_readed', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session).then(function(isParent){
        if(isParent){
            res.redirect('/daily_performance/daily_performance_list.html?identity=2&type=1&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看已阅评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看已阅评语')));
    });
});
//
router.get('/read_rate', oauth.oauth, function(req, res, next){//
    Check.checkParent(req.session).then(function(isParent){
        if(isParent){
           console.log(JSON.stringify(req.query.comment_id));
           console.log(JSON.stringify(req.query.new_id));
             wx_class_m.findParentRate(req.session.corpId, req.session.userid,req.query.comment_id,req.query.new_id).then(function(result){
                logger.info('/read_rate.result = ' + JSON.stringify(result));
                if(util.isNullOrUndefined(result)){
                    res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，该条评语已删除')));
                }else{
                    console.log(result.state)
                    if(result.state === 1 ){
                        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，该条评语已撤销')));
                    }else{
                        res.redirect('/daily_performance/daily_performance_detail.html?identity=2&type=0&user_id='+req.session.userid + '&corp_id='+req.session.corpId+'&rate_id='+req.query.comment_id + '&sid='+req.query.new_id);
                    }
                }
            }).catch(function(err){
                res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI(err.message)));
            });
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看已阅评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('err对不起，您不是家长，没有权限查看已阅评语')));
    });
});
//查看评语======家长为阅读
router.get('/list_noread', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session)
    .then(function(isParent){
        if(isParent){
            res.redirect('/daily_performance/daily_performance_list.html?identity=3&type=0&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看未阅评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看未阅评语')));
    });
});


//个人信息的查询
router.get('/personal',oauth.oauth,function(req, res, next) {
    res.redirect('/my_info/my_info_home.html');
});






//班级通知
//添加班级通知
router.post('/teacher_addactivity', function(req, res, next){
    wx_class_c.teacher_addactivity(req, res, next);
})
router.post('/teacher_getactivity', function(req, res, next){
    wx_class_c.teacher_getactivity(req, res, next);
})
router.get('/add_activity', oauth.oauth, function(req, res, next){
    Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
            res.redirect('/activity/activity_edit.html?identity=3&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您没有权限发布活动通知')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您没有权限发布活动通知')));
    });    
});

router.get('/list_draft_activity', oauth.oauth, function(req, res, next){
    Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
            res.redirect('/activity/activity_list.html?identity=3&type=0&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看草稿')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看草稿')));
    });
});

router.get('/list_publish_activity', oauth.oauth, function(req, res, next){
    Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
            res.redirect('/activity/activity_list.html?identity=3&type=1&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布活动')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布活动')));
    });
});

router.get('/list_closed_activity', oauth.oauth, function(req, res, next){
    Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
            res.redirect('/activity/activity_list.html?identity=3&type=2&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已关闭活动')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已关闭活动')));
    });
});

//已经审阅
router.get('/list_readed_activity', oauth.oauth, function(req, res, next){
    res.redirect('/activity/activity_list.html?identity=0&type=3&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
});
//还没有审阅
router.get('/list_noread_activity', oauth.oauth, function(req, res, next){
    res.redirect('/activity/activity_list.html?identity=0&type=4&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
});

router.get('/read_activity', oauth.oauth, function(req, res, next) {
    res.redirect('/activity/activity_detail.html?' + Object.keys(req.query).map(function(key) {
        return key + '=' + req.query[key];
    }).join('&'));
});

router.get('/message_push', oauth.oauth, function(req, res, next){
    res.redirect('/activity/activity_detail.html?' + Object.keys(req.query).map(function(key){
        return '' + key + '=' + req.query[key];
    }).join('&'));
});



//家庭作业
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
//添加作业 通知
router.post('/teacher_addhomework', function(req, res, next){
    wx_class_c.teacher_addhomework(req, res, next);
})
//查询作业
router.post('/teacher_gethomework', function(req, res, next){
    wx_class_c.teacher_gethomework(req, res, next);
})
router.get('/add_homework', oauth.oauth, function(req, res, next) {
      Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
           res.redirect('/homework/homework_edit.html?user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您不是老师，不能新建作业')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，不能新建作业')));
    });
});
router.get('/draft_homework', oauth.oauth, function(req, res, next) {
      Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
           res.redirect('/homework/homework_list.html?type=0&user_id='+ req.session.userid + '&corp_id='+req.session.corpId);
        }else{
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您不是老师，不能查看草稿')));
        }
    }).catch(function(err){
        console.log(err);
         res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('err您不是老师，不能查看草稿')));
    });
});
router.get('/published_homework', oauth.oauth, function(req, res, next) {
      Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
             res.redirect('/homework/homework_list.html?type=1&user_id='+ req.session.userid + '&corp_id='+req.session.corpId);
        }else{
     res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您不是老师，不能查看已发布作业')));
        }
    }).catch(function(err){
        console.log(err);
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您不是老师，不能查看已发布作业')));
    });
  // res.redirect('http://m.sui.taobao.org/demos/');
});
router.get('/closed_homework', oauth.oauth, function(req, res, next) {
    Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
         res.redirect('/homework/homework_list.html?type=2&user_id='+ req.session.userid + '&corp_id='+req.session.corpId);
   
        }else{
         res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您不是老师，不能查看已关闭作业')));
        }
    }).catch(function(err){
        console.log(err);
          res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您不是老师，不能查看已关闭作业')));
    });
  // res.redirect('http://gmu.baidu.com/demo/#');
});
router.get('/noread_homework', oauth.oauth, function(req, res, next) {
     Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
         res.redirect('/homework/homework_list.html?type=3&user_id='+ req.session.wx.userid + '&corp_id='+req.session.corpId);

        }else{
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您的手机号未绑定，无法查看相关功能')));
        }
    }).catch(function(err){
        console.log(err);
           res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您的手机号未绑定，无法查看相关功能')));
    });
});
router.get('/readed_homework', oauth.oauth, function(req, res, next) {
        Check.checkTeacher(req.session).then(function(isTeacher){
        if(isTeacher){
        res.redirect('/homework/homework_list.html?type=4&user_id='+ req.session.wx.userid + '&corp_id='+req.session.corpId);
        }else{
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您的手机号未绑定，无法查看相关功能')));
        }
    }).catch(function(err){
        console.log(err);
           res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('您的手机号未绑定，无法查看相关功能')));
    });
});
router.get('/read_homework', oauth.oauth, function(req, res, next) {
    if(req.query.type == 3 && req.query.parentId){
        Homework.parentHomeworkUpdateState(req.session.corpId, req.query.homework_id,req.query.parentId, req.query.sid,1)
    .then(function(){
        res.redirect('/homework/homework_detail.html?type='+ req.query.type + '&user_id='+req.session.wx.userid + '&homework_id=' + req.query.homework_id + '&corp_id='+req.session.corpId);
    });
    }else
    res.redirect('/common/invalid.html?msg='+ encodeURI(encodeURI('无效链接!')));
});
router.get('/message_push', oauth.oauth, function(req, res, next){
    if(parseInt(req.query.identity) === 1){
        Homework.parentHomeworkUpdateState(req.session.corpId, req.query.homework_id,req.query.userid, req.query.sid,1)
        .then(function(){
            res.redirect('/homework/homework_detail.html?' + Object.keys(req.query).map(function(key){
                return '' + key + '=' + req.query[key];
            }).join('&'));
        });
    }else{
        res.redirect('/homework/homework_detail.html?' + Object.keys(req.query).map(function(key){
            return '' + key + '=' + req.query[key];
        }).join('&'));
    }
});

//查看学生位置信息
router.get('/student_position', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session).then(function(isParent){
        if(isParent){
            //根据 家长的手机号查询student_phone;
            console.log("家长电话："+req.session.userid);
             res.redirect('/student_position/student_position_list.html?user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
    });
});
//查看学生今日考勤信息
router.get('/student_position_puch', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session).then(function(isParent){
        if(isParent){
            //根据 家长的手机号查询student_phone;
            console.log("家长电话："+req.session.userid);
             res.redirect('/student_position/student_position_puch.html?user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
    });
});
//查看学生历史考勤信息
router.get('/student_position_allpuch', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session).then(function(isParent){
        if(isParent){
            //根据 家长的手机号查询student_phone;
            console.log("家长电话："+req.session.userid);
             res.redirect('/student_position/student_position_allpuch.html?user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
    });
});
//安全守护+未做
router.get('/student_position_securityguard', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session).then(function(isParent){
        if(isParent){
            //根据 家长的手机号查询student_phone;
            console.log("家长电话："+req.session.userid);
             res.redirect('/student_position/student_position_securityguard.html?user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看学生的位置信息！')));
    });
});
//查看学生位置信息
router.get('/student_position_web', function(req, res, next){
      res.redirect('/student_position/student_position_list.html?user_id='+"18304077397"+ '&corp_id='+req.session.corpId);
});


//查看学生位置信息 +web
router.get('/daily_performance', function(req, res, next){
      res.redirect('/daily_performance/daily_performance_list.html?identity=1&type=1&user_id='+"18304077397"+ '&corp_id='+"wx89c411811fef7bc6");
});
router.get('/daily_list', function(req, res, next){
      res.redirect('/daily_performance/daily_performance_edit.html?identity=1&type=1&user_id='+"18304077397"+ '&corp_id='+"wx89c411811fef7bc6");
});
//查看学生今日考勤+web
router.get('/puch', function(req, res, next){
      res.redirect('/student_position/student_position_puch.html?identity=1&type=1&user_id='+"18304077397"+ '&corp_id='+"wx89c411811fef7bc6");
});
//查看学生历史考勤+web
router.get('/allpuch', function(req, res, next){
      res.redirect('/student_position/student_position_allpuch.html?identity=1&type=1&user_id='+"18304077397"+ '&corp_id='+"wx89c411811fef7bc6");
});












module.exports = router;