var Promise = require('promise');
var classes_m_sql = require('../classes_m_sql');
/**
 * 表结构  
 */
//页面加载
module.exports.teacher_addcomment = function(data,cb) {
   var all_push=[];
   var index=1;
   var comment_id="";
    classes_m_sql.insert_comment(data,function(err,result){//查询这个家长下的学生名字
            if(err){
                cb(err);
            }else{
                comment_id=result.insertId;
               data.rate.parent_list.forEach(function(element) {//根据
                    var parent_phone=element;
                    var student_info={student_name:"",new_id:"",comment_id:comment_id,parent_phone:parent_phone};
                    classes_m_sql.get_studentname_byparentphone(parent_phone,function(err,result){//查询这个家长下的学生名字
                        if(err){
                            cb(err);
                        }else{
                            result.map(function(element){
                                student_info.student_name=element.student_name;
                            });
                            classes_m_sql.insert_new(data,comment_id,parent_phone,function(err,result_new){
                                if(err){
                                    cb(err);
                                }else{
                                    student_info.new_id=result_new.insertId;
                                    all_push.push(student_info);
                                    console.log(JSON.stringify(all_push));
                                    if(data.rate.parent_list.length==index){
                                        cb(null,all_push);
                                    }
                                    index++;
                                }
                            });
                        }
                    }); 
                })
        }})
}
module.exports.get_new = function(data,status,cb) {
    var teacher_comment_id=[];
    var all_array=[];
    classes_m_sql.get_new_comid(data,status,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,"1");
            }else{
                var index_one=1;
                result.forEach(function(element){
                    var new_list={teacher_comment_id:"",new_id:""}
                    new_list.new_id=element.id;
                    new_list.teacher_comment_id=element.teacher_comment_id;
                    teacher_comment_id.push(new_list)
                    if(index_one==result.length){
                    var index=1;
                    var length=teacher_comment_id.length;
                    teacher_comment_id.forEach(function(elem){
                        var teacher_comment_id=elem.teacher_comment_id;
                        var new_list={comment_id:"",evaluate_status:"",evaluate_content:"",publisher:"",new_id:elem.new_id,editTime:""}
                    classes_m_sql.get_comment(teacher_comment_id,function(err,result_last){
                            if(err){
                                cb(err);
                            }else{
                                result_last.map(function(element2){
                                    new_list.comment_id=element2.id;
                                    new_list.evaluate_status=element2.evaluate_status;
                                    new_list.evaluate_content=element2.evaluate_content;
                                    new_list.publisher=element2.publisher;
                                    new_list.editTime=element2.editTime
                                });
                                all_array.push(new_list);
                                if(index==length){//这里用result.length不会返回数值
                                    console.log(JSON.stringify(all_array));
                                    cb(null,all_array);
                                }
                                index++;
                            }
                        });
                    });
                    }
                    index_one++;
                });
            }
        }
    });
}
module.exports.get_publishedcomment= function(userid,corpid,cb){ 
    classes_m_sql.get_published(userid,corpid,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,result);
            }else{
                var comment_id="";
                var teacher_phone=""
                var all_back=[];
                result.forEach(function(elem){
                    var all_={comment_id:elem.id, editTime:elem.editTime, id:userid, comment_test:"",}
                    comment_id=elem.id;
                    classes_m_sql.get_parentphone_comment(comment_id,function(err,result){
                        if(err){
                            cb(err)
                        }else{
                             var parent=[]
                             result.map(function(elem){
                                 phone.push(elem.recevice_phone)
                             })
                             var notice_parent_name="";
                             phone.forEach(function(elem){
                                classes_m_sql.get_studentname_byparentphone(elem,function(err,result){
                                    if(err){
                                        cb(err);
                                    }else{
                                        if(resulr==""||result==null){
                                            console.log(elem+"没有对应的学生");
                                        }else{
                                            result.map(function(elem){
                                                notice_parent_name=notice_parent_name+"["+elem.student_name+"]";
                                            })
                                            if(phone.length==index){
                                                all_.comment_test=notice_parent_name;
                                                if(result.length==index_two){
                                                    
                                                }
                                            }
                                            index++;
                                        }
                                    }
                                })
                             })
                        }
                    })
                })
                cb(null,result)
            }
        }
    });
}
//页面加载班主任所教授的班级成员父母电话号码
module.exports.get_parentinfo= function(userid,corpid,cb){//根据
    classes_m_sql.get_parentinfo(userid,corpid,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,"1");
            }else{
                //
                var split_teachering=[];//担任授课班级数组
                var split_headmaster=[];
                var spilt_headmaster="";
                var index_one=1;
                var index_two=1;
                var teacher_class={teacher_name:"",header_class:"",school_id:"",teachering_class_list:""}
                result.map(function(element){
                    teacher_class.teachering_class_list=element.teacheringclass_list;//授课班级
                    teacher_class.teacher_name=element.teacher_name;
                    teacher_class.header_class=element.headmaster_class_id;//担任班主任
                    teacher_class.school_id=element.school_id;
                });
                var split_ll_teachering=teacher_class.teachering_class_list;//每次从头开始
                var split_ll_headmaster=teacher_class.header_class;//每次从头开始
                if(split_ll_teachering=="||"){
                    split_teachering=[];
                }else{
                var split_ll=split_ll_teachering.split("||")
                split_ll.forEach(function(elem){
                    var array={type_grade:"",class:""};
                    array.type_grade=elem.split(",")[0];
                    array.class=elem.split(",")[1];
                    split_teachering.push(array);//此时就一条
                    if(split_ll.length==index_one){
                        teacher_class.teachering_class_list=split_teachering;
                    }
                    index_one++;
             })
            }
            if(split_ll_headmaster==""){
                teacher_class.header_class="";
            }else{
              var split_ll_headmaster=split_ll_headmaster.split("||")
               split_ll_headmaster.forEach(function(elem){
                    var array={type_grade:"",class:""};
                    array.type_grade=elem.split(",")[0];
                    array.class=elem.split(",")[1];
                    split_headmaster.push(array);//此时就一条
                    if(split_ll_headmaster.length==index_two){
                        teacher_class.header_class=split_headmaster;
                    }
                    index_two++;
             })
            }
            //根据查询出来的进行班级查询
             console.log("班级"+JSON.stringify(teacher_class));
             cb(null,teacher_class);
            }
        }
    });
}
module.exports.get_noticeparent_phone= function(array_headmaster,school_id,cb){
    //根据；两个数组做
    var headmaster_id=[];
    var class_master_id=""
    var head_list=[];
    // var head_array={head:"",class:""}
    var head_array={class_name:"",parent_name:""}
    var index=1;
    console.log("array_headmaster::"+JSON.stringify(array_headmaster));
    if(array_headmaster.length==0){
        cb(null,head_array);
    }else{
    array_headmaster.forEach(function(element){
        head_array.class_name=class_change(element.type_grade)+element.class;
        classes_m_sql.get_classid_bytype(element.type_grade,element.class,school_id,function(err,result){
            if(err){
                cb(err);
            }else{
                if(result==""||result==null){
                    console.log("您所在的班级已经删除");
                }else{
                    result.map(function(element){
                       class_master_id=element.id;
                    });
                    //根据班级id 查询学生家长
                    classes_m_sql.get_parent_phonebyid(class_master_id,function(err,result_last){
                        if(err){
                            cb(err);
                        }else{
                            if(result==""||result==null){
                                cb(null,"2");
                            }else{
                                if(result_last.length==0){
                                     cb(null,"2");
                                }else{
                                result_last.forEach(function(element){
                                    var head_parent={name:"",phone:"",avatar:""}
                                    head_parent.name=element.parent_name;
                                    head_parent.phone=element.parent_phone;
                                    head_parent.avatar=element.parent_avatar;
                                    head_list.push(head_parent);
                                    if(index==result_last.length){
                                        head_array.parent_name=head_list;
                                        cb(null,head_array);
                                    }
                                    index++;
                                })
                            }
                            }
                        }
                    })
                }
            }
        })
    });
    }
}
module.exports.get_noticeparent_phone_class= function(array_headmaster_no,array_teachering,school_id,cb){
    //根据；两个数组做
    var headmaster_id=[];
    var head_list=[];
    var head_array={head:"",class:[]}
    var index_one=1;
    var index=1;
    var array_headmaster=distinct(array_headmaster_no,array_teachering);//两个数组去重复
    console.log("数组驱虫后：："+JSON.stringify(array_headmaster));
    array_headmaster.forEach(function(element){
        console.log("所在班级"+JSON.stringify(element));
        var type_grade=element.type_grade;
        var class_m=element.class;
        classes_m_sql.get_classid_bytype(element.type_grade,element.class,school_id,function(err,result){//查询所在的班级是否存在
            if(err){
                cb(err);
            }else{
                if(result==""||result==null){
                    console.log("element空");
                    console.log("您所在的班级已经删除"+element.type_grade+element.class);
                     if(index_one==array_headmaster.length){
                            cb(null,head_array);
                        }
                          index_one++;
                }else{
                    var class_master_id=""//位置的错误
                    result.map(function(element){
                       class_master_id=element.id;
                    });
                    //根据班级id查询学生家长
                    console.log("element+++"+class_master_id);
                    classes_m_sql.get_parent_phonebyid(class_master_id,function(err,result_class){
                        if(err){
                            cb(err);
                        }else{
                            if(result_class==""||result_class==null){//如果所在的班级没人没走
                                if(index_one==array_teachering.length){
                                     console.log("所在的班级没人：："+class_master_id);
                                     cb(null,head_array);
                                }
                                  index_one++;   
                            }else{
                      
                            result_class.forEach(function(element){
                                var head_parent={name:"",phone:"",avatar:""}
                                head_parent.name=element.parent_name;
                                head_parent.phone=element.parent_phone;
                                head_parent.avatar=element.parent_avatar;
                                head_list.push(head_parent);
                              
                                if(index==result_class.length){
                                    var one={class_name:"",class_parent:[]}
                                    one.class_name=class_change(type_grade)+class_m;
                                    one.class_parent=head_list;
                                    head_array.class.push(one)
                                    head_list=[];
                                    index=0;//此时清零
                                    if(index_one==array_headmaster.length){
                                        cb(null,head_array);
                                    }
                                }
                                index++;
                            })
                             index_one++;
                         }
                        }
                    })
                    
                }
            }
        })
    });
}
//通过phone获取信息//现在的身份有一个  有可能
module.exports.getUserByUserId= function(corpid,userid,cb){
    var identity="";
    classes_m_sql.get_student_yes(userid,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                identity="";
                classes_m_sql.get_parent_yes(userid,function(err,result_parent){
                    if(err){
                        cb(err);
                    }else{
                        if(result_parent==""||result_parent==null){
                             identity="";
                             classes_m_sql.get_teacher_yes(userid,function(err,result_teacher){
                                 if(err){
                                     cb(err)
                                 }else{
                                     if(result_teacher==""||result_teacher==null){
                                        identity=0;
                                        cb(null,identity);
                                     }else{
                                         identity=2;
                                         cb(null,identity);
                                     }
                                 }
                             })
                        }else{
                            identity=3;
                            cb(null,identity);
                        }
                    }
                })
            }else{
                identity=1;
                cb(null,identity)
            }
        }
    });
}
//通过phone获取信息
module.exports.get_classes= function(corpid,userid,cb){//获取班主任信息
      var type_grade="";
      var class_m="";
      var school_id="";
      var class_id="";
      var all_back={name:"",student_num:"",teacher:""}
     classes_m_sql.get_student_yes(userid,function(err,result){
        if(err){
            cb(err);
        }else{
            result.map(function(element){
                class_id=element.class_id;
                all_back.name=element.student_name;
            });
            classes_m_sql.get_class_yes(class_id,function(err,result){
                if(err){
                    cb(err);
                }else{
                    result.map(function(element){
                        student_num=element.number;
                        all_back.student_num=element.student_num;
                    });
                    classes_m_sql.get_grade_type_byclassid(class_id,function(err,result){
                        if(err){
                            cb(err);
                        }else{
                             result.map(function(element){
                                  type_grade=element.type_grade;
                                  class_m=element.class;
                                  school_id=element.school_id;
                             });
                             var headmaster_class_id=type_grade+","+class_m;
                             classes_m_sql.get_headmaster_name(headmaster_class_id,function(err,result_last){
                                 if(err){
                                     cb(err);
                                 }else{
                                     if(result_last==""||result_last==null){
                                         cb(null,"还没有分配班主任");
                                     }else{
                                         result_last.map(function(element_2){
                                              all_back.teacher=element_2.teacher_name;
                                         });
                                        cb(null,all_back);
                                     }
                                 }
                             });
                        }
                    });
                }
            });
        }
    })
}
//添加班级通知
module.exports.teacher_addactivity = function(data,cb) {
   var all_push=[];
   var index=1;
   var comment_id="";
    classes_m_sql.insert_activity(data,function(err,result){//查询这个家长下的学生名字
            if(err){
                cb(err);
            }else{
             if(data.activity.state==1){//立即发布
               classnotice_id=result.insertId;
               data.parent.forEach(function(element) {//根据
                    var parent_phone=element;
                    var student_info={student_name:"",new_id:"",classnotice_id:classnotice_id,parent_phone:parent_phone};
                    classes_m_sql.get_studentname_byparentphone(parent_phone,function(err,result){//查询这个家长下的学生名字
                        if(err){
                            cb(err);
                        }else{
                            result.map(function(element){
                                student_info.student_name=element.student_name;
                            });
                            classes_m_sql.insert_classnotice(data,classnotice_id,parent_phone,function(err,result_notice){
                                if(err){
                                    cb(err);
                                }else{
                                    student_info.new_id=result_notice.insertId;
                                    all_push.push(student_info);
                                    console.log(JSON.stringify(all_push));
                                    if(data.parent.length==index){
                                        cb(null,all_push);
                                    }
                                    index++;
                                }
                            });
                        }
                    }); 
                })
            }else{
                cb(null,result);
            }
        }
    })
}
//获取班级通知的草稿
module.exports.get_draftactivity= function(userid,corpid,type,cb){
    var  id=[]
    if(type<=2){
        classes_m_sql.get_draftactivity(userid,corpid,type,function(err,result){
            if(err){
                cb(err);
            }else{
                cb(null,result)
            }
        });
    }else{
        classes_m_sql.get_classnotice(userid,corpid,type,function(err,result){
            if(err){
                cb(err);
            }else{
                if(result==""||result==null){
                    cb(null,result);
                }else{
                    var index=1;
                    if(result==null||result==""){
                        cb(null,"1");
                    }else{
                    result.forEach(function(elem){
                        id.push(elem.teacher_classnotice_id);
                        if(result.length==index){
                            classes_m_sql.get_draftactivity_byid(id,function(err,result_last){
                                if(err){
                                    cb(err);
                                }else{
                                    cb(null,result_last);
                                }
                            });
                        }
                        index++;
                    });
                }
              }
            }
        });
    }
}
//添加作业
module.exports.teacher_addhomework = function(data,cb) {
   var all_push=[];
   var index=1;
   var comment_id="";
    classes_m_sql.insert_homework(data,function(err,result){//查询这个家长下的学生名字
            if(err){
                cb(err);
            }else{
             if(data.homework.state==1){//立即发布
               homework_id=result.insertId;
               data.parent.forEach(function(element) {//根据
                    var parent_phone=element;
                    var student_info={student_name:"",new_id:"",homework_id:homework_id,parent_phone:parent_phone};
                    classes_m_sql.get_studentname_byparentphone(parent_phone,function(err,result){//查询这个家长下的学生名字
                        if(err){
                            cb(err);
                        }else{
                            result.map(function(element){
                                student_info.student_name=element.student_name;
                            });
                            classes_m_sql.insert_homework_notice(data,homework_id,parent_phone,function(err,result_homework){
                                if(err){
                                    cb(err);
                                }else{
                                    student_info.new_id=result_homework.insertId;
                                    all_push.push(student_info);
                                    console.log(JSON.stringify(all_push));
                                    if(data.parent.length==index){
                                        cb(null,all_push);
                                    }
                                    index++;
                                }
                            });
                        }
                    }); 
                })
            }else{
                cb(null,result);
            }
        }
    })
}

