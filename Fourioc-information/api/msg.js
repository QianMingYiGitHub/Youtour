// var wxUser = require('../model/contact/wxUser');
// var wxDept = require('../model/contact/wxDept');
var Wechat = require('../api/wechat');
var Promise = require('promise');
// var Staff = require('../model/school/staff');
var fs = require('fs');
// var Teacher = require('../model/school/school_teacher');
// var Parent = require('../model/school/school_parent');
var config = require('./config');
var logger = require('../api/logger').logger;
function sendMessage(api, message){
    return new Promise(function(resolve, reject){
        logger.info('sendMessage api = ' + JSON.stringify(api) + ', message = ' + JSON.stringify(message));
        api.send(message.to, message.msg, function(err, result){
            if(err){
                logger.error('sendMessage err : ' + JSON.stringify(err));
                return reject(err);
            }
            if(result.errcode !== 0){
                logger.error('sendMessage result.errcode !== 0, result : ' + JSON.stringify(result));
                return reject(new Error(result.errmsg));
            }
            logger.info('sendMessage.result = ' + JSON.stringify(result));
            return resolve();
        });
    });
}
//异步
function sendMessage_asyn(api, message,cb){
        logger.info('sendMessage api = ' + JSON.stringify(api) + ', message = ' + JSON.stringify(message));
        api.send(message.to, message.msg, function(err, result){
            if(err){
                logger.error('sendMessage err : ' + JSON.stringify(err));
               cb(err);
            }
            if(result.errcode !== 0){
                logger.error('sendMessage result.errcode !== 0, result : ' + JSON.stringify(result));
                cb(new Error(result.errmsg));
            }
            logger.info('sendMessage.result = ' + JSON.stringify(result));
            cb(null,result);
        });
}
function mypepTestReply(message, req, res, next) {
    //获取用户身份，家长还是老师
    //推送帮助信息
    // var teacher =
    // {
    //     title: '教师-测评练习指南',
    //     description: '1.布置作业:教师可以选择系统成卷、根据教材章节和题型智能快速组卷、精心挑选每一道试题进行高级组卷、或自行上传附件，并根据班级和学生分组布置个性化作业。批改作业\n' +
    //     '2.批改作业:教师可查询、批改以前布置过的作业，还可实时了解交卷情况和答题统计。\n' +
    //     '3.统计分析:教师可查看过往的作业统计，如班级成绩曲线、成绩分布、排名及学生对于各章节、题型的掌握情况，并生成有针对性的专项训练\n' +
    //     '4.资源中心:教师可查找和使用系统提供的各类权威教辅资源和第三方教学资源，也可自行创建数字试题、数字试卷或上传附件类资源，并分享给其他教师。\n\n' +
    //     '请使用PC端/IPad 浏览器 登录网址 http://i.mypep.youtour.com.cn, 您会在浏览器中看到授权登录二维码,您可以点击下方微信菜单按钮“扫一扫”，扫描二维码，授权登录即可'
    // }
    //
    // var student = {
    //     title: '学生-测评练习指南',
    //     description:'1.同步练习:同步训练,权威数字化教辅，按教学进度进行同步练习，系统智能判卷，答案解析、分析报告一应俱全。\n' +
    //     '2.个性训练:学生可自主根据教材目录、知识点、题型进行个性化组卷，有针对性的进行练习，逐个击破弱项。\n' +
    //     '3.错题与收藏:集中复习错题与收藏过的题目，根据智能推送进行同类试题强化训练。\n' +
    //     '4.我的作业:查看、完成教师布置的作业，教师批改后可查看答案解析及分析报告。\n\n' +
    //     '请使用PC端/IPad 浏览器 登录网址 http://i.mypep.youtour.com.cn, 您会在浏览器中看到授权登录二维码,您可以点击下方微信菜单按钮“扫一扫”，扫描二维码，授权登录即可'
    // }
    var teacher =
        {
            title: '测评练习指南',
            description:'教师',
            url:(config.getURL()+'/help/mypep_test_teacher.html')

        };

    var student = {
        title: '测评练习指南',
        description:'学生',
        url:(config.getURL()+'/help/mypep_test_student.html')
    };
    var msg = [];
    return Teacher.isTeacher(message.ToUserName,message.FromUserName).then(function (isTeacher) {
        if(isTeacher){
            msg.push(teacher);
        }
        return Parent.isParent(message.ToUserName,message.FromUserName).then(function (isParent) {
            if(isParent){
                msg.push(student);
            }
        }).then(function () {
            res.reply(msg);
        });
    }).catch(function (err) {
        res.reply(err.message||err.errMsg||'未知异常');
    });

    // res.reply(msg)
}
exports.makeMsgHandler = function(wechat){
    wechat.middlewarify = wechat.msg.text(function(message, req, res, next){
    }).location(function (message, req, res, next) {
            res.reply('location');
        }).image(function (message, req, res, next) {
            res.reply('image='+JSON.stringify(message));
            wechat.api.getMedia(message.MediaId, function(err, result, res){
                fs.appendFile('public/wx/image/'+message.MediaId + '.' +message.Format, result, function(err){
                    if(err){
                        fs.unlink('public/wx/image/'+message.MediaId + '.' + message.Format);
                    }
                });
            });
        }).voice(function (message, req, res, next) {
            res.reply('voice='+JSON.stringify(message));
            wechat.api.getMedia(message.MediaId, function (err, result, res) {
                fs.appendFile('public/wx/voice/'+message.MediaId + '.'  + message.Format, result, function (err) {
                    if(err){
                        fs.unlink('public/wx/voice/'+message.MediaId + '.' + message.Format);
                    }
                });
            });
        }).link(function (message, req, res, next) {
            res.reply('link');
        }).event(function (message, req, res, next) {
            console.log(JSON.stringify(message));
            if(message.AgentID){
                if(message.Event === 'subscribe'){
                    Promise.resolve()
                    .then(function(){
                        return new Promise(function(resolve, reject){
                            wechat.api.getUser(message.FromUserName,function(err, result){
                                if(err){
                                    return reject(err);
                                }
                                if(result.errcode === 0){
                                    return resolve(result);
                                }else{
                                    return reject(new Error(result.errmsg));
                                }
                            });
                        });
                    }).then(function(user){
                        wxUser.updateUser(message.ToUserName,user);
                    }).then(function(){
                        res.reply('');
                        // Parent.enableParent(message.ToUserName,message.FromUserName);
                    }).then(function(){
                        // Staff.subscribeStaff(message.ToUserName, message.FromUserName);
                    }).catch(function(err){
                        res.reply('');
                        console.log(err.message);
                    });
                }else if(message.Event === 'unsubscribe'){
                    wxUser.updateUser(message.ToUserName,{userid:message.FromUserName,status:4})
                    .then(function(){
                        res.reply('');
                        // Parent.disableParent(message.ToUserName,message.FromUserName);
                    }).then(function(){
                        // Staff.unsubscribeStaff(message.ToUserName, message.FromUserName);
                    }).catch(function(err){
                        res.reply('');
                        console.log(err.message);
                    });
                }else if(message.Event === 'scancode_waitmsg' && message.EventKey === 'mypep_scan_login'){
                    //测试url合法性
                    if(/^http:\/\/i.mypep.youtour.com.cn\/lnlt\/qlogin\/[a-zA-Z0-9]{16}$/.test(message.ScanCodeInfo.ScanResult)){
                        res.reply('');
                    }else{
                        res.reply('对不起，无法识别该二维码！');
                    }
                }else if(message.Event === 'click'){
                    console.log('CLICK Event, key=' + message.EventKey);
                    if(message.EventKey === 'mypep_help_info'){
                        mypepTestReply(message, req, res, next);
                    }
                }else{
                    res.reply('');
                }
            }
        }).middlewarify();
};

