var express = require('express');
var router = express.Router();
var Check = require('../../api/check');
var auth = require('../../api/auth');
var rateController = require('../../model/school/rate');
var util = require('util');
var logger = require('../../api/logger').logger;
var oauth = require('../../service/wxoauth');

// router.use(function(req, res, next){
//     console.log('rate/ use');
//     auth.weixinUserCheck(req, res, next);
// });

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

router.get('/list_publish', oauth.oauth, function(req, res, next){
    Check.checkTeacher(req.session)
    .then(function(isParent){
        if(isParent){
            res.redirect('/daily_performance/daily_performance_list.html?identity=1&type=1&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是老师，没有权限查看已发布评语')));
    });
});

router.get('/list_readed', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session)
    .then(function(isParent){
        if(isParent){
            res.redirect('/daily_performance/daily_performance_list.html?identity=2&type=1&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看已阅评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看已阅评语')));
    });
});

router.get('/read_rate', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session)
    .then(function(isParent){
        if(isParent){
            rateController.findParentRate(req.session.corpId, req.session.userid, req.query.sid, req.query.rate_id).then(function(result){
                logger.info('/read_rate.result = ' + JSON.stringify(result));
                if(util.isNullOrUndefined(result)){
                    res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，该条评语已删除')));
                }else{
                    if(result.state === 2){
                        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，该条评语已撤销')));
                    }else{
                        res.redirect('/daily_performance/daily_performance_detail.html?identity=2&type=0&user_id='+req.session.userid + '&corp_id='+req.session.corpId+'&rate_id='+req.query.rate_id + '&sid='+req.query.sid);
                    }
                }
            }).catch(function(err){
                res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI(err.message)));
            });
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看已阅评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看已阅评语')));
    });
});

router.get('/list_noread', oauth.oauth, function(req, res, next){
    Check.checkParent(req.session)
    .then(function(isParent){
        if(isParent){
            res.redirect('/daily_performance/daily_performance_list.html?identity=2&type=0&user_id='+req.session.userid + '&corp_id='+req.session.corpId);
        }else{
            res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看未阅评语')));
        }
    }).catch(function(err){
        res.redirect('/common/invalid.html?msg='+encodeURI(encodeURI('对不起，您不是家长，没有权限查看未阅评语')));
    });
});

module.exports = router;