//获取家庭作业
module.exports.get_drafthomeork= function(userid,corpid,type,cb){
    var  id=[]
    if(type<=2){
        classes_m_sql.get_drafthomework(userid,corpid,type,function(err,result){
            if(err){
                cb(err);
            }else{
                cb(null,result)
            }
        });
    }else{
        classes_m_sql.get_homework(userid,corpid,type,function(err,result){
            if(err){
                cb(err);
            }else{
                if(result==""||result==null){
                    cb(null,result);
                }else{
                    var index=1;
                    if(result==null||result==""){
                        cb(null,"1");
                    }else{
                    result.forEach(function(elem){
                        id.push(elem.teacher_homework_id);
                        if(result.length==index){
                            classes_m_sql.get_drafthomework_byid(id,function(err,result_last){
                                if(err){
                                    cb(err);
                                }else{
                                    cb(null,result_last);
                                }
                            });
                        }
                        index++;
                    }); }
              }
            }
        });
    }
}
//页面加载
module.exports.teacher_addquestionnair = function(data,cb) {
   var all_push=[];
   var index=1;
   var index_last=1;
   var questionnair_id="";
    classes_m_sql.insert_questionnair(data,function(err,result){//查询这个家长下的学生名字
            if(err){
                cb(err);
            }else{
            questionnair_id=result.insertId;
            if(data.question.length>0){
                data.question.forEach(function(element){
                    console.log(JSON.stringify(element));
                    classes_m_sql.insert_questionnair_subject(element,questionnair_id,function(err,result){
                        if(err){
                            cb(err);
                        }else{
                            if(index==data.question.length){
                              if(data.info.status==1){//立即发布
                                data.parent.forEach(function(element) {//根据
                                        var parent_phone=element;
                                        var student_info={student_name:"",new_id:"",questionnair_id:questionnair_id,parent_phone:parent_phone};
                                        classes_m_sql.get_studentname_byparentphone(parent_phone,function(err,result){//查询这个家长下的学生名字
                                            if(err){
                                                cb(err);
                                            }else{
                                                result.map(function(element){
                                                    student_info.student_name=element.student_name;
                                                });
                                                classes_m_sql.insert_questionnair_notice(data,questionnair_id,parent_phone,function(err,result_notice){
                                                    if(err){
                                                        cb(err);
                                                    }else{
                                                        student_info.new_id=result_notice.insertId;
                                                        all_push.push(student_info);
                                                        console.log(JSON.stringify(all_push));
                                                        if(data.parent.length==index_last){
                                                            cb(null,all_push);
                                                        }
                                                        index_last++;
                                                    }
                                                });
                                            }
                                        }); 
                                    })
                                }
                                else{
                                    cb(null,"");
                                }
                            }
                             index++;
                        }
                    });
                })
            }else{
                 if(data.info.status==1){//立即发布
                                data.parent.forEach(function(element) {//根据
                                        var parent_phone=element;
                                        var student_info={student_name:"",new_id:"",questionnair_id:questionnair_id,parent_phone:parent_phone};
                                        classes_m_sql.get_studentname_byparentphone(parent_phone,function(err,result){//查询这个家长下的学生名字
                                            if(err){
                                                cb(err);
                                            }else{
                                                result.map(function(element){
                                                    student_info.student_name=element.student_name;
                                                });
                                                classes_m_sql.insert_questionnair_notice(data,questionnair_id,parent_phone,function(err,result_notice){
                                                    if(err){
                                                        cb(err);
                                                    }else{
                                                        student_info.new_id=result_notice.insertId;
                                                        all_push.push(student_info);
                                                        console.log(JSON.stringify(all_push));
                                                        if(data.parent.length==index_last){
                                                            cb(null,all_push);
                                                        }
                                                        index_last++;
                                                    }
                                                });
                                            }
                                        }); 
                                    })
                                }
                                else{
                                    cb(null,"");
                                }
            }
         }
    })
}
//数组去重复
function distinct(arr1,arr2){
  var _arr = [];//copy一个数组=head
    // for (var i = 0; i < arr1.length; i++) {
    //     _arr.push(arr1[i]);
    // }
    console.log("copy::"+JSON.stringify(_arr));
    var _dup;
    for (var i = 0; i < arr2.length; i++){
        _dup = false;
        for (var _i = 0; _i < arr1.length; _i++){
            if ((arr2[i].type_grade === arr1[_i].type_grade)&&(arr2[i].class === arr1[_i].class)){

                // _dup = true;
                 break;
            }else{
                _arr.push(arr2[i]);
            }
        }
        // if (!_dup){
        //     _arr.push(arr2[i]);
        // }
    }
    return _arr;
}

