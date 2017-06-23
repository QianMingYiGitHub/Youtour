/**
 * 素材处理
 */
var multiparty = require('multiparty');
var Promise = require('promise');
var request = require('request');
var path = require('path');
var fs = require('fs');
var util = require('util');
//测试域名
var zsks_host_url = 'http://youtour_app.tunnel.qydev.com';
// //招考查询域名
// var zsks_host_url = 'http://query.zhaoban.youtour.com.cn';
var zsks_mass_send_url = zsks_host_url + '/api/socket/notice_parent_student';//上传photo

//添加图片素材
module.exports.uploadImage = function(req, res, next) {
    
    //将上传的图片数据直接代理转向到服务号
    req.pipe(request(zsks_upload_image_url, function(err, httpResponse, body) {
        console.log('代理返回的数据',JSON.stringify(body));
        if(err || httpResponse.statusCode !== 200) {
            res.json({
                success: -1,
                desc: err ? err.message : httpResponse.statusMessage,
                data:{}
            });
        } else {
            if (body.success === 0) {
                var image_url = body.data.url;
                //需要将该image_url 记录到素材库中，如果记录到素材库中的操作是异步的，那么下面的res.json(body)也要放在
                information_m.addUrl(image_url,function(err,result){
                    if(err){
                        res.json({
                            success: -1,
                            desc: body.desc,
                            data:{}
                        });

                    }else{
                        res.json({
                            success: 0,
                            desc: body.desc,
                            data:{
                                //    result:result.id,
                                image_url:image_url
                            }
                        });
                         // res.json(body);//返回数据
                    }

                });

                //异步回调中调用
            } else {
                res.json({
                    success: -1,
                    desc: body.desc,
                    data:{}
                });
            }
            //body = {url: 图片链接}
            // res.json(body);
        }
    }));
};
//发送消息测试
module.exports.massSendNews = function (media_id, cb) {
    //将上传的图片数据直接代理转向到服务号
    request.post({url:zsks_mass_send_url, json:true, body: {media_id: media_id}}, function(err,httpResponse,body) {
        if(err || httpResponse.statusCode !== 200) {
            cb(new Error(err ? err.message : httpResponse.statusMessage));
        } else {
            if (body.success !== 0) {
                cb(new Error(body.desc));
            } else {
                console.log("body.data.msg_id:"+body.data.msg_id);
                cb(null, {msg_id: body.data.msg_id});
            }
        }
        console.log('代理返回的数据',JSON.stringify(body));
    });
};