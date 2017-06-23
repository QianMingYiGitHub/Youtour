var fs = require('fs');
var util = require('util');
var multiparty = require('multiparty');
var Wechat = require('wechat');
var Api = require('wechat-api');
var OAuth = require('wechat-oauth');
var session_c = require('./session_w_c');
var uuidV1 = require('uuid/v1');

var State = function()  {
    this.states = {};
};
State.prototype.generateState = function () {
    // var state = generateMixed(16);
    var state = uuidV1();
    this.states[state] = setTimeout(function(store, state) {
        delete store.states[state];
    }, 10000, this, state);
    return state;
};

State.prototype.checkState = function (state) {
    if (util.isNullOrUndefined(state)) {
        return false;
    }
    // if (state === '') {
    //     return true;
    // }
    if (util.isNullOrUndefined(this.states[state])) {
        return false;
    }
    clearTimeout(this.states[state]);
    delete this.states[state];
    return true;
};


module.exports = (function () {
    //todo:需要加密 比对sign
    var weixin_config = {
       //
        appid:'wx89c411811fef7bc6',
        appsecret:'MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1',
        token: 'vdb7w44H4nEMPpt9',
        encodingAESKey: '5zmGYZVoOi7qgMjRDJVy84T4HvbBo7uX0dEHWy9Xmqr'
    };
    
    //测试域名
    var host_url = 'http://youtour.com.cn';
    
    function getUrl (subpath) {
        return host_url + subpath;
    }
    var state_store = new State();
    var oauth_client = new OAuth(weixin_config.appid, weixin_config.appsecret, function (openid, callback) {
        // 传入一个根据openid获取对应的全局token的方法
        // 在getUser时会通过该方法来获取token
        fs.readFile(openid +'_access_token.txt', 'utf8', function (err, txt) {
            if (err) {
                if (err.code === 'ENOENT') {
                    return callback(null, null);
                } else {
                    return callback(err);
                }
            }
            callback(null, JSON.parse(txt));
        });
    }, function (openid, token, callback) {
        // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
        // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
        // 持久化时请注意，每个openid都对应一个唯一的token!
        fs.writeFile(openid + '_access_token.txt', JSON.stringify(token), callback);
    });
    var api = new Api(weixin_config.appid, weixin_config.appsecret, function (callback) {
        // 传入一个获取全局token的方法
        fs.readFile('access_token.txt', 'utf8', function (err, txt) {
            if (err) {
                if (err.code === 'ENOENT') {
                    return callback(null, null);
                } else {
                    return callback(err);
                }
            }
            callback(null, JSON.parse(txt));
        });
    }, function (token, callback) {
        // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
        // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
        fs.writeFile('access_token.txt', JSON.stringify(token), callback);
    });

    return {
        getUrl: getUrl,
        
        wxOauth: function(option) {
            return function(req, res, next) {
                var success_url = option ? option.success : null;
                console.log("success_url:"+success_url);
                var error_url = option ? option.error : null;
                if(session_c.isWxUserLogin(req)) {
                    //已经成功获取用户授权信息，继续执行
                    next();
                }else{
                    //微信已授权提供获取用户openid的 code
                    if (req.query.code) {
                        //比对state是否有效
                        if (state_store.checkState(req.query.state)) {
                            //获取用户openid
                            oauth_client.getAccessToken(req.query.code, function (err, result) {
                                if (err) {
                                    if( error_url ) {
                                        res.redirect(error_url);
                                    } else {
                                        res.render('error', {message: err.message, error:{}});
                                    }
                                } else {
                                    //记录openid到session
                                    console.log("openid:"+result.data.openid);
                                    session_c.wxUserLogin(req, result.data.openid);
                                    console.log();
                                    if (success_url) {
                                        res.redirect(success_url);
                                    } else {
                                        res.redirect(getUrl(req.originalUrl));
                                    }
                                }
                            });
                        } else {
                            if( error_url ) {
                                res.redirect(error_url);
                            } else {
                                res.render('error', {message: '无效state', error:{}});
                            }
                        }
                    } else {
                        //转向微信授权
                        var url = oauth_client.getAuthorizeURL(getUrl(req.originalUrl), state_store.generateState());
                        //var url = oauth_client.getAuthorizeURL('http://' + req.headers.host + req.originalUrl);
                        res.redirect(url);
                    }
                }
            };
        },
        createMenu: function (menu, cb) {
            api.createMenu(menu, cb);
        },
        //微信消息处理器
        wxMsgHandler: function(){
            return Wechat(weixin_config)
            .text(function (message, req, res, next) {
            // TODO
                res.reply('');
            }).image(function (message, req, res, next) {
            // TODO
                res.reply('');
            }).voice(function (message, req, res, next) {
            // TODO
                res.reply('');
            }).video(function (message, req, res, next) {
            // TODO
                res.reply('');
            }).location(function (message, req, res, next) {
            // TODO
                res.reply('121212');
            }).link(function (message, req, res, next) {
            // TODO
                res.reply('');
            }).event(function (message, req, res, next) {
            // TODO
                res.reply('功能开发中');
            }).device_text(function (message, req, res, next) {
            // TODO
                res.reply('');
            }).device_event(function (message, req, res, next) {
            // TODO
                res.reply('');
            }).middlewarify();
        },
        //上传图文消息
        uploadNewsMaterial: function (req, res, next) {
            var articles = req.body.articles;
            api.uploadNewsMaterial({articles:articles}, function (err, result) {
                if (err) {
                    res.json({
                        success: -1,
                        desc: err.message,
                        data: {}
                    });
                } else {
                    res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            media_id:result.media_id
                        }
                    });
                }
            });
        },
        
        //群发图文消息
        massSendNews: function (req, res, next) {
            //上传图文消息，获取media_id
            var media_id = req.body.media_id;
            var receivers = req.body.receivers || true;
            
            // 群发图文消息
            api.massSendNews(media_id, receivers, function (err, result) {
            // api.previewNews('oBgUsxD1wCZbCM6BE7YPugrEVEjQ', media_id, function (err, result) {
                if (err) {
                    console.log(err);
                    res.json({
                        success: -1,
                        desc: err.message,
                        data: {}
                    });
                } else {
                    console.log(result);
                    res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            msg_id: result.msg_id
                        }
                    });
                }
            });
        },
        //上传photo
        uploadPhoto:function (req, res, next) {
            //生成multiparty对象，并配置上传目标路径
            console.log('uploadPhoto = ' + new Date());
            var form = new multiparty.Form();
            //上传完成后处理
            console.log("server"+form);
            form.parse(req, function (err, fields, files) {
                if (err) {
                    res.json({
                        success: -1,
                        desc: err.message,
                        data: {}
                    });
                } else {
                    var image = files.media[0];
                    var uploadedPath = image.path;
                    console.log('uploadMaterial.begin = ' + new Date());
                    //网上找到的信息不准确，微信最后还是改成永久素材的thumb类型了
                    api.uploadMaterial(uploadedPath, 'image', function (err, result) {
                        console.log('uploadMaterial.end = ' + new Date());
                        fs.unlink(uploadedPath);//移除上传的临时文件
                        if (err) {
                            res.json({
                                success: -1,
                                desc: err.message,
                                data: {}
                            });
                        } else {
                            res.json({
                                success: 0,
                                desc: 'success',
                                data: {
                                    media_id: result.media_id,
                                    url: result.url
                                }
                            });
                        }
                        console.log('uploadMaterial.json = ' + new Date());
                    });
                }
            });
        },
        //上传voice
        uploadVoice:function (req, res, next) {
            //生成multiparty对象，并配置上传目标路径
            console.log('uploadVoice = ' + new Date());
            var form = new multiparty.Form();
            //上传完成后处理
            console.log("server"+form);
            form.parse(req, function (err, fields, files) {
                if (err) {
                    res.json({
                        success: -1,
                        desc: err.message,
                        data: {}
                    });
                } else {
                    var voice = files.media[0];
                    var uploadedPath = voice.path;
                    console.log('uploadMaterial.begin = ' + new Date());
                    //voice类型
                    api.uploadMaterial(uploadedPath, 'voice', function (err, result) {
                        console.log('uploadMaterial.end = ' + new Date());
                        fs.unlink(uploadedPath);//移除上传的临时文件
                        if (err) {
                            res.json({
                                success: -1,
                                desc: err.message,
                                data: {}
                            });
                        } else {
                             console.log(" console.log(result); console.log(result);"+result);
                            res.json({
                                success: 0,
                                desc: 'success',
                                data: {
                        
                                    media_id: result.media_id,
                                    url: result.url
                                }
                            });
                        }
                        console.log('uploadMaterial.json = ' + new Date());
                    });
                }
            });
        },
          //删除media
        deleteMedia:function (req, res, next) {
            //获取media_id 解析
                   var media_id=req.body.media_id;//获取media_id是一个数组
                    var count=0;//所在的位置不同意思不同
                     media_id.forEach(function(media_id_e) {
                         api.removeMaterial(media_id_e, function (err, result) {
                        if (err) {
                            res.json({
                                success: -1,
                                desc: err.message,
                                data: {}
                            });
                        } else {
                            count++;
                            console.log("countcountcountcountcount:"+count);//每执行一次加1
                            if(count === media_id.length){//都执行完毕返回
                                 res.json({
                                success: 0,
                                desc: 'success',
                                data: {
                                }
                            });
                            }     
                        }
                        console.log('uploadMaterial.json = ' + new Date());
                    });   
                     });
            
        },
        //上传图文内图片
        uploadImage: function (req, res, next) {
            api.uploadImageStream(req, function (err, result) {
                if (err) {
                    res.json({
                        success: -1,
                        desc: err.message,
                        data: {}
                    });
                } else {
                    res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            url: result.url
                        }
                    });
                }
            });
        },
        //上传图文封面-上传永久素材的thumb类型
        uploadCover: function (req, res, next) {
            //生成multiparty对象，并配置上传目标路径
            console.log('uploadCover = ' + new Date());
            var form = new multiparty.Form();
            //上传完成后处理
            form.parse(req, function (err, fields, files) {
                if (err) {
                    res.json({
                        success: -1,
                        desc: err.message,
                        data: {}
                    });
                } else {
                    var image = files.media[0];
                    var uploadedPath = image.path;
                    console.log('uploadMaterial.begin = ' + new Date());
                    //网上找到的信息不准确，微信最后还是改成永久素材的thumb类型了
                    api.uploadMaterial(uploadedPath, 'thumb', function (err, result) {
                        console.log('uploadMaterial.end = ' + new Date());
                        fs.unlink(uploadedPath);//移除上传的临时文件
                        if (err) {
                            res.json({
                                success: -1,
                                desc: err.message,
                                data: {}
                            });
                        } else {
                            res.json({
                                success: 0,
                                desc: 'success',
                                data: {
                                    thumb_media_id: result.media_id,
                                    url: result.url
                                }
                            });
                        }
                        console.log('uploadMaterial.json = ' + new Date());
                    });
                }
            });
        },

       


    };
})();