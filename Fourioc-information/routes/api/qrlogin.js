/**
 * Created by Think on 2016/11/30.
 * 提供微信扫码登录功能
 */
var util = require('util');
var sys_identity_c = require('../../controller/sys_identity_c');
var session_c = require('../../controller/session_c');
var express = require('express');
var router = express.Router();

/**
 * 获取用户微信扫码的二维码内容
 */
router.get('/', function(req, res, next) {
    if(util.isNullOrUndefined(req.query.identity)) {
        return res.json({
            qrcode:"",
            qrcode_url:""
        });
    }else {
        res.json({
            qrcode:"",//qrcode的id，用于表明是那个二维码扫码登录
            qrcode_url:""
        });
    }
});

/**
 * 用户点击登录，确认授权登录
 */
router.post('/:identity/:qrcode', function(req, res, next) {
    if(session_c.isWxUserLogin(req)) {
        sys_identity_c.pushLoginInfo(req.params.identity, req.params.qrcode, session_c.getWxUserOpenid(req)).then(function(){
            return res.json({
                success: 0,
                desc:"success",
                data:{}
            });
        }).catch(function(err) {
            return res.json({
                success: 0,
                desc:"success",
                data:{}
            });
        });
    }else{
        return res.json({
            success: 0,
            desc:"success",
            data:{}
        });
    }
});

module.exports = router;