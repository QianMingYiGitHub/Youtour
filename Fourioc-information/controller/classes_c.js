var util = require('util');
var Promise = require('promise');
var session_c = require('./session_c');
var classes_m = require('../model/classes_m');
var phones_m = require('../model/phones_m');
var message = require('./../api/media/message');
var corpid_config=require('./../api/corp/corpid_config');
var Class = (function () {
  
    //查询某个年级下的班级+页面加载
    function queryClass(req,res,next){
       var school_id=req.params.school_id;
       classes_m.queryClass_One(school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               console.log("error:::"+JSON.stringify(result));
               console.log("kkkkkk"+result);
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        Classes:result.map(function(elem){
                            return{
                            class_name:elem.class_name,
                            sign:elem.sign,
                            sort:elem.sort,
                            class_one:elem.class_one
                          }
                         })
                      }
                 });
           }
       })  
   }
   //查询某个年级下的班级
    function queryType_Class(req,res,next){
        var type_grade=req.body.type_grade;
        var school_id=req.body.school_id;
        if(school_id==""||school_id==null){
            res.json({success:-1,desc:"学校id为空",data:{}});
        }else if(type_grade==""){
            res.json({
                success: 0,
                desc: '没有班级',
                data: {}
            });
        }else{
        classes_m.queryType_Class(type_grade,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        Classes:result.map(function(elem){
                            return{
                            id:elem.id,
                            class:elem.class
                          }
                         })
                        }
                 });
           }
       })  
        }
   }
    //添加班级
    function addClass(req,res,next){
      var school_id=req.body.school_id;
       classes_m.addClass(req.body.type_grade,req.body.class,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               console.log("result::"+result);
               if(result=="existed"){
                   res.json({
                        success: 1,
                        desc: '班级存在',
                        data: {
                        }
                 });
               }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
              }
           }
       })  
   }
   //删除班级
    function deleteClass(req,res,next){
        var school_id=req.body.school_id;
       classes_m.deleteClass(req.params.id,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
           }
       })  
   }   
   //删除年级
    function delete_Grade(req,res,next){
        var school_id=req.body.school_id;
       classes_m.delete_Grade(req.params.type_grade,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
           }
       })  
   }
   //添加学生
    function addStudent(req,res,next){
        //班级id
        var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
        var school_id=req.session.school_id;
        phones_m.getbase_config_schoolid(school_id,function(err,result){
            if(err){
                res.json({success:-1,desc:err.message,data:{}})
            }else{
                if(result==""||result==null){
                    console.log("对不起没有查询到你所在学校的信息，请联系学校管理员");
                    res.json({success:-1,desc:"对不起没有查询到你所在学校的信息，请联系学校管理员",data:{}})  
                }else{
                    result.map(function(elem){
                        base_config.token=elem.token;
                        base_config.encodingAESKey=elem.encodingAESKey;
                        base_config.corpId=elem.corpId;
                        base_config.agentid=elem.parentdep_id;
                        base_config.secret=elem.secret;
                    })
                classes_m.addStudent(req.params.id,req.body,function(err,result){
                        if(err){
                            res.json({
                                        success: -1,
                                        desc: 'fail',
                                        data: {}
                                    });
                        }else{
                                //添加成功后到通讯录添加家长+这里得做一下校验
                                var parent_name=req.body.parent_name;
                                var parent_phone=req.body.parent_phone;
                                message.get_user(parent_phone,base_config,function(err,result){
                                    if(err){
                                        if(err.code=="60111"){//企业用户不存在
                                            message.add_user(parent_phone,parent_name,base_config,function(err,result){
                                                if(err){
                                                    res.json({
                                                            success: 1,
                                                            desc: err,
                                                            data: {
                                                                success_reson:"添加通讯录失败"
                                                            }
                                                        });
                                                }else{
                                                    res.json({
                                                            success: 0,
                                                            desc: 'success',
                                                            data: {
                                                                success_reson:"添加通讯录成功"
                                                            }
                                                    });
                                                }
                                            });
                                        }else{
                                            res.json({
                                                success: -1,
                                                desc: 'fail',
                                                data: {}
                                            });
                                        }
                                    }else{
                                            res.json({//此时的result.errcode=0
                                                success: 0,
                                                desc: 'success',
                                                data: {}
                                            });
                                    }
                                });  
                            }
                        }) 
                }
            }
        }); 
   }
      //添加学生+cheeck
    function addStudent_check(req,res,next){
        //班级id
        var check_phone=req.body.student_phone;
        var school_id=req.session.school_id;
       classes_m.addStudent_check(check_phone,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result==""||result==null){
                   res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
               }else{
                res.json({
                        success: 1,
                        desc: '学生存在',
                        data: {
                        }
                 });
               }
           }
       })  
   }
    //添加担任班级校验
    function check_headmaster_yes(req,res,next){
        //班级id
       var  headmaster_m_id=req.body.headmaster_m_id;
       var school_id=req.session.school_id;;
       classes_m.check_headmaster_yes(school_id,headmaster_m_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result==""||result==null){
                   res.json({
                        success: 0,
                        desc: 'success',
                 });
               }else{
                   res.json({success:1,desc:"存在"});
               }
           }
       })  
   }
    //修改学生
    function modifyStudent(req,res,next){
        //学生id
        var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
        var school_id=req.session.school_id
        phones_m.getbase_config_schoolid(school_id,function(err,result){
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
                        base_config.agentid=elem.parentdep_id;
                        base_config.secret=elem.secret;
                    })
                         console.log("id:"+req.params.id);
                        var modifyname_status=req.body.modifyname_status;//0未改 1 改了 
                        var modifyphone_status="";//0未改 1 改了 
                        var parent_phone_old=req.body.parent_phone_old;//修改之前的电话即  企业号绑定的电话；
                        var parent_phone_new=req.body.parent_phone_new;
                        if(parent_phone_new==parent_phone_old){
                            modifyphone_status=0;
                        }else{
                            modifyphone_status=1;
                        }
                    classes_m.modifyStudent(req.params.id,req.body,function(err,result){
                        if(err){
                            res.json({
                                        success: -1,
                                        desc: 'fail',
                                        data: {}
                                    });
                            }else{
                                    if(modifyphone_status=="1"){//家长的电话修改了 
                                        message.add_user(req.body.parent_phone_new,req.body.parent_name,base_config,function(err,result){
                                            if(err){
                                                res.json({success:-1, desc:err.code});
                                            }else{
                                                if(result.errcode=="0"){
                                                    //添加成功  删除老用户
                                                    message.delete_user(req.body.parent_phone_old,base_config,function(err,result_add){
                                                        if(err){
                                                            res.json({
                                                                success:-1,
                                                                desc:err.code
                                                            })
                                                        }else{
                                                            if(result_add.errcode=="0"){//删除成功
                                                                res.json({
                                                                    success:0,
                                                                    desc:"删除成功"
                                                                })
                                                            }else{
                                                                res.json({
                                                                    success:-1,
                                                                    desc:result_add.errcode
                                                                })
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                        //创建一个新的用户  删除老用户
                                    }else if(modifyname_status=="1" && modifyphone_status=="0"){//只修改了名字
                                        message.modify_user(parent_phone_old,base_config,function(err,result){
                                            if(err){
                                                res.json({
                                                    success:-1,
                                                    desc:err.code
                                                })
                                            }else{
                                                res.json({
                                                    success: 0,
                                                    desc: 'success',
                                                    data: {
                                                    }
                                                });
                                            }
                                        });//修改userid下的name
                                    }else{//都未做修改
                                        res.json({
                                            success: 0,
                                            desc: 'success',
                                            data: {
                                            }
                                        });
                                }
                        }
                    })
                }
            }
        });  
   }
    //删除学生
    function deleteStudent(req,res,next){
        //根据学生的id查询 家长phone
        var parent_phone="";
          var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
          var school_id=req.session.school_id;
        phones_m.getbase_config_schoolid(school_id,function(err,result){
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
                        base_config.agentid=elem.parentdep_id;
                        base_config.secret=elem.secret;
                    })
                classes_m.get_parent_phone(req.params.id,function(err,result){
                        if(err){
                            res.json({
                                success:-1,
                                desc:"获取家长手机号码失败"
                            });
                        }else{
                            result.map(function(elem){
                                parent_phone=elem.parent_phone;
                            });
                            message.get_user(parent_phone,base_config,function(err,result){
                                if(err){
                                    if(err.code=="60111"){
                                    classes_m.deleteStudent(req.params.id,function(err,result){
                                        if(err){
                                            res.json({
                                                        success: -1,
                                                        desc: 'fail',
                                                        data: {}
                                                    });
                                        }else{
                                            res.json({
                                                    success: 0,
                                                    desc: 'success',
                                                    data: {
                                                    }
                                            });
                                        }
                                    })
                                 }
                                }else{
                                 message.delete_user(parent_phone,base_config,function(err,result){
                                        if(err){
                                            res.json({
                                                success:-1,
                                                desc:err.code
                                            })
                                        }else{
                                            if(result.errcode=="0"){//企业号删除家长电话成功
                                                //删除数据文件
                                                    classes_m.deleteStudent(req.params.id,function(err,result){
                                                        if(err){
                                                            res.json({
                                                                        success: -1,
                                                                        desc: 'fail',
                                                                        data: {}
                                                                    });
                                                        }else{
                                                            res.json({
                                                                    success: 0,
                                                                    desc: 'success',
                                                                    data: {
                                                                    }
                                                            });
                                                        }
                                                    })
                                            }else{
                                                //不管删除成不成功 都删除数据库
                                                classes_m.deleteStudent(req.params.id,function(err,result){
                                                        if(err){
                                                            res.json({
                                                                        success: -1,
                                                                        desc: 'fail',
                                                                        data: {}
                                                                    });
                                                        }else{
                                                            res.json({
                                                                    success: 0,
                                                                    desc: 'success',
                                                                    data: {
                                                                    }
                                                            });
                                                        }
                                                    })
                                                //     res.json({
                                                //     success:-1,
                                                //     desc:result.errcode
                                                // })
                                            }
                                        }
                                    });
                                }
                            });
                            
                        }
                    });
      
                }
            }
        });
   }
   //学生转班
    function modify_Class(req,res,next){
        //此时的id是一个有可能是数组
        var student_id=req.body.student_id;
        var class_id=req.body.class_id;
        console.log("转班："+class_id);
       // student_id.forEach(function(id){
             classes_m.modify_Class(student_id,class_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
           }
         })  
       // });
   }
    //查询班级下的学生
    function queryStudent(req,res,next){
        classes_m.queryStudent(req.params.id,function(err,result){
            if(err){
                res.json({
                    success: -1,
                    desc: 'fail',
                    data: {}
                    });
            }else{
                console.log("摸个班级的学生："+JSON.stringify(result));
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Student:result.map(function(elem){
                            return{
                                id:elem.id,
                                student_name:elem.student_name,
                                student_phone:elem.student_phone,
                                parent_name:elem.parent_name,
                                parent_phone:elem.parent_phone,
                                student_ID:elem.student_ID
                            }
                        })
                    }
                })

            }
        })
    }
