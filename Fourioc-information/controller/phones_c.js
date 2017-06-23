var util = require('util');
var Promise = require('promise');
var session_c = require('./session_c');
var phones_m = require('../model/phones_m');
var message = require('./../api/media/message');
var Phone = (function () {
    //开始答题
    function start_Question(req,res,next){
        var wb_number=req.params.wb_number;
        var phone=req.session.user;
        if(phone==""||phone==null){
             res.redirect('/login');
        }else{
        phones_m.start_Question(wb_number,phone,function(err,result){
            if(err){
                res.json({
                    success: -1,
                    desc: 'fail',
                    data: {}
                    });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                            answer_mark_m_id:result
                    }
                })

            }
        })
        }
    }
   //结束答题
    function end_Question(req,res,next){
        var id=req.params.answer_mark_m_id;
       phones_m.end_Question(id,function(err,result){
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
   //app答题
    function app_Answer(req,res,next){
        var wb_number=req.body.wb_number;
        var student_phone=req.body.student_phone;
        var answer_ok=req.body.answer_ok;
       phones_m.app_Answer(wb_number,student_phone,answer_ok,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               console.log("result返回值测试:"+result);
               //在这里做result判断
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            result:result
                        }
                 });
           }
       })  
   }
    //app答题撤销
    function app_Answer_Revoke(req,res,next){
        var wb_number=req.body.wb_number;
        var student_phone=req.body.student_phone;
       // var answer_ok=req.body.answer_ok;
       phones_m.app_Answer_Revoke(wb_number,student_phone,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               console.log("result返回值测试:"+result);
               //在这里做result判断
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            result:result
                        }
                 });
           }
       })  
   }
    //答案分析
    function analys_Questions(req,res,next){
     var id=req.params.answer_mark_m_id;
     var type=req.body.type;
     var ture_answer=req.body.answer_ok;
     if(type=="0"||type=="2"){
       phones_m.analys_Questions(id,type,ture_answer,function(err,elem){
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
                                    answer:elem.answer,
                                    invalid_count:elem.invalid_count,
                                    noanswer_person_count:elem.noanswer_person_count,
                                    allclass_person_count:elem.allclass_person_count,
                                    answer_ture:elem.answer_ture
                        }
                 });
           }
       })  
    }else{
        phones_m.analys_Questions_Two(id,type,ture_answer,function(err,elem){//多选的判断
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
                                    answer:elem.answer,
                                    invalid_count:elem.invalid_count,
                                    noanswer_person_count:elem.noanswer_person_count,
                                    allclass_person_count:elem.allclass_person_count,
                                    answer_ture:elem.answer_ture
                        }
                 });
           }
       })
    }
   }
       //查询答题情况
    function query_Questions(req,res,next){
        var id=req.params.answer_mark_m_id;
        var ture_answer=req.body.answer_ok;
        var type=req.body.type;
       phones_m.query_Questions_Byclass(id,ture_answer,type,function(err,result){
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
                            ture_person:result.ture_person,
                            false_person:result.false_person,
                            vilidate_person:result.vilidate_person,
                            no_person:result.no_person,
                            all_person:result.all_person,
                            all_once:result.all_once,
                            class_id:result.class_id,
                            current_location:result.current_location,
                            class_count:result.class_count
                        }
                 });
           }
       })  
   }
    //下一个班级
    function query_Questions_Next(req,res,next){
        var id=req.params.answer_mark_m_id;
        var ture_answer=req.body.answer_ok;
        var type=req.body.type;
        var current=req.body.current;
       phones_m.query_Questions_Byclass_next(id,ture_answer,type,current,function(err,result){
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
                            ture_person:result.ture_person,
                            false_person:result.false_person,
                            vilidate_person:result.vilidate_person,
                            no_person:result.no_person,
                            all_person:result.all_person,
                            all_once:result.all_once,
                            class_id:result.class_id,
                            current_location:result.current_location
                        }
                 });
           }
       })  
   }
     //app_getphone
    function app_getPhone(req,res,next){
       var student_phone=req.body.student_phone;
       console.log("app_student_phone:"+student_phone);
       phones_m.app_getPhone(student_phone,function(err,result){
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
                            Phone:result.map(function(elem){
                                return{
                                     name:elem.name,
                                     phone:elem.phone,
                                     status:elem.status
                                }
                            }) 
                        }
                 });
           }
       })  
   }
       function app_getName(req,res,next){
       var student_phone=req.body.student_phone;
       console.log("app_student_phone:"+student_phone);
       phones_m.app_getName(student_phone,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result==""||result==null){
                   res.json({success:-1,desc:"该学生不存在,请联系管理员!"})
               }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            Name:result.map(function(elem){
                                return{
                                      student_name:elem.student_name
                                }
                            })
                        }
                 });
               }
           }
       })  
   }
    function app_Mac(req,res,next){
       var  wb_number=req.body.wb_number;
       phones_m.app_Mac(wb_number,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               console.log(result);
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            result:result
                        }
                 });
           }
       })  
   }
