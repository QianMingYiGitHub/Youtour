var express = require('express');
var router = express.Router();
var util = require('util');
//var goodsSvc = require('../../../../service/goods');
/* GET home page. */
router.post('/', function(req, res, next) {
    return goodsSvc.addGoods(req.body).then(function(result){
        return res.json({
            success: 0,
            desc: 'success',
            data:{}
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

router.get('/', function(req, res, next) {
    return goodsSvc.getAllGoods().then(function(results){
        return res.json({
            success: 0,
            desc: 'success',
            data:{
                goods:results.map(function(elem){
                    return {
                        _id: elem._id,
                        product:elem.product,
                        remark:elem.remark,
                        price:elem.price,
                        time_unit:elem.time_unit,
                        formula:elem.formula
                    };
                })
            }
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

router.get('/:goodsId', function(req, res, next) {
    return goodsSvc.getGoods(req.params.goodsId).then(function(result){
        if(util.isNullOrUndefined(result)){
            return res.json({
                success: -1,
                desc:'该商品不存在',
                data:{}
            });
        }
        return res.json({
            success: 0,
            desc: 'success',
            data:{
                goods:result
            }
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

router.post('/:goodsId', function(req, res, next) {
    return goodsSvc.updateGoods(req.params.goodsId, req.body).then(function(result){
        if(util.isNullOrUndefined(result)){
            return res.json({
                success: -1,
                desc:'该商品不存在',
                data:{}
            });
        }
        return res.json({
            success: 0,
            desc: 'success',
            data:{
                goods:result
            }
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

module.exports = router;