//学生升级
    function all_Upgrade(req,res,next){
        var school_id=req.body.school_id;
        var type_grade_max="";
        var class_count=0;
        var class_body=["一班","二班","三班","四班","五班","六班","七班","八班","九班","十班","十一班","十二班","十三班","十四班","十五班","十六班","十七班","十八班","十九班"];
        var index=1;
       classes_m.get_school_maxgrade(school_id,function(err,result_max){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               result_max.map(function(elem){
                   type_grade_max=elem.max_grade+1;
               });
              console.log("1:::"+type_grade_max);
              classes_m.all_Upgrade(school_id,type_grade_max,function(err,result){//全体升级后
                if(err){
                    res.json({
                                success: -1,
                                desc: 'fail',
                                data: {}
                            });
                }else{
                    //全体升级 任课教师
                    classes_m.update_headteacher(school_id,type_grade_max,function(err,result){
                        if(err){
                            res.json({success:-1,desc:"fail"})
                        }else{
                            classes_m.get_type_count(school_id,function(err,result){
                                if(err){
                                    res.json({
                                        success: -1,
                                        desc: 'fail',
                                        data: {}
                                    });
                                }else{
                                    result.map(function(elem){
                                        class_count=elem.class_count;
                                    });
                                class_body= class_body.slice(0,class_count);
                                console.log("slice:"+JSON.stringify(class_body));
                                class_body.forEach(function(elem_class){
                                    classes_m.addClass("0",elem_class,school_id,function(err,result){
                                        if(err){
                                                res.json({success: -1,desc: 'fail'});
                                            }else{
                                                console.log("result::"+result);
                                                if(result=="existed"){
                                                    res.json({
                                                            success: 1,
                                                            desc: '班级存在',
                                                            data: {
                                                            }
                                                    });
                                                }else{
                                                    if(index==class_body.length){
                                                        res.json({
                                                            success: 0,
                                                            desc: 'success',
                                                            data: {}
                                                        });
                                                    }
                                                    index++;
                                                }
                                            }
                                        })
                                    })
                                }
                            });
                        }
                    })
                    //做一个循环插入班级
                  
                }
            })
           }
       });  
   }
   //条件查询班级下的学生