function getposition(req,res,next){
       var id=1;
       phones_m.getposition(id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                console.log(result);
                var arr_all=[];
                var index=1;
                result.map(function(elem){
                    var arr_one=[];
                    var long=elem.door_position.split(",")[0];
                    var lati=elem.door_position.split(",")[1];
                    arr_one.push(long);
                    arr_one.push(lati);
                    arr_all.push(arr_one);
                    if(index==result.length){
                          console.log(arr_one);
                            res.json({
                                    success: 0,
                                    desc: 'success',
                                    data: {
                                        result:arr_all
                                    }
                            });  
                    }
                     index++;
                })
              
           }
       })  
   }
//
 function app_AddPhone(req,res,next){
        var student_phone=req.body.student_phone;
        var relative_name=req.body.relative_name;
        var phone=req.body.phone;
        if(student_phone==""||student_phone==null){
            res.json({success:-1,desc:"student_phone参数传递失效"})
        }else if(relative_name==""||relative_name==null){
            res.json({success:-1,desc:"relative_name参数传递失效"})
        }else if(phone==""||phone==null){
            res.json({success:-1,desc:"phone参数传递失效"})
        }else{
       phones_m.app_AddPhone(student_phone,relative_name,phone,function(err,result){
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
   }
    function app_DeletePhone(req,res,next){
        var student_phone=req.body.student_phone;
        var phone=req.body.phone;
       phones_m.app_DeletePhone(student_phone,phone,function(err,result){
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
//手机获取经纬度
function get_Long_Latitude_Range(req,res,next){
        var student_phone=req.body.phone;
       phones_m.get_Long_Latitude_Range(student_phone,function(err,result){
           if(err){
               res.json({
                        success: 0,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result=="0"){
                    res.json({
                        success: 0,
                        desc: 'fail',
                        data: {
                            fail_reson:"不存在该学生"
                        }
                    });
               }else if(result=="1"){
                    res.json({
                        success: 0,
                        desc: 'fail',
                        data: {
                            fail_reson:"此班级没有分配所在的学校"
                        }
                    });
               }else if(result=="2"){
                    res.json({
                        success: 0,
                        desc: 'fail',
                        data: {
                            fail_reson:"此学校没有查到信息"
                        }
                    });
               }else if(result=="3"){
                     res.json({
                        success: 0,
                        desc: 'fail',
                        data: {
                            fail_reson:"此学校还没有定位经纬度"
                        }
                    });
               }
               else{
                   res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            Range:result.map(function(elem){
                                return{
                                    longitude:elem.longitude,
                                    latitude:elem.latitude,
                                    school_id:elem.school_id,
                                    class_id:elem.class_count
                                }
                            })
                        }
                 });
               }
           }
       })  
   }
//学生打卡
function puch_Student(req,res,next){
        var student_phone=req.body.phone;//
        var in_out=req.body.in_out;
        var temporary=req.body.longitude+","+req.body.latitude;
        var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
        phones_m.getbase_config(student_phone,function(err,result){
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
                     phones_m.puch_Student(student_phone,in_out,temporary,function(err,result){
                        if(err){
                            res.json({
                                     success: -1,
                                        desc: 'fail',
                                        data: {}
                                    });
                        }else{
                                if(result=="0"){
                                    res.json({
                                        success: 1,
                                        desc: 'fail',
                                        data: {
                                            fail_reson:"不存在该学生"
                                        }
                                    });
                            }else if(result=="1"){
                                    res.json({
                                        success: 1,
                                        desc: 'fail',
                                        data: {
                                            fail_reson:"此班级没有分配所在的学校"
                                        }
                                    });
                            }else{
                                //像家长推送一条消息
                                var parent_phone=result.parent_phone;//家长电话+企业的userid
                                var text_content="";
                                if(in_out==0){
                                    text_content=result.student_name+"的家长您好,"+"您的孩子于"+new Date().toLocaleString()+"进入校园";
                                }else{
                                    text_content=result.student_name+"的家长您好,"+"您的孩子于"+new Date().toLocaleString()+"离开校园";
                                }
                               //  req.session.weixin_school.studentsaveapp_id;//这个现在这么做还不行+未做任何操作
                                message.send_text(parent_phone,text_content,base_config,function(err,result){
                                    if(err){
                                        console.log("发送消息失败"+err);  
                                        res.json({
                                                success: 1,
                                                desc: err.code,
                                                data: {
                                                    success_reson:"发送消息失败"
                                                }
                                            });
                                    }else{
                                        res.json({
                                                success: 0,
                                                desc: 'success',
                                                data: {
                                                    success_reson:"打卡成功"
                                                }
                                            });
                                    }
                                });
                            }
                        }
                    })  
                }
            }
        });
   }
 //报告学生经纬度接口 后期需要更改 
function student_Long_Lat(req,res,next){
        var student_phone=req.body.phone;
        var longitude=req.body.longitude;
        var latitude=req.body.latitude;
        var interval_time=10;//所有学校10分钟内的并发量
        //根据所有学校家长提交过得查询数据请求量
        var ave_sec_ave_count=0;
        var ave_sec_one_count=0;
        var trans_frequency=5;//默认5分钟发送一次
         phones_m.get_allschool_count(interval_time,student_phone,function(err,result){//根据此时数据库的压力进行来分析下次此人的发送数据时间
            if(err){
                res.json({
                    success: -1,
                    desc: 'fail',
                    data: {}
                })
            }else{
                if(result==""||result==null){
                    res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    })
                }else{
                 ave_sec_one_count=parseInt(result.one_count)/(10*60);// 
                 ave_sec_ave_count=(parseInt(result.all_count)/(10*60))/parseInt(result.school_count);//平均每个学校的并发量
             //计算单个学校的并发量占据总并发量的比例来推算
             var return_data_algorithm=data_algorithm(ave_sec_ave_count,ave_sec_one_count);
             if(ave_sec_one_count>=0){//在这里根据并发量设置下次响应的时间
                   trans_frequency=6;
                   var dely_time=1;//并发量非常的大+有待测试
                   phones_m.student_count(student_phone,dely_time,function(err,result){//查询该学生的家长是否在定义的时间内查询过该学生的地理位置
                    if(err){
                        res.json({
                                success: -1,
                                desc: 'fail',
                                data: {}
                                });
                    }else{
                        console.log("是否做过查询："+JSON.stringify(result));
                        if(result==""||result==null){//在定义的时间内未做过查询 
                            //按正常频率发送地理位置+数据库的并发次数+该学校
                            trans_frequency=6;
                            phones_m.student_Long_Lat(student_phone,longitude,latitude,function(err,result){//插入经纬度
                                if(err){
                                    res.json({
                                        success:0,
                                        desc:"success",
                                        data:{}
                                    })
                                }else{
                                    res.json({
                                            success: 0,
                                            desc: 'success',
                                            trans_frequency:trans_frequency,
                                    });
                                }
                            });
                        }else{ //查询过该学生的地理位置
                            //可以根据数据库的压力来发送
                            trans_frequency=7//下次发送的时间间隔
                            phones_m.student_Long_Lat(student_phone,longitude,latitude,function(err,result){
                                if(err){
                                    res.json({
                                        success:0,
                                        desc:"success",
                                        data:{}
                                    })
                                }else{
                                    res.json({
                                            success: 0,
                                            desc: 'success',
                                            trans_frequency:trans_frequency,
                                    });
                                }
                            });
                        }
                    }
                })
             }else{
                res.json({
                            success: 0,
                            desc: 'success',
                            trans_frequency:'算法还没有写!',
                    });
             }
            }
            }
        });  
   }
    //报告学生经纬经纬度临时
