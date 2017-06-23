var util = require('util');
var Promise = require('promise');
var wx_class_m= require('../../model/wxrequest_m/wx_class_m');
var classes_m= require('../../model/classes_m');
var message = require('../../api/media/message');
var wxUserController = require('../../model/contact/wxUser');
var WX_questionnair = (function () {
//老师添加评语+并通知家长
function save_draft(req,res,next){
      var teacherName="";
     if(util.isNullOrUndefined(req.body)){
          res.json({success:-1, desc:'no body', data:{}});
    }else if(util.isNullOrUndefined(req.body.info.corpId)){
         res.json({success:-1, desc:'no corpId', data:{}});
    }else if(util.isNullOrUndefined(req.body.info)){//这个是携带的参数
         res.json({success:-1, desc:'no rate', data:{}});
    }else{
        var base_config = {//去查询当前用户的学校id下的绑定信息
                token:  req.session.weixin_school.token,
                encodingAESKey:  req.session.weixin_school.encodingAESKey,
                corpId: req.session.weixin_school.corpId,//可以根据school_id进行绑定
                secret: req.session.weixin_school.secret,//可以根据school_id进行绑定
                agentid:""//19//这个是appid
            };
    classes_m.getTeacherAllInfoByUserId(req.body.info.corpId, req.body.info.userid,function(err,result){
        if(err){
            res.json({success:-1,desc:"在数据库未查询到教师的信息,请联系管理员!",data:{}})
        }else{
            result.map(function(elem){
                 teacherName=elem.teacher_name;
            })
            //再插入信息 两条//+通知家长的phone数组+返回通知的id
            req.body.parent=["18304077397"]
            wx_class_m.teacher_addquestionnair(req.body,function(err,result){
                if(err){
                    res.json({success:-1,desc:"插入数组失败",data:{}})
                }else{
                    if(result==""||result==null){
                       res.json({success:0,desc:"success",data:{}})
                    }else{
                    var index=1;
                    result.forEach(function(parent){//返回一个携带studentname的数组
                        //循环遍历通知家长
                        var notice_phone=parent.parent_phone;//拼接成 UserID1|UserID2|UserID3
                        var data={student_name:parent.student_name,content:req.body.info.title,new_id:parent.new_id,comment_id:parent.questionnair_id,teacher_name:teacherName};
                        var appid=req.session.weixin_school.questionnairapp_id;
                        console.log("通知家长手机号："+notice_phone);
                         var application_name="问卷调查";
                         message.send_text_url(notice_phone,appid,data,base_config,application_name,function(err,result){
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
                }
            });
        }
    })
    }
}
//获取自己发布的评语
function teacher_getcomment(req,res,next){
    if(req.body.info.identity=="1"){
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
                                id:elem.id,
                                evaluate_status:elem.evaluate_status,
                                evaluate_content:elem.evaluate_content,
                                publisher:elem.publisher,
                                editTime:elem.editTime
                        }
                    })
                }})
            }
        }
    })
}else {
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
                                comment_id:elem.comment_id,
                                evaluate_status:elem.evaluate_status,
                                evaluate_content:elem.evaluate_content,
                                publisher:elem.publisher,
                                new_id:elem.new_id,
                                editTime:elem.editTime
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
    var corpid=req.body.corpid;
    var array_headmaster=[];
    var array_teachering=[];
    wx_class_m.get_parentinfo(userid,corpid,function(err,result){
        if(err){
            res.json({success:-1,desc:"服务器错误"})
        }else{
            if(result=="1"){
                res.json({success:0,desc:"您还未教授班级学生",data:{}})
            }else{
                array_headmaster=result.header_class;
                array_teachering=result.teachering_class_list;
                school_id=result.school_id;
                wx_class_m.get_noticeparent_phone(array_headmaster,school_id,function(err,result){
                    if(err){
                        res.json({success:-1,desc:"服务器错误"})
                    }else{
                        var head=[]
                        if(result=="2"){
                             head=[];
                             wx_class_m.get_noticeparent_phone_class(array_teachering,school_id,function(err,result){
                                if(err){
                                    res.json({success:-1,desc:"服务器错误"})
                                }else{
                                    if(result=="2"){
                                        res.json({success:0,desc:"空数据",data:{
                                        }}); 
                                    }else{
                                        res.json({success:0,desc:"success",data:{
                                            head:head,
                                            class:result.class
                                        }});
                                    }
                                }
                            })
                        }else{
                            head=result.head;
                             wx_class_m.get_noticeparent_phone_class(array_headmaster,array_teachering,school_id,function(err,result){
                                if(err){
                                    res.json({success:-1,desc:"服务器错误"})
                                }else{
                                    if(result=="2"){
                                        res.json({success:0,desc:"空数据",data:{
                                        }}); 
                                    }else{
                                        res.json({success:0,desc:"success",data:{
                                            head:head,
                                            class:result.class
                                        }});
                                    }
                                }
                            })
                        }
                    }
                })
                // res.json({success:0,desc:"success",data:{
                //     Teacher_parent:result.map(function(elem){
                //         return{
                //             class_name:elem.class_name,
                //             parent_name:elem.parent_name
                //         }
                //     })
                // }})
            }
        }
    });

}
//获取个人信息+学生
function getOwnInfo(req,res,next){
    //根据userid获取身份
    wx_class_m.getUserByUserId(req.session.corpId||req.query.corpId, req.session.userid||req.query.userid,function(err,result){
        if(err){
             res.json({success:-1,desc:"服务器错误"})
        }else{
            console.log("role::"+result);

            message.get_user(req.session.userid,function(err,result_message){
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
    return {
        save_draft:save_draft,
        teacher_getcomment:teacher_getcomment,
        teacher_seecomment:teacher_seecomment,
        teacher_getparentinfo:teacher_getparentinfo,
        getOwnInfo:getOwnInfo,
        get_classes:get_classes
    };
     
})();

module.exports = exports = WX_questionnair;