function query_Student(req,res,next){
       var id=req.params.id;
       classes_m.query_Student(id,req.body,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                             Student:result.map(function(elem){
                                return{
                                    id:elem.id,
                                    student_name:elem.student_name,
                                    student_phone:elem.student_phone,
                                    parent_name:elem.parent_name,
                                    parent_phone:elem.parent_phone,
                                    student_ID:elem.student_ID
                                }
                            })
                        }
                    });
               
           }
       })  
   }
 
//删除年级+学校
    function deleteClassAll(req,res,next){
        var type_grade=req.body.type_grade;
        var school_id=req.body.school_id;
       classes_m.deleteClassAll(type_grade,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
           }
       })  
   }
   //家长手机号
function binding_Phone(req,res,next){
        var openid=req.session.openuser;
       classes_m.binding_Phone(openid,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result=="-1"){//未绑定信息
                     res.render('binding_phone', {});//渲染界面+绑定
               }else if(result=="0"){
                    res.json({
                        success: 1,
                        desc: '您的手机号还没有和学生进行绑定',
                    });
               }else if(result=="1"){
                    res.json({
                        success: 1,
                        desc: '该班级已经不存在',
                    });
               }else if(result=="2"){
                    res.json({
                        success: 1,
                        desc: '该学校服务已经停止',
                    });
               }else if(result=="3"){
                    res.json({
                        success: 1,
                        desc: '今天还未发送还没有发送经纬度',
                    });
               }else{
                     res.render('get_long_latitude', {long_latitude_route:result});//渲染界面result=[{},{},{},{}]
               }
           }
       })  
   }