function student_Long_Lat_temporary(req,res,next){
        var student_phone=req.body.phone;
        var longitude=req.body.longitude;
        var latitude=req.body.latitude;
        var dely_time=1;//家长在 一 分钟之内是否做过查询 min  可根据查询的条数  做 是否是很急
        var trans_frequency="60";//默认下次查询的时间
        //根据所有学校家长提交过得查询数据请求量
        phones_m.student_count(student_phone,dely_time,function(err,result){//查询该学生的家长是否在定义的时间内查询过该学生的地理位置
                if(err){
                    res.json({
                            success: -1,
                            desc: 'fail',
                            data: {}
                            });
                }else{
                    console.log("是否做过查询："+JSON.stringify(result));
                    if(result=="0"){//在定义的时间内未做过查询 
                         res.json({success:-1,desc:"不存在该学生!"})
                    }else if(result=="1"){//在定义的时间内未做过查询 
                         res.json({success:-1,desc:"学生所在的班级删除!"})
                    }else if(result=="2"){//在定义的时间内未做过查询 
                         res.json({success:-1,desc:"学生所在的学校已经停止服务!"})
                    }else if(result[0].count_m==0){//在定义的时间内未做过查询 
                        phones_m.student_tempary(student_phone,longitude,latitude,function(err,result){
                            if(err){
                                res.json({
                                    success:0,
                                    desc:"success",
                                    data:{}
                                })
                            }else{
                                res.json({
                                        success: 0,
                                        desc: 'success',
                                        trans_frequency:trans_frequency,
                                });
                            }
                        });
                    }else{ //查询过该学生的地理位置
                        if(result[0].count_m==2){
                             trans_frequency="30"//下次发送的时间间隔 s
                        }else if(result[0].count_m>=3){//默认是1分钟两条 信息  当大于 两条的时候 
                             trans_frequency="20"//一分钟三条信息
                        }
                        phones_m.student_tempary(student_phone,longitude,latitude,function(err,result){
                            if(err){
                                res.json({
                                    success:0,
                                    desc:"success",
                                    data:{}
                                })
                            }else{
                                res.json({
                                        success: 0,
                                        desc: 'success',
                                        trans_frequency:trans_frequency,
                                });
                            }
                        });
                    }
                }
            }) 
   }
   //根据并发量写一个算法
   function data_algorithm(ave_sec_ave_count,ave_sec_one_count){
       //数据库算法设计
       var school_trans_frequency=5;
       if(ave_sec_one_count>ave_sec_ave_count){//如果该学生所在的学校的并发量大于平局并发量
           school_trans_frequency=6;
       } 
       return school_trans_frequency;
   }
   //添加
   function puch_adduser(req,res,next){
        var parent_phone="18304077397";
       // var parent_name="钱明888896";
         message.get_user(parent_phone,function(err,result){
                       if(err){
                           console.log("发送消息失败"+err);  
                           res.json({
                                success: -1,
                                desc: err,
                                data: {
                                    success_reson:err.code//此用户不存在+状态码60111
                                }
                            });
                       }else{
                           res.json({
                                success: 0,
                                desc: 'success',
                                data: {
                                    success_reson:result.errcode//用户存在+状态码0
                                }
                            });
                       }
                   });

    }
    return {
        start_Question:start_Question,
        end_Question:end_Question,
        app_Answer:app_Answer,
        query_Questions:query_Questions,
        analys_Questions:analys_Questions,
        query_Questions_Next:query_Questions_Next,
        app_Answer_Revoke:app_Answer_Revoke,
        app_getPhone:app_getPhone,
        app_Mac:app_Mac,
        app_AddPhone:app_AddPhone,
        app_DeletePhone:app_DeletePhone,
        get_Long_Latitude_Range:get_Long_Latitude_Range,
        puch_Student:puch_Student,
        student_Long_Lat:student_Long_Lat,
        //algorithm
        data_algorithm:data_algorithm,//数据库并发量算法
        puch_adduser:puch_adduser,
        app_getName:app_getName,
        getposition:getposition,
        //报告学生临时位置

        student_Long_Lat_temporary:student_Long_Lat_temporary
        
    };
})();

module.exports = exports = Phone;