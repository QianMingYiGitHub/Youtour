var express = require('express');
var router = express.Router();
var util = require('util');
// var orderSvc = require('../../../../service/order');
// var corpSvc = require('../../../../service/corp');
// var wxContactSvc = require('../../../../service/wxcontact');
var Promise = require('promise');
/* GET home page. */

router.get('/', function(req, res, next) {
    return orderSvc.findOrders({status:'SUCCESS'}).then(function(results){
        var goods = [];
        var promises = results.map(function(elem){
            return corpSvc.getCorp(elem.corpId).then(function(corp) {
                return wxContactSvc.getWxUser(elem.corpId, elem.userid).then(function(wxuser){
                    goods = goods.concat(elem.orders.map(function(order){
                        return {
                            corpName:corp.name,
                            userName:wxuser.name,
                            goods:{
                                remark:order.goods.remark,
                                name:order.goods.product.name,
                                summary:order.goods.product.summary,//商品介绍
                                content:order.goods.product.content,//商品详情，可自由使用，例如存储html内容
                                pics:order.goods.product.pics
                            },
                            order_time:order.goods.order_time,
                            expire_time:order.goods.expire_time,
                            count:order.goods.count,//购买数量
                            price:order.goods.price//支付金额，以分为单位
                        };
                    }));
                });
            });
        });
        return Promise.all(promises).then(function(){
            return res.json({
                success: 0,
                desc: 'success',
                data:{
                    goods:goods
                }
            });
        });
    })
    .catch(function(err){
        return res.json({
            success: -1,
            desc:err.message,
            data:{}
        });
    });
});

router.post('/', function(req, res, next) {
    return orderSvc.createNoPayOrder(req.body).then(function(result){
        //需要与YouPay交互，发起订单
        return res.json({
            success: 0,
            desc:'success',
            data:{}
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