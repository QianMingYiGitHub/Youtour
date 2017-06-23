var util = require('util');
var async = require('async');
var Promise = require('promise');
var request = require('request');
var express = require('express');
// var oauth = require('../api/auth');
var oauth = require('../../service/wxoauth');
var router = express.Router();
var logger = require('../../api/logger').logger;
var whgxAsyncQueue = async.queue(function (task, callback) {
    if (util.isFunction(task.handler)) {
        task.handler(callback);
    } else {
        console.log('task.handler is not function!');
        callback(new Error('task.handler is not function!'));
    }
});
function getclassid(classname) {
    var class_ch = {};
    return (function () {
        if (util.isNullOrUndefined(class_ch[classname])) {
            return new Promise(function (resolve, reject) {
                request.get('http://218.24.93.71:8080/discovery/proxy/site/libmanage/zhuanti/listwx', { timeout: 5000 }, function (err, response, body) {
                    if (!err && response.statusCode === 200) {
                        try {
                            body = JSON.parse(body);
                            body.catagory.forEach(function (elem) {
                                class_ch[elem.classname] = {
                                    classid: elem.classid,
                                    classid_parent: elem.classid_parent
                                };
                            });
                            if (util.isNullOrUndefined(class_ch[classname])) {
                                return reject(new Error('没有该专题'));
                            } else {
                                return resolve(class_ch[classname].classid);
                            }
                        } catch (err) {
                            return reject(err);
                        }
                    } else {
                        return reject(err || (new Error('statusCode = ' + response.statusCode)));
                    }
                });
            });
        } else {
            console.log();
            return Promise.resolve(class_ch[classname].classid);
        }
    })();
}
router.get('/classic_film', oauth.oauth, function (req, res) {
    console.log('/classic_film');
    whgxAsyncQueue.push({
        handler: function (callback) {
            getclassid('电视剧')
                .then(function (classid) {
                    return new Promise(function (resolve, reject) {
                        request.get('http://218.24.93.71:8080/discovery/proxy/site/libmanage/zhuanti/videoslistPM/' + classid, { timeout: 5000 }, function (err, response, body) {
                            if (!err && response.statusCode === 200) {
                                logger.info('/classic_film. success');
                                res.json({
                                    success: 0,
                                    desc: 'success',
                                    data: body
                                });
                                callback();
                            } else {
                                callback(err || (new Error('' + response.statusCode)));
                            }
                        });
                    });
                })
                .catch(function (err) {
                    callback(err);
                });
        }
    }, function (err) {
        if (err) {
            logger.error('/classic_film. err = ' + err.message);
            res.json({
                success: -1,
                desc: err.message,
                data: {}
            });
        }
    });
});

router.get('/art_class', oauth.oauth, function (req, res) {
    console.log('/art_class');
    whgxAsyncQueue.push({
        handler: function (callback) {
            getclassid('美术课堂')
                .then(function (classid) {
                    return new Promise(function (resolve, reject) {
                        request.get('http://218.24.93.71:8080/discovery/proxy/site/libmanage/zhuanti/videoslistPM/' + classid, { timeout: 5000 }, function (err, response, body) {
                            if (!err && response.statusCode === 200) {
                                logger.info('/art_class. success');
                                res.json({
                                    success: 0,
                                    desc: 'success',
                                    data: body
                                });
                                callback();
                            } else {
                                callback(err || (new Error('' + response.statusCode)));
                            }
                        });
                    });
                })
                .catch(function (err) {
                    callback(err);
                });
        }
    }, function (err) {
        if (err) {
            logger.error('/art_class. err = ' + err.message);
            res.json({
                success: -1,
                desc: err.message || err,
                data: {}
            });
        }
    });
});

router.get('/culture_class', oauth.oauth, function (req, res) {
    console.log('/culture_class');
    whgxAsyncQueue.push({
        handler: function (callback) {
            getclassid('文史讲堂').then(function (classid) {
                    classid = 'DF62F63BCE264965AF4E0BDD1A21AB6F';
                    return new Promise(function (resolve, reject) {
                        request.get('http://218.24.93.71:8080/discovery/proxy/site/libmanage/zhuanti/videoslistPM/' + classid, { timeout: 5000 }, function (err, response, body) {
                            if (!err && response.statusCode === 200) {
                                logger.info('/culture_class. success');
                                res.json({
                                    success: 0,
                                    desc: 'success',
                                    data: body
                                });
                                callback();
                            } else {
                                callback(err || (new Error('' + response.statusCode)));
                            }
                        });
                    });
                })
                .catch(function (err) {
                    callback(err);
                });
        }
    }, function (err) {
        if (err) {
            logger.error('/culture_class. err = ' + err.message);
            res.json({
                success: -1,
                desc: err.message,
                data: {}
            });
        }
    });
});

router.get('/html/classic_film', oauth.oauth, function (req, res) {
    res.redirect('/jing_dian_ying_shi/video_list.html');
});


router.get('/html/culture_class/:corp_id', oauth.oauth, function (req, res) {
    res.redirect('/wen_shi_jiang_tang/wen_shi_jiang_tang.html');
});

router.get('/html/teacher_class/:corp_id', oauth.oauth, function (req, res) {
    res.redirect('/ming_shi_jiang_tang/ming_shi_jiang_tang.html');
});
router.get('/html/teacher_class',  function (req, res) {
    res.redirect('/ming_shi_jiang_tang/ming_shi_jiang_tang.html');
});
module.exports = router;