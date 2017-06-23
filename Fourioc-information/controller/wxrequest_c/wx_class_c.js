var util = require('util');
var Promise = require('promise');
var wx_class_m= require('../../model/wxrequest_m/wx_class_m');
var classes_m= require('../../model/classes_m');
var message = require('../../api/media/message');
var wxUserController = require('../../model/contact/wxUser');
var phones_m = require('../../model/phones_m');
var WX_class = (function () {
//老师添加评语+并通知家长
function teacher_addcomment(req,res,next){
    
      var teacherName="";
     if(util.isNullOrUndefined(req.body)){
          res.json({success:-1, desc:'no body', data:{}});
    }else if(util.isNullOrUndefined(req.body.corpId)){
         res.json({success:-1, desc:'no corpId', data:{}});
    }else if(util.isNullOrUndefined(req.body.rate)){//这个是携带的参数
         res.json({success:-1, desc:'no rate', data:{}});
    }else{
    var base_config = {//去查询当前用户的学校id下的绑定信息
                    token:  req.session.weixin_school.token,
                    encodingAESKey:  req.session.weixin_school.encodingAESKey,
                    corpId: req.session.weixin_school.corpId,//可以根据school_id进行绑定
                    secret: req.session.weixin_school.secret,//可以根据school_id进行绑定
                    agentid:""//19//这个是appid
                };
    classes_m.getTeacherAllInfoByUserId(req.body.corpId, req.body.rate.createPerson,function(err,result){
        if(err){
            res.json({success:-1,desc:"在数据库未查询到教师的信息,请联系管理员!",data:{}})
        }else{
            result.map(function(elem){
                 teacherName=elem.teacher_name;
            })
            //再插入信息 两条//+通知家长的phone数组+返回通知的id
           // req.body.parent_list=["18304077397","13610824661"]//修改
            wx_class_m.teacher_addcomment(req.body,function(err,result){
                if(err){
                    res.json({success:-1,desc:"插入数组失败",data:{}})
                }else{
                    var index=1;
                    result.forEach(function(parent){//返回一个携带studentname的数组
                        //循环遍历通知家长
                        var notice_phone=parent.parent_phone;//拼接成 UserID1|UserID2|UserID3
                        var data={student_name:parent.student_name,content:req.body.rate.content,new_id:parent.new_id,comment_id:parent.comment_id,teacher_name:teacherName};
                        var appid= req.session.weixin_school.performanceapp_id;//目前先写死
                        console.log("日常表现appid："+appid);
                        console.log("通知家长手机号："+notice_phone);
                         var application_name="日常表现";
                         var main_url="/wxallrequest_class/read_rate";
                         message.send_text_url(notice_phone,appid,data,base_config,application_name,main_url,function(err,result){
                             if(err){
                                 console.log("err:"+err.code);
                                // res.json({success:-1,desc:err.code})//每次发送的数据是不一样的
                             }else{
                                 console.log("success:"+result.errcode);//res.json({success:0,desc:result.errcode})
                             }
                         });
                            if(index==result.length){
                                res.json({success:0,desc:"群发消息成功",data:{}})
                            }
                            index++;  
                    });
                }
            });
        }
    })
    }
}
//获取自己发布的评语
function teacher_getcomment(req,res,next){
    if(req.body.info.identity=="1"){//获取自己的评语
    var userid=req.body.info.userid;
    var corpid=req.body.corpId;
    console.log(JSON.stringify(req.body.info));
    wx_class_m.get_publishedcomment(userid,corpid,function(err,result){
        if(err){
            res.json({success:-1,desc:"获取数据失败"})
        }else{
             if(result==""||result==null){
                res.json({success:0,desc:"你还没有发布任何评语",data:{}})
            }else{
                res.json({success:0,desc:"success",data:{
                    list:result.map(function(elem){
                        return{
                                id:userid,
                                comment_id:elem.id,
                                evaluate_status:elem.evaluate_status,
                                evaluate_content:elem.evaluate_content,
                                publisher:elem.publisher,
                                editTime:elem.editTime,
                                comment_test:"的评语",
                        }
                    })
                }})
            }
        }
    })
}else {//日常表现
    var status="";
       if(req.body.info.identity=="2"){
           status=1;
       }else{
           status=0;
       }
       console.log("阅读状态："+status);
        wx_class_m.get_new(req.body,status,function(err,result){
        if(err){
            res.json({success:-1,desc:"系统错误"})
        }else{
            if(result==""||result==null){
                res.json({success:0,desc:"你还没有相关评语",data:{}})
            }else{
                if(result=="1"){
                    res.json({success:0,desc:"success",data:{}})
                }else{
                res.json({success:0,desc:"success",data:{
                        list:result.map(function(elem){
                            return{
                                id:userid,
                                comment_id:elem.comment_id,
                                evaluate_status:elem.evaluate_status,
                                evaluate_content:elem.evaluate_content,
                                publisher:elem.publisher,
                                new_id:elem.new_id,
                                editTime:elem.editTime,
                                comment_test:"的日常表现",
                            }
                        })
                }})
              }
            }
        }
    });
}
}
//查看自己的评语+已阅+没看
function teacher_seecomment(req,res,next){
    wx_class_m.get_new(req.body,function(err,result){
        if(err){
            res.json({success:-1,desc:"系统错误"})
        }else{
            if(result==""||result==null){
                res.json({success:0,desc:"你还没有相关评语",data:{}})
            }else{
                if(result=="1"){
                    res.json({success:0,desc:"success",data:{}})
                }else{
                res.json({success:0,desc:"success",data:{
                        Seecomment:result.map(function(elem){
                            return{
                                comment_test:"[钱明一]的评语",
                                comment_id:elem.comment_id,
                                evaluate_status:elem.evaluate_status,
                                evaluate_content:elem.evaluate_content,
                                publisher:elem.publisher,
                                new_id:elem.new_id
                            }
                        })
                }})
              }
            }
        }
    });
}
//获取班级信息+家长
function teacher_getparentinfo(req,res,next){
        var userid=req.body.userid;
        var corpid=req.body.corpid;//绑定学校id
        var array_headmaster=[];
        var array_teachering=[];
        var head_class=[];
        wx_class_m.get_parentinfo(userid,corpid,function(err,result){
            if(err){
                res.json({success:-1,desc:"服务器错误"})
            }else{
                if(result=="1"){
                    res.json({success:0,desc:"您还未教授班级学生",data:{}})
                }else{
                    array_headmaster=result.header_class;
                    if(result.teachering_class_list=="||"){
                        array_teachering=[];
                    }else{
                        array_teachering=result.teachering_class_list;
                    }
                    var school_id=result.school_id;
                    wx_class_m.get_noticeparent_phone(array_headmaster,school_id,function(err,result){
                        if(err){
                            res.json({success:-1,desc:"服务器错误"})
                        }else{
                            var head={class_name:"",class_parent:""}
                            if(result=="2"){//没有任职班主任
                                head=[];
                                if(array_teachering.length==0){
                                     res.json({success:0,desc:"success",data:{
                                                count:0,
                                                head_class:[]
                                            }});
                                }else{
                                  wx_class_m.get_noticeparent_phone_class(array_headmaster,array_teachering,school_id,function(err,result){
                                    if(err){
                                        res.json({success:-1,desc:"服务器错误"})
                                    }else{
                                        if(result=="2"){
                                            res.json({success:0,desc:"空数据",data:{
                                            }}); 
                                        }else{
                                            //根据phone 获取 家长图片 +目前写在
                                            head_class.push(head);
                                            result.class.forEach(function(elem){
                                                  head_class.push(elem);
                                            })
                                            res.json({success:0,desc:"success",data:{
                                                count:result.class.length,
                                                head_class:head_class
                                            }});
                                        }
                                    }
                                })
                             }
                            }else{
                                head.class_name=result.class_name;
                                head.class_parent=result.parent_name;
                                head_class.push(head);
                                if(array_teachering.length==0){
                                     res.json({success:0,desc:"success",data:{
                                                count:head.class_parent.length,
                                                head_class:head_class
                                            }});
                                }else{
                                wx_class_m.get_noticeparent_phone_class(array_headmaster,array_teachering,school_id,function(err,result){
                                    if(err){
                                        res.json({success:-1,desc:"服务器错误"})
                                    }else{
                                        if(result=="2"){
                                            res.json({success:0,desc:"空数据",data:{
                                            }}); 
                                        }else{
                                            result.class.forEach(function(elem){
                                                  head_class.push(elem);
                                            })
                                            console.log(JSON.stringify(result.class));
                                            res.json({success:0,desc:"success",data:{
                                                count:head.class_parent.length+result.class.length,
                                                head_class:head_class
                                            }});
                                        }
                                    }
                                })
                            }
                          }
                        }
                    })
                }
            }
        });
}
//获取个人信息+学生
function getOwnInfo(req,res,next){
    //根据userid获取身份
     var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
        phones_m.getbase_config(req.session.userid,function(err,result){
            if(err){
                res.json({success:-1,desc:err.message,data:{}})
            }else{
                if(result==""||result==null){
                    res.json({success:-1,desc:"对不起没有查询到你所在学校的信息，请联系学校管理员",data:{}})  
                }else{
                    result.map(function(elem){
                        base_config.token=elem.token;
                        base_config.encodingAESKey=elem.encodingAESKey;
                        base_config.corpId=elem.corpId;
                        base_config.agentid=elem.studentsaveapp_id;
                        base_config.secret=elem.secret;
                    })
                      wx_class_m.getUserByUserId(req.session.corpId||req.query.corpId, req.session.userid||req.query.userid,function(err,result){
                        if(err){
                            res.json({success:-1,desc:"服务器错误"})
                        }else{
                            console.log("role::"+result);
                            message.get_user(req.session.userid,base_config,function(err,result_message){
                                if(err){
                                    res.json({success:-1,desc:"服务器错误"})
                                }else{
                                    res.json({success:0,desc:"",data:{
                                        info:{
                                            name:result_message.name,
                                            mobile:req.session.userid,
                                            avatar:result_message.avatar+"0",
                                            identity:result.toString()
                                        }
                                    }})
                                }
                            })
                        }
                    })
                }
            }
        });
}
//
function get_classes(req,res,next){
    wx_class_m.get_classes(req.session.corpId||req.query.corpId, req.session.userid||req.query.userid,function(err,result){
        if(err){
             res.json({success:-1,desc:"服务器错误"})
        }else{
            res.json({success:0,desc:"success",data:[
                {
                name:result.name,
                student_num:result.student_num,
                teacher:result.teacher
                }
            ]  
            })
        }
    })
}
//添加班级通知
function teacher_addactivity(req,res,next){
      var teacherName="";
     if(util.isNullOrUndefined(req.body)){
          res.json({success:-1, desc:'no body', data:{}});
    }else if(util.isNullOrUndefined(req.body.corpId)){
         res.json({success:-1, desc:'no corpId', data:{}});
    }else if(util.isNullOrUndefined(req.body.activity)){//这个是携带的参数
         res.json({success:-1, desc:'no activity', data:{}});
    }else{
    var base_config = {//去查询当前用户的学校id下的绑定信息
                token:  req.session.weixin_school.token,
                encodingAESKey:  req.session.weixin_school.encodingAESKey,
                corpId: req.session.weixin_school.corpId,//可以根据school_id进行绑定
                secret: req.session.weixin_school.secret,//可以根据school_id进行绑定
                agentid:""//19//这个是appid
            };
    var draft_status=req.body.activity.state;
    classes_m.getTeacherAllInfoByUserId(req.body.corpId, req.body.activity.createPerson,function(err,result){
        if(err){
            res.json({success:-1,desc:"在数据库未查询到教师的信息,请联系管理员!",data:{}})
        }else{
            result.map(function(elem){
                 teacherName=elem.teacher_name;
            })
            //再插入信息 两条//+通知家长的phone数组+返回通知的id
            req.body.parent=["18304077397"]//此时先写死
            wx_class_m.teacher_addactivity(req.body,function(err,result){
                if(err){
                    res.json({success:-1,desc:"插入数组失败",data:{}})
                }else{
                if(draft_status==1){//立即发布
                    var index=1;
                    result.forEach(function(parent){//返回一个携带studentname的数组
                        //循环遍历通知家长
                        var notice_phone=parent.parent_phone;//拼接成 UserID1|UserID2|UserID3
                        var data={student_name:parent.student_name,content:req.body.activity.content,new_id:parent.new_id,comment_id:parent.classnotice_id,teacher_name:teacherName};
                        var appid=req.session.weixin_school.classnoticeapp_id;
                        console.log("通知家长手机号："+notice_phone);
                        var application_name="班级通知";
                        var main_url="/wxallrequest_class/read_activity";
                         message.send_text_url(notice_phone,appid,data,base_config,application_name,main_url,function(err,result){
                             if(err){
                                 console.log("err:"+err.code);
                                 res.json({success:-1,desc:err.code})//每次发送的数据是不一样的
                             }else{
                                 console.log("success:"+result.errcode);//res.json({success:0,desc:result.errcode})
                             }
                         });
                            if(index==result.length){
                                res.json({success:0,desc:"群发消息成功",data:{}})
                            }
                            index++;  
                    });
                    }else{
                           res.json({success:0,desc:"保存草稿成功",data:{}})
                    }
                }
            });
         }
      })
    }
}
//获取自己 
function teacher_getactivity(req,res,next){
 
    var userid=req.body.userid;
    var corpid=req.body.corpId;
    var type=req.body.type;
    wx_class_m.get_draftactivity(userid,corpid,type,function(err,result){
        if(err){
            res.json({success:-1,desc:"获取数据失败"})
        }else{
             if(result==""||result==null){
                res.json({success:0,desc:"你还没有发布任何评语",data:{}})
            }else{
                if(result=="1"){
                    res.json({success:0,desc:"success",data:{}});
                }else{
                console.log("121:"+JSON.stringify(result));
                res.json({success:0,desc:"success",data:{
                    activity:result.map(function(elem){
                        return{
                                id:elem.id,
                                title:elem.title,
                                content:elem.content,
                                publisher:elem.publisher,
                                editTime:elem.editTime
                        }
                    })
                }})
            }
          }
        }
    })

}
//添加班级通知
function teacher_addhomework(req,res,next){
      var teacherName="";
     if(util.isNullOrUndefined(req.body)){
          res.json({success:-1, desc:'no body', data:{}});
    }else if(util.isNullOrUndefined(req.body.corpId)){
         res.json({success:-1, desc:'no corpId', data:{}});
    }else if(util.isNullOrUndefined(req.body.homework)){//这个是携带的参数
         res.json({success:-1, desc:'no activity', data:{}});
    }else{
    var base_config = {//去查询当前用户的学校id下的绑定信息
                token:  req.session.weixin_school.token,
                encodingAESKey:  req.session.weixin_school.encodingAESKey,
                corpId: req.session.weixin_school.corpId,//可以根据school_id进行绑定
                secret: req.session.weixin_school.secret,//可以根据school_id进行绑定
                agentid:""//19//这个是appid
            };
    var draft_status=req.body.homework.state;
    classes_m.getTeacherAllInfoByUserId(req.body.corpId, req.body.homework.createPerson,function(err,result){
        if(err){
            res.json({success:-1,desc:"在数据库未查询到教师的信息,请联系管理员!",data:{}})
        }else{
            result.map(function(elem){
                 teacherName=elem.teacher_name;
            })
            //再插入信息 两条//+通知家长的phone数组+返回通知的id
            req.body.parent=["18304077397"]//此时先写死
            wx_class_m.teacher_addhomework(req.body,function(err,result){
                if(err){
                    res.json({success:-1,desc:"插入数组失败",data:{}})
                }else{
                if(draft_status==1){//立即发布
                    var index=1;
                    result.forEach(function(parent){//返回一个携带studentname的数组
                        //循环遍历通知家长
                        var notice_phone=parent.parent_phone;//拼接成 UserID1|UserID2|UserID3
                        var data={student_name:parent.student_name,content:req.body.homework.content,new_id:parent.new_id,comment_id:parent.homework_id,teacher_name:teacherName};
                        var appid=req.session.weixin_school.homeworkapp_id;
                        console.log("通知家长手机号："+notice_phone);
                        var application_name="作业通知";
                         message.send_text_url(notice_phone,appid,data,base_config,application_name,function(err,result){
                             if(err){
                                 console.log("err:"+err.code);
                                 res.json({success:-1,desc:err.code})//每次发送的数据是不一样的
                             }else{
                                 console.log("success:"+result.errcode);//res.json({success:0,desc:result.errcode})
                             }
                         });
                            if(index==result.length){
                                res.json({success:0,desc:"群发消息成功",data:{}})
                            }
                            index++;  
                    });
                    }else{
                           res.json({success:0,desc:"保存草稿成功",data:{}})
                    }
                }
            });
         }
      })
    }
}
//获取自己 
function teacher_gethomework(req,res,next){
 
    var userid=req.body.userid;
    var corpid=req.body.corpId;
    var type=req.body.type;
    wx_class_m.get_drafthomeork(userid,corpid,type,function(err,result){
        if(err){
            res.json({success:-1,desc:"获取数据失败"})
        }else{
             if(result==""||result==null){
                res.json({success:1,desc:"您还没有关闭的评语",data:{}})
            }else{
                if(result=="1"){
                    res.json({success:1,desc:"还没有您需要参与的作业",data:{}});
                }else{
                console.log("121:"+JSON.stringify(result));
                res.json({success:0,desc:"success",data:{
                    homework:result.map(function(elem){
                        return{
                                id:elem.id,
                                title:elem.title,
                                content:elem.content,
                                publisher:elem.publisher,
                                editTime:elem.editTime
                        }
                    })
                }})
            }
          }
        }
    })

}
 
    return {
        //日常表现
        teacher_addcomment:teacher_addcomment,
        teacher_getcomment:teacher_getcomment,
        teacher_seecomment:teacher_seecomment,
        teacher_getparentinfo:teacher_getparentinfo,
        getOwnInfo:getOwnInfo,
        get_classes:get_classes,
        //班级通知
        teacher_addactivity:teacher_addactivity,
        teacher_getactivity:teacher_getactivity,
        //作业
        teacher_addhomework:teacher_addhomework,
        teacher_gethomework:teacher_gethomework,
    };
     
})();

module.exports = exports = WX_class;