//绑定+家长手机号
    function binding_parent_phone(req,res,next){//此接口的仔细处理
        var parent_phone="18304077399"//req.body.parent_phone;
        var student_phone="18304077397"//req.body.student_phone;//要绑定的学生手机号
       // var student_name=//req.body.student_name;//学生姓名
        var openid="52100";//req.session.openuser;
       classes_m.check_student(student_phone,function(err,result){
           if(err){
                res.json({
                        success:-1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result=="1"){
                    res.json({
                        success: 1,
                        desc: '您要绑定的学生不存在' 
                    });
               }else if(result=="2"){
                    res.json({
                        success: 1,
                        desc: '该学生所在的班级已经删除'
                    });
               }else if(result=="3"){
                    res.json({
                        success: 1,
                        desc: '该学生所在的学校已经停止服务'  
                    });
               }else if(result=="4"){
                    res.json({
                        success: 1,
                        desc: '该学生已经在微信绑定手机号,如需绑定请解绑该学生的原来手机号！'
                    });
               }else{
               console.log("绑定手机测试："+student_phone);
               classes_m.binding_parent_phone(parent_phone,student_phone,openid,function(err,result_one){
                    if(err){
                        res.json({
                                success: -1,
                                desc: 'fail'
                                });
                    }else{
                    if(result_one=="1"){
                            res.json({
                                success: 1,
                                desc: 'web还没有绑定手机号'
                            });
                    }else if(result_one=="2"){
                            res.json({
                                success: 1,
                                desc: '您的手机号与在老师预留的手机号不一致,请联系班主任！' 
                            });
                    }else {
                            res.json({
                                success: 0,
                                desc: 'success',
                                data: {}
                            });
                    }
                    }
                })  
                }
            }
        });
    }
//获取全校学生考勤信息
function get_School_Puch(req,res,next){
    var school_id=req.body.school_id;
    classes_m.get_school_puch_modify(school_id,function(err,result){
        if(err){
            res.json({
                success:-1,
                desc:err,
                data:{}
            })
        }else{
            if(result=="1"){
                console.log("此学校还没有打卡记录");
                res.json({
                    success:1,
                    desc:"此学校还没有打卡记录",
                    data:{
                        Puch:[]
                    }
                })
            }else{
              console.log("数据的长度：："+result.length);
                res.json({
                    success:0,
                    desc:"success",
                    data:{
                        Puch:result.map(function(elem){
                            return{
                                student_name:elem.student_name,
                                student_phone:elem.student_phone,
                                class_name:elem.class_name,
                                puch_time:elem.puch_time
                            }
                        })
                    }
                });
            }
        }
    });
}
//班级考勤信息
function get_Class_Puch(req,res,next){
    var school_id=req.body.school_id;
    var class_id=req.body.class_id;
    classes_m.get_Class_Puch(school_id,class_id,function(err,result){
        if(err){
            res.json({
                success:-1,
                desc:err,
                data:{}
            })
        }else{
            if(result=="1"){
                console.log("此班级还没有打卡记录");
                res.json({
                    success:1,
                    desc:"此班级还没有打卡记录",
                    data:{
                        Puch:[]
                    }
                })
            }else{
            res.json({
                success:0,
                desc:"success",
                data:{
                    Puch:result.map(function(elem){
                        return{
                            student_name:elem.student_name,
                            student_phone:elem.student_phone,
                            class_name:elem.class_name,
                            puch_time:elem.puch_time
                        }
                    })
                }
            });
            }
        }
    });
}
//根据学校id条件查询学生信息
function query_School_Student(req,res,next){
    classes_m.query_School_Student(req.body,function(err,result){
        if(err){
            res.json({
                success:-1,
                desc:err,
                data:{}
            })
        }else{
            if(result=="1"){
                res.json({
                    success:1,
                    desc:"此条件下没有打卡记录",
                    data:{
                        Puch:[]
                    }
                })
            }else{
                res.json({
                    success:0,
                    desc:"success",
                    data:{
                        Puch:result.map(function(elem){
                            return{
                                student_name:elem.student_name,
                                student_phone:elem.student_phone,
                                class_name:elem.class_name,
                                puch_time:elem.puch_time
                            }
                        })
                    }
                });
            }
        }
    });
}
//根据学校id class_id条件查询学生信息
function query_Class_Student(req,res,next){
    classes_m.query_Class_Student(req.body,function(err,result){
        if(err){
            res.json({
                success:-1,
                desc:err,
                data:{}
            })
        }else{
            if(result=="1"){
                res.json({
                    success:1,
                    desc:"此条件下没有打卡记录",
                     data:{
                        Puch:[]
                    }
                })
            }else{
            res.json({
                success:0,
                desc:"success",
                data:{
                    Puch:result.map(function(elem){
                        return{
                            student_name:elem.student_name,
                            student_phone:elem.student_phone,
                            class_name:elem.class_name,
                            puch_time:elem.puch_time
                        }
                    })
                }
            });
            }
        }
    });
}
//根据学校id条件查询学生信息
function check_student_parent_phone(req,res,next){ 
    var student_phone=req.query.student_phone;
    var query_type   =req.query.query_type;
    var school_id=1;//req.session.school_id;
        classes_m.check_student_parent_phone(student_phone,school_id,query_type,function(err,result){
            if(err){
                res.json({success:-1,desc:"fail"});
            }else{
                if(query_type=="0"||query_type=="1"){
                    if(result==""||result==null){
                        res.json({success:0,desc:student_phone+"不存在该手机号" })
                    }else{
                        res.json({success:1,desc:student_phone+"存在该手机号" })
                    }
                }else{
                    if(result[0].count>=2){
                         res.json({success:1,desc:student_phone+"存在该手机号" })
                    }else{
                         res.json({success:0,desc:student_phone+"不存在该手机号" });
                    }
                }
            }
        });
}
//学生的位置
function get_Student_Position(req,res,next){
     var parent_phone=req.body.user_id;
     classes_m.insert_parent_request(parent_phone,function(err,result){
                if(err){
                    res.json({success:-1,desc:"fail"});
                }else{
                    if(result=="0"){
                        res.json({success:1,desc:"没有进行学生绑定!"})
                    }else if(result=="1" ){
                        res.json({success:1,desc:"学生所在的班级已经删除!"})
                    }else if(result=="2"){
                        res.json({success:1,desc:"学生所在的学校已经停止服务!"})
                    }else{
                     classes_m.get_student_position(parent_phone,function(err,result_all){
                        if(err){
                            res.json({success:-1,desc:"fail"});
                        }else{
                            console.log(JSON.stringify(result_all));
                            res.json({success:0,desc:"success",data:{
                                Range:result_all,
                            }})
                        }
                    })
                  }
                }
            });
   
}
//学生今日考勤
function get_Student_Position_Puch(req,res,next){
     var parent_phone=req.body.user_id;
     classes_m.get_Student_Position_Puch(parent_phone,function(err,result){
         if(err){
             res.json({success:-1,desc:"fail"})
         }else{
             if(result=="1"){
                 res.json({success: 1,desc:"学生所在的班级已经删除!"});
             }else  if(result=="2"){
                 res.json({success: 1,desc:"绑定的学校服务停止!"});
             }else  if(result=="3"){
                 res.json({success: 0,desc:"今日还没有打卡"});
             }else{
                 var data_last=[]
                 console.log(JSON.stringify(result));
                    var all_data={date:result.date,week:getWeekday(result.date),name:result.name,data:result.data}
                 res.json({success: 0,desc:"success",data:all_data
                 })
             }
         }
     })
}
//学生历史考勤
function get_student_position_Allpuch(req,res,next){
     var parent_phone=req.body.user_id;
    classes_m.get_student_position_Allpuch(parent_phone,function(err,result){
         if(err){
             res.json({success:-1,desc:"fail"})
         }else{
             if(result=="1"){
                 res.json({success: 1,desc:"学生所在的班级已经删除!"});
             }else  if(result=="2"){
                 res.json({success: 1,desc:"绑定的学校服务停止!"});
             }else  if(result=="3"){
                 res.json({success: 0,desc:"今日还没有打卡"});
             }else{
                 var data_last=[]
                 result.forEach(function(elem){
                     var all_data={date:elem.date,week:getWeekday(elem.date),name:elem.name,data:elem.data}
                     data_last.push(all_data);
                 })
                 Sort_date(data_last);//给数组排序 
                 res.json({success: 0,desc:"success",data:data_last
                 })
             }
         }
     })
}
function Sort_date(arr){//排序
    arr.sort(function(a, b){  
        return parseInt(b.date.replace(/-/g, ''), 10) - parseInt(a.date.replace(/-/g, ''), 10);//降序
    });
}
//日期转换
function formatDate (date) {  
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? '0' + m : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;
            var h=date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var mi=date.getMinutes();
            mi = mi < 10 ? ('0' + mi) : mi;
            var s=date.getSeconds();
            s = s < 10 ? ('0' + s) : s;
            return y + '-' + m + '-' + d +  '&nbsp;&nbsp;'  + h + ':' + mi + ':' + s;  
}//日期转换_day
function formatDate_day (date) {  
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? '0' + m : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d ; 
}
function getWeekday(sDate){//获取星期
    var dt = new Date(sDate.replace(/-/g, '/'));
    var a = ['周日', '周一','周二','周三','周四','周五','周六'];
    return a[dt.getDay()];
}
    return {
        queryClass:queryClass,
        addClass:addClass,
        deleteClass:deleteClass,
        addStudent:addStudent,
        modifyStudent:modifyStudent,
        deleteStudent:deleteStudent,
        modify_Class:modify_Class,
        queryStudent:queryStudent,
        all_Upgrade:all_Upgrade,
        query_Student:query_Student,
        deleteClassAll:deleteClassAll,
        queryType_Class:queryType_Class,
        delete_Grade:delete_Grade,
        //绑定家长手机号
        binding_Phone:binding_Phone,
        binding_parent_phone:binding_parent_phone,
        addStudent_check:addStudent_check,
        get_School_Puch:get_School_Puch,
        get_Class_Puch:get_Class_Puch,
        query_School_Student:query_School_Student,
        query_Class_Student:query_Class_Student,
        check_headmaster_yes:check_headmaster_yes,
        check_student_parent_phone:check_student_parent_phone,
        //学生位置信息

        get_Student_Position:get_Student_Position,
        get_Student_Position_Puch:get_Student_Position_Puch,
        get_student_position_Allpuch:get_student_position_Allpuch
        
    };
})();

module.exports = exports = Class;