/**
 * 发送消息分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 详细请看：http://qydev.weixin.qq.com/wiki/index.php?title=发送接口说明
 * Examples:
 * ```
 * api.send(to, message, callback);
 * ```
 * To:
 * ```
 * {
 *  "touser": "UserID1|UserID2|UserID3",
 *  "toparty": " PartyID1 | PartyID2 ",
 *  "totag": " TagID1 | TagID2 "
 * }
 * ```
 * Message:
 * 文本消息：
 * ```
 * {
 *  "msgtype": "text",
 *  "text": {
 *    "content": "Holiday Request For Pony(http://xxxxx)"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 图片消息：
 * ```
 * {
 *  "msgtype": "image",
 *  "image": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 图片消息：
 * ```
 * {
 *  "msgtype": "image",
 *  "image": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 语音消息：
 * ```
 * {
 *  "msgtype": "voice",
 *  "voice": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 视频消息：
 * ```
 * {
 *  "msgtype": "video",
 *  "video": {
 *    "media_id": "MEDIA_ID"
 *    "title": "Title",
 *    "description": "Description"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 文件消息：
 * ```
 * {
 *  "msgtype": "file",
 *  "file": {
 *    "media_id": "MEDIA_ID"
 *  },
 *  "safe":"0"
 * }
 * ```
 * 图文消息：
 * ```
 * {
 *  "msgtype": "news",
 *  "news": {
 *    "articles":[
 *      {
 *        "title": "Title",
 *        "description": "Description",
 *        "url": "URL",
 *        "picurl": "PIC_URL",
 *      },
 *      {
 *        "title": "Title",
 *        "description": "Description",
 *        "url": "URL",
 *        "picurl": "PIC_URL",
 *      }
 *    ]
 *  },
 *  "safe":"0"
 * }
 * ```
 * MP消息：
 * ```
 * {
 *  "msgtype": "mpnews",
 *  "mpnews": {
 *    "articles":[
 *      {
 *        "thumb_media_id": "id",
 *        "author": "Author",
 *        "content_source_url": "URL",
 *        "content": "Content"
 *        "digest": "Digest description",
 *        "show_cover_pic": "0"
 *      },
 *      {
 *        "thumb_media_id": "id",
 *        "author": "Author",
 *        "content_source_url": "URL",
 *        "content": "Content"
 *        "digest": "Digest description",
 *        "show_cover_pic": "0"
 *      }
 *    ],
 *    "media_id": "id"
 *  },
 *  "safe":"0"
 * }
 * ```
 * Callback:
 *
 * - `err`, 调用失败时得到的异常
 * - `result`, 调用正常时得到的对象
 *
 * Result:
 * ```
 * {
 *  "errcode": 0,
 *  "errmsg": "ok",
 *  "invaliduser": "UserID1",
 *  "invalidparty":"PartyID1",
 *  "invalidtag":"TagID1"
 * }
 * ```
 *
 * @param {Object} to 接受消息的用户
 * @param {Object} message 消息对象
 * @param {Function} callback 回调函数
 */
exports.sendMessage = sendMessage;
exports.sendMessage_asyn = sendMessage_asyn;//异步