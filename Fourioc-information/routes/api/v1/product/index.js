var express = require('express');
var router = express.Router();
var util = require('util');
// var productSvc = require('../../../../service/product');
/* GET home page. */
router.post('/', function(req, res, next) {
    return productSvc.addProduct(req.body).then(function(result){
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
    return productSvc.getProducts().then(function(results){
        return res.json({
            success: 0,
            desc: 'success',
            data:{
                products:results.map(function(elem){
                    return {
                        _id: elem._id,
                        service:elem.service,
                        name:elem.name,
                        pics:elem.pics,
                        content:elem.content
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

router.get('/:productId', function(req, res, next) {
    return productSvc.getProduct(req.params.productId).then(function(result){
        if(util.isNullOrUndefined(result)){
            return res.json({
                success: -1,
                desc:'该产品不存在',
                data:{}
            });
        }
        return res.json({
            success: 0,
            desc: 'success',
            data:{
                product:{
                    _id: result._id,
                    service:result.service,
                    name:result.name,
                    pics:result.pics,
                    content:result.content
                }
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