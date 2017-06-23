var express = require('express');
var router = express.Router();
var util = require('util');
// var orderSvc = require('../../../../service/order');
var Promise = require('promise');
/* GET home page. */

router.post('/notify', function(req, res, next) {
    return orderSvc.orderPay(req.body.orderId).then(function(){
        return res.json({
            success: -0,
            desc: 'success',
            data:{}
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc: err.message,
            data:{}
        });
    });
});

module.exports = router;