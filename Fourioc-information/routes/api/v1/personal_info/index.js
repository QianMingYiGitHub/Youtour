var express = require('express');
var router = express.Router();
// var personalSvc = require('./../../../../service/personal_info');
/* GET home page. */
router.get('/info', function(req, res, next) {
    return personalSvc.getOwnInfo(req.session.corpId||req.query.corpId, req.session.userid||req.query.userid).then(function(result){
        return res.json({
            success: 0,
            desc:'success',
            data:{
                info:{
                    name:result.name,
                    mobile:result.mobile,
                    avatar:result.avatar,
                    identity:result.identity
                }
            }
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.get('/classes', function(req, res, next) {
    return personalSvc.getOwnClasses(req.session.corpId||req.query.corpId, req.session.userid||req.query.userid).then(function(result){
        return res.json({
            success: 0,
            desc: 'success',
            data:result
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.get('/products', function(req, res, next) {
    return personalSvc.getProducts(req.session.corpId||req.query.corpId, req.session.userid||req.query.userid).then(function(result){
        return res.json({
            success: 0,
            desc: 'success',
            data:result
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.get('/scores', function(req, res, next) {
    return personalSvc.getOwnScore(req.session.corpId||req.query.corpId, req.session.userid||req.query.userid).then(function(result){
        return res.json({
            success: 0,
            desc: 'success',
            data:result
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.post('/pay', function(req, res, next) {
    return personalSvc.orderPay(req.session.corpId||req.body.corpId, req.session.userid||req.body.userid, req.body).then(function(result){
        return res.json({
            success: 0,
            desc: 'success',
            data:result
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

router.post('/feedback', function(req, res, next) {
    return personalSvc.feedback(req.session.corpId||req.body.corpId, req.session.userid||req.body.userid, req.body).then(function(result){
        return res.json({
            success: 0,
            desc: 'success',
            data:result
        });
    }).catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

module.exports = router;