//查看评论  日常表现
exports.findParentRate = function(corpId, userid,comment_id,new_id){
    return new Promise(function(resolve, reject){
        classes_m_sql.findParentRate(comment_id,function(err,result){
             if(err){
                return reject(err);
            }else{
                var data={state:""}
              if(result==""||result==null){
                return resolve(result);
              }else{
                  result.map(function(elem){
                      data.state=elem.delete_status;
                  })
                return resolve(data);
              }
            }
        });
    });
};
//年级转换
function class_change(type_grade){
         var class_name="";
        if(type_grade==0){
            class_name="一年级" 
        }else if(type_grade==1){
            class_name="二年级" 
        }else if(type_grade==2){
            class_name="三年级" 
        }else if(type_grade==3){
            class_name="四年级" 
        }else if(type_grade==4){
            class_name="五年级" 
        }else if(type_grade==5){
            class_name="六年级" 
        }else if(type_grade==6){
            class_name="七年级" 
        }else if(type_grade==7){
            class_name="八年级" 
        }else if(type_grade==8){
            class_name="九年级" 
        }else if(type_grade==9){
            class_name="高一" 
        }else if(type_grade==10){
            class_name="高二" 
        }else if(type_grade==11){
            class_name="高三" 
        }else{
            class_name="大学" 
        }
        return class_name;
}

 