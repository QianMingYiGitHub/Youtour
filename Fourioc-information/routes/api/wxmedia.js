/**
 * Created by Think on 2016/11/30.
 * 提供微信素材的上传，获取功能，提供微信图文消息的推送接口
 */
var express = require('express');
var router = express.Router();
var wechat_c = require('../../controller/wechat_c');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//上传图片流到微信素材
router.post('/upload_image', function (req, res, next) {
    wechat_c.uploadImage(req, res, next);
});
//上传封面到微信临时素材
router.post('/upload_cover', function (req, res, next) {
    wechat_c.uploadCover(req, res, next);
});
//上传图文消息素材
router.post('/upload_news_mp', function(req, res, next) {
    wechat_c.uploadNewsMaterial(req, res, next);
});
//群发图文消息
router.post('/mass_send', function (req, res, next) {
    wechat_c.massSendNews(req, res, next);
});
//上传photo
router.post('/uploadphoto', function(req, res, next) {
    wechat_c.uploadPhoto(req, res, next);
});
//上传voice
router.post('/uploadvoice', function(req, res, next) {
    wechat_c.uploadVoice(req, res, next);
});
//删除media
router.post('/deletemedia', function (req, res, next) {
    wechat_c.deleteMedia(req, res, next);
});




module.exports = router;
