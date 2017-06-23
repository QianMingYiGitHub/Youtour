var Promise = require('promise');
var classes_m_sql = require('./classes_m_sql');
/**
 * 表结构  
 */
//页面加载班级
module.exports.queryClass = function(type_grade,cb) {
     classes_m_sql.queryClass(type_grade,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//页面加载班级
module.exports.queryClass_One = function(school_id,cb) {
    var all_array=[]
     var index=1;
     var all_count=0;
      classes_m_sql.queryClass(school_id,function(err,result_count){
          if(err){
              cb(err);
          }else{
               console.log("长度："+result_count.length);
              if(result_count!=""||result_count!=null){
                  var new_array_list=[];
                  result_count.forEach(function(element_count){
                      var new_array={count:"",type_grade:""}
                      new_array.count=element_count.count;//年级下的班级个数
                      new_array.type_grade=element_count.type_grade;
                      all_count+=element_count.count;
                      new_array_list.push(new_array);
                      
                  });
                  console.log("数组：："+JSON.stringify(new_array_list));
                 new_array_list.forEach(function(element_type){
                    
                    var index_array=1;//位置的重要性
                    classes_m_sql.queryClass_all(element_type.type_grade,school_id,function(err, result) {//回函数
                                if(err){
                                    cb(err);
                                }else{
                                    var class_one=[];
                                    result.forEach(function(element){
                                        var type_name_all="";
                                        if(element.type_grade==0){
                                            type_name_all="一年级"
                                        }else if(element.type_grade==1){  
                                            type_name_all="二年级"
                                        }else if(element.type_grade==2){  
                                            type_name_all="三年级"
                                        }else if(element.type_grade==3){  
                                            type_name_all="四年级"
                                        }else if(element.type_grade==4){  
                                            type_name_all="五年级"
                                        }else if(element.type_grade==5){  
                                            type_name_all="六年级"
                                        }else if(element.type_grade==6){  
                                            type_name_all="七年级"
                                        }else if(element.type_grade==7){  
                                            type_name_all="八年级"
                                        }else if(element.type_grade==8){  
                                            type_name_all="九年级"
                                        }else if(element.type_grade==9){  
                                            type_name_all="高一"
                                        }else if(element.type_grade==10){  
                                            type_name_all="高二"
                                        }else if(element.type_grade==11){  
                                            type_name_all="高三"
                                        }else{
                                            type_name_all="补充"
                                        }
                                        var list={class_name:"",sign:"A",sort:"",class_one:class_one};
                                        var list_one={id:"",class_name:"",sign:"AA"};
                                            list.class_name=type_name_all;
                                            list.sort=element.type_grade;
                                            list_one.id=element.id;
                                            list_one.class_name=type_name_all+element.class;//排序
                                            class_one.push(list_one);
                                            if(index_array==element_type.count){//一个年级下的多个班级
                                                //此时的3怎么查询出来
                                                all_array.push(list);
                                              
                                                 console.log("index::"+index);
                                                 console.log(all_count);
                                                if(index==all_count){
                                                    console.log("final："+JSON.stringify(all_array));
                                                    cb(null, all_array.sort(Sort('sort')));  
                                                }
                                                // console.log("一年级666:"+JSON.stringify(all_array));  
                                            }
                                             index_array++;
                                             index++;
                                    })
                                  
                                }
                            });//返回值没有设置 正常连接
                    })

              }else{
                   cb(null,"1");
              }
          }
      })
   
   
}
//添加班级
module.exports.addClass = function(type_grade,classes,school_id,cb) {
    var index_c="";
     //添加班级的时候先查询是否存在
     if(classes=="一班"){
         index_c=0;
     }else if(classes=="二班"){
         index_c=1;
     }else if(classes=="三班"){
         index_c=2;
     }else if(classes=="四班"){
         index_c=3;
     }else if(classes=="五班"){
         index_c=4;
     }else if(classes=="六班"){
         index_c=5;
     }else if(classes=="七班"){
         index_c=6;
     }else if(classes=="八班"){
         index_c=7;
     }else if(classes=="九班"){
         index_c=8;
     }else if(classes=="十班"){
         index_c=9;
     }else if(classes=="十一班"){
         index_c=10;
     }else if(classes=="十二班"){
         index_c=11;
     }else if(classes=="十三班"){
         index_c=12;
     }else if(classes=="十四班"){
         index_c=13;
     }else if(classes=="十五班"){
         index_c=14;
     }else if(classes=="十六班"){
         index_c=15;
     }else if(classes=="十七班"){
         index_c=16;
     }else if(classes=="十八班"){
         index_c=17;
     }else if(classes=="十九班"){
         index_c=18;
     }
     classes_m_sql.query_Class(type_grade,classes,school_id,function(err,result){
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){//此学校的这个年级的这个班级不存在
                  classes_m_sql.addClass(type_grade,classes,school_id,index_c,function(err, result) {
                    if(err){
                        cb(err);
                    }else{
                        cb(null, result);
                    }
                });//返回值没有设置 正常连接   
             }else{
                 cb(null,"existed");
             }
         }
     });
    
   
}
//删除班级
module.exports.deleteClass = function(id,school_id,cb) {
    var headmaster_id="";
    classes_m_sql.get_grade_type(id,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                 classes_m_sql.deleteClass(id,function(err, result) {//回函数+删除班级
                if(err){
                    cb(err);
                }else{
                    cb(null,result);
                    }
                });//返回值没有设置 正常连接
            }else{
           result.map(function(element){
              headmaster_id=element.type_grade+","+element.class;//0,一班
            })
            classes_m_sql.deleteClass(id,function(err, result) {//回函数+删除班级
                if(err){
                    cb(err);
                }else{
                    //清空班主任
                    classes_m_sql.update_headmaster_one(school_id,headmaster_id,function(err,result_last){
                        if(err){
                            cb(err);
                        }else{
                            cb(null,result_last);
                        }
                    });
                }
            });//返回值没有设置 正常连接
         }
        }
    });   
}
//删除年级
module.exports.delete_Grade = function(type_grade,school_id,cb) {
    var index=1;
    var headmaster_id=[];
    var id=[];
     classes_m_sql.get_grade(type_grade,school_id,function(err,result_one){//根据学校id和type查询出所有班级的字符串
         if(err){
             cb(err);
         }else{
              result_one.forEach(function(element){
                         headmaster_id.push(element.type_grade+","+element.class);//0,一班
                 })
                 console.log("121212:"+JSON.stringify(headmaster_id));
                 headmaster_id.forEach(function(elem_type){//根据字符串查询出班班主任id
                     console.log(elem_type);
                       classes_m_sql.query_headmaster_m(school_id,elem_type,function(err,result){
                           if(err){
                               cb(err);
                           }else{
                               if(result==""||result==null){
                                   console.log("这个班级没有班主任："+elem_type);
                               }else{
                                result.map(function(element){
                                    id.push(element.id);
                                });
                               }
                               if(index==headmaster_id.length){
                                   if(id.length!=0){
                                   classes_m_sql.update_headmaster_two(school_id,id,function(err,result){
                                       if(err){
                                           cb(err);
                                       }else{
                                           classes_m_sql.delete_class_type(school_id,type_grade,function(err,result){
                                               if(err){
                                                   cb(err);
                                               }else{
                                                   cb(null,result);
                                               }
                                           });
                                       }
                                   });
                               }else{//没有班主任
                                    classes_m_sql.delete_class_type(school_id,type_grade,function(err,result){
                                        if(err){
                                            cb(err);
                                        }else{
                                            cb(null,result);
                                        }
                                    });
                               }
                             }
                               index++;
                           }
                       });
                 });  
         }
     });
}
//添加学生
module.exports.addStudent = function(id,data,cb) {

     classes_m_sql.addStudent(id,data,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//添加学生+check
module.exports.addStudent_check = function(check_phone,school_id,cb) {

     classes_m_sql.addStudent_check(check_phone,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){
                  cb(null, result);
             }else{
                 result.map(function(element){
                     class_id=element.class_id;
                 })
                 classes_m_sql.get_class_deletestatus(class_id,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                         if(result==""||result==null){
                             cb(null,result);
                         }else{
                             cb(null,"1");
                         }
                     }
                 })
             }
            
         }
     });//返回值没有设置 正常连接   
   
}
//修改学生
module.exports.modifyStudent = function(id,data,cb) {

     classes_m_sql.modifyStudent(id,data,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//删除学生
module.exports.deleteStudent = function(id,cb) {

     classes_m_sql.deleteStudent(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//根据id获取parent
module.exports.get_parent_phone = function(id,cb) {
     classes_m_sql.get_parent_phonebyid(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//学生转班
module.exports.modify_Class = function(id,class_id,cb) {

     classes_m_sql.modify_Class(id,class_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//查询班级学生
module.exports.queryStudent = function(class_id,cb) {

     classes_m_sql.queryStudent(class_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//全体学生升级
module.exports.all_Upgrade = function(school_id,type_grade_max,cb) {
    var index=1;
    var class_headermaster_id=[];
    var headmaster=[];
    var index=1;
    var index_one=1;
     classes_m_sql.all_Upgrade(school_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             classes_m_sql.get_headmaster_Up(school_id,function(err,result){
                 if(err){
                     cb(err);
                 }else{
                     if(result==""||result==null){//没有要老师
                         classes_m_sql.delete_Upgrade(school_id,type_grade_max,function(err,result_last){//删除班级
                            if(err){
                                cb(err);
                            }else{
                                cb(null, result_last);
                            }
                        }) 
                     }else{
                     console.log(JSON.stringify(result));
                     result.forEach(function(element){
                         var head_master={id:"",headmaster_class_id_new:"",headmaster_class_id:""};
                         head_master.id=element.id;
                         head_master.headmaster_class_id=((parseInt(element.headmaster_class_id.split(",")[0])))+","+element.headmaster_class_id.split(",")[1];
                         head_master.headmaster_class_id_new=(((parseInt(element.headmaster_class_id.split(",")[0]))+1))+","+element.headmaster_class_id.split(",")[1];
                         headmaster.push(head_master);
                         if(index==result.length){
                             headmaster.forEach(function(element){//headmaster_class_id type_grade+1 后
                                 if((((parseInt(element.headmaster_class_id_new.split(",")[0]))))==type_grade_max){//升级后的值等于最大值
                                    console.log("删除："+element.headmaster_class_id_new.split(",")[0]);
                                     classes_m_sql.update_Upgrade(school_id,element.headmaster_class_id,function(err,result){
                                         if(err){
                                             cb(err);
                                         }else{
                                            if(index_one==headmaster.length){
                                                console.log("最大值："+type_grade_max);
                                                classes_m_sql.delete_Upgrade(school_id,type_grade_max,function(err,result_last){//删除班级
                                                    if(err){
                                                        cb(err);
                                                    }else{
                                                        cb(null, result_last);
                                                    }
                                                }) 
                                            }
                                         index_one++;
                                         }
                                     });
                                 }else{
                                 classes_m_sql.update_headmaster(school_id,element.id,element.headmaster_class_id_new,function(err,result){
                                     if(err){
                                         cb(err);
                                     }else{ 
                                         if(index_one==headmaster.length){
                                              console.log("最大值："+type_grade_max);
                                            classes_m_sql.delete_Upgrade(school_id,type_grade_max,function(err,result_last){//删除班级
                                                if(err){
                                                    cb(err);
                                                }else{//在添加一个一年级的班级+查询本学校+刚升级 的一年级所有的班级count（*）
                                                    cb(null, result_last);
                                                }
                                            }) 
                                         }
                                         index_one++;
                                     }
                                  });
                               }
                             })
                         }
                         index++;
                     });
                    // classes_m_sql.update_headmaster();
                      console.log(headmaster);
                 }
                }
             });
         }
     });//返回值没有设置 正常连接   
   
}
module.exports.update_headteacher = function(school_id,type_grade_max,cb) {
    var headmaster_array_one=[];
    classes_m_sql.get_teacheringclass_notnull(school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,"1");
            }else{
                var index=1;
                var index_all=1;
                console.log("符合的数据：："+JSON.stringify(result)+result.length);
                result.forEach(function(element){//在这里直接删除
                   var head_master={id:"",teacheringclass_list_new:""};
                   var teacheringclass_array=element.teacheringclass_list.split("||");
                   head_master.id=element.id;
                   console.log("开始：：："+JSON.stringify(teacheringclass_array));
                   var teacheringclass_array_list="";
                   var index_list=1;
                    if(teacheringclass_array.length>0){//有任课的班级
                        teacheringclass_array.forEach(function(elem){
                            var one=((parseInt(elem.split(",")[0])))+","+elem.split(",")[1];//升级前的
                            var two=((parseInt(elem.split(",")[0]))+1)+","+elem.split(",")[1];//升级后的
                            var hhhh=(parseInt(elem.split(",")[0]));
                            console.log(hhhh)
                            if(index_list=="1"){
                                 if(type_grade_max==(parseInt(elem.split(",")[0]))+1){//最大的还没有升级的年级
                                     teacheringclass_array_list="||";
                               }else{
                                    teacheringclass_array_list=two;
                               }
                            }else {
                                if(type_grade_max==(parseInt(elem.split(",")[0]))+1){//最大的还没有升级的年级
                                     teacheringclass_array_list=teacheringclass_array_list+"";
                               }else{
                                   teacheringclass_array_list=teacheringclass_array_list+"||"+two;
                               }
                            }
                            if(index_list==teacheringclass_array.length){
                                head_master.teacheringclass_list_new=teacheringclass_array_list;
                                headmaster_array_one.push(head_master);
                                index_list=1;
                                teacheringclass_array_list="";
                                  if(result.length==index){
                                      console.log(type_grade_max);
                                      console.log("任课教师升级-------------last：：：："+JSON.stringify(headmaster_array_one));
                                  }
                                  index++;
                            }
                            index_list++;
                        })
                    }else{
                        head_master.teacheringclass_list_new="||";
                    }
                })
               headmaster_array_one.forEach(function(up){
                  classes_m_sql.update_Upgrade_one(up.id,up.teacheringclass_list_new,school_id,function(err,result){
                      if(err){
                          cb(err);
                      }else{
                          if(index_all==headmaster_array_one.length){
                              cb(null,result);
                          }
                          index_all++;
                      }
                  })
              })
            }
        }
    })
}
 function Sort(data){
    return function(a,b){
        var value1 = a[data];
        var value2 = b[data];
        return value1 - value2;
    }
}
//条件查询班级下的学生
module.exports.query_Student = function(id,data,cb) {
     classes_m_sql.query_Student(id,data,function(err, result) {
         if(err){
             cb(err);
         }else{
             //更新用户phone
             cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//删除年级
module.exports.deleteClassAll = function(type_grade,school_id,cb) {
     classes_m_sql.deleteClassAll(type_grade,school_id,function(err, result) {
         if(err){
             cb(err);
         }else{
             //更新用户phone
             cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//查询班级下的年级
module.exports.queryType_Class = function(type_grade,school_id,cb) {
     classes_m_sql.queryType_Class(type_grade,school_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
}
//查询是否绑定家长手机号
module.exports.binding_Phone = function(openid,cb) {
    var parent_phone="";
    var student_phone="";
    var index=1;
    var long_lat_range=[];
    var student_id="";
    var school_id="";
     classes_m_sql.binding_Phone_getphone(openid,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){//未绑定+渲染界面+绑定号码
                 cb(null,"-1");
             }else{//已经绑定手机号+查询改手机号的
                 result.map(function(element){
                     parent_phone=element.parent_phone;
                 });
                 classes_m_sql.query_student_phone(parent_phone,function(err,result){//student_m
                     if(err){
                         cb(err);
                     }else{
                         if(result==""||result==null){
                             cb(null,"0");
                         }else{
                         result.map(function(elem){//如果该家长绑定了多个孩子怎么处理
                             student_phone=elem.student_phone;
                             class_id=elem.class_id;
                         });//查看这个学校是否被删除根据class_id
                         classes_m_sql.get_delete_status_class(class_id,function(err,result){//class_m
                             if(err){
                                 cb(err);
                             }else{
                                 if(result==""||result==null){
                                     cb(null,"1");//说明已经删除该班级
                                 }else{
                                     result.map(function(elem){
                                         school_id=elem.school_id;
                                     })
                                     classes_m_sql.get_delete_status_school(school_id,function(err,result){
                                         if(err){
                                             cb(err);
                                         }else{
                                             if(result==""||result==null){
                                                 cb(null,"2");
                                             }else{
                                                 //服务正常
                                                  classes_m_sql.insert_request(parent_phone,school_id,function(err,result){//插入家人的请求时间
                                                      if(err){
                                                          cb(err);
                                                      }else{
                                                            var date=time_date();//当前系统时间
                                                            console.log("延迟三小时："+date);
                                                            classes_m_sql.getstudent_long_latitude(student_phone,date,function(err,result_long_latitude){//根据学生phone查询今天？学生的经纬度信息
                                                                if(err){
                                                                    cb(err);
                                                                }else{
                                                                    if(result_long_latitude==null||result_long_latitude==""){
                                                                        cb(null,"3");//此情况一班不存在
                                                                    }else{
                                                                        result_long_latitude.forEach(function(long_latitude){
                                                                            var long_latitude_range={longitude:"",latitude:"",time:""}
                                                                            long_latitude_range.longitude=long_latitude.longitude;
                                                                            long_latitude_range.latitude=long_latitude.latitude;
                                                                            long_latitude_range.time=time(long_latitude.createtime);//时间转化一下
                                                                            long_lat_range.push(long_latitude_range);
                                                                            if(index==result_long_latitude.length){
                                                                                cb(null,long_lat_range);//经纬度范围
                                                                            }
                                                                            index++;
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                      }
                                                  });
                                             }
                                         }
                                     });
                                 }
                             }
                         });
                     }
                    }
                 });
             }
         }
     });//返回值没有设置 正常连接   
}
//查询时间测试
function time_date(){
    var oDate = new Date(); //实例一个时间对象；
    var year= oDate.getFullYear();   //获取系统的年；
    var month= oDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
    var day=oDate.getDate(); // 获取系统日，
    var hour= (oDate.getHours()-3); //获取系统时,两个小时之内的学生经纬度
    var min= (oDate.getMinutes()); //分
    var sec=oDate.getSeconds(); //秒
    if(month<10){
        month="0"+(oDate.getMonth()+1); 
    }
    if(day<10){
        day="0"+oDate.getDate();
    }
    if(hour<10){
        hour="0"+oDate.getHours();
    }
    if(min<10){ 
        min="0"+(oDate.getMinutes());
    }
    if(sec<10){ 
        sec="0"+oDate.getSeconds();  
    }
    var three_min=year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec
        return three_min
}
function time(oDate){ //实例一个时间对象；
    var year= oDate.getFullYear();   //获取系统的年；
    var month= oDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
    var day=oDate.getDate(); // 获取系统日，
    var hour= (oDate.getHours()); //获取系统时，
    var min= (oDate.getMinutes()); //分
    var sec=oDate.getSeconds(); //秒
    if(month<10){
        month="0"+(oDate.getMonth()+1); 
    }
    if(day<10){
        day="0"+oDate.getDate();
    }
    if(hour<10){
        hour="0"+oDate.getHours();
    }
    if(min<10){ 
        min="0"+(oDate.getMinutes());
    }
    if(sec<10){ 
        sec="0"+oDate.getSeconds();  
    }
    var three_min=year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec
        return three_min
}
//学生校验
module.exports.check_student = function(student_phone,cb) {
    var class_id,school_id;
     classes_m_sql.get_student_exsit(student_phone,function(err,result){
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){
                 cb(null,"1");//您要绑定的学生不存在
             }else{
                result.map(function(element){
                 class_id=element.class_id;
                })
                 classes_m_sql.get_delete_status_class(class_id,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                         if(result==""||result==null){
                             cb(null,"2");//该学生所在的班级已经删除
                         }else{
                               result.map(function(elem){
                                         school_id=elem.school_id;
                                 })
                               classes_m_sql.get_delete_status_school(school_id,function(err,result){
                                   if(err){
                                       cb(err);
                                   }else{
                                       if(result==""||result==null){
                                           cb(null,"3");//该学生所在的学校已经停止服务
                                       }else{
                                            classes_m_sql.get_binding_yes(student_phone,function(err,result){//该学生是已经绑定过+现在设计成只能绑定一个
                                                if(err){
                                                    cb(err);
                                                }else{
                                                    if(result==""||result==null){
                                                         cb(null,result);
                                                    }else{
                                                         cb(null,"4")
                                                    }
                                                }
                                            });
                                       }
                                   }
                               });
                         }
                     }
                 });
             }
         }
     }); 
}
//绑定家长手机号
module.exports.binding_parent_phone = function(parent_phone,student_phone,openid,cb) {//先确定该学生所在的班级 学校是否有效+校验+是否绑定了手机号、、此时是没有绑定的情况下
     var binding_parent_phone;
     classes_m_sql.get_parent_phone(student_phone,function(err,result){//根据输入学生的手机号查询老师绑定的家长手机号
         if(err){
             cb(err);
         }else{
              result.map(function(element){
                  binding_parent_phone=element.parent_phone;
              });
              if(binding_parent_phone==""||binding_parent_phone==null){
                  cb(null,"1");//
              }else if(binding_parent_phone==parent_phone){
                  classes_m_sql.binding_parent_phone(parent_phone,student_phone,openid,function(err,result_last){
                      if(err){
                          cb(err);
                      }else{
                          cb(null,result_last);//绑定成功
                      }
                  });
              }else{//绑定的手机号与在微信输入的不一致
                  cb(null,"2");
              }
         }
     });   
}
//查询学校最大type值
module.exports.get_school_maxgrade = function(school_id,cb) {

     classes_m_sql.get_school_maxgrade(school_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
}
//查询该学校原来一年级的班级个数
module.exports.get_type_count = function(school_id,cb) {
     classes_m_sql.get_type_count(school_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
}
//班级
module.exports.get_Class_Puch = function(school_id,class_id,cb) {
    var all_puch=[];
     classes_m_sql.get_class_puch(school_id,class_id,function(err, result) {//现在是查询全部
         if(err){
             cb(err);
         }else{
             if(result==null||result==""){
                 cb(null,"1");
             }else{
             var index=1;
             var all_puch=[];
             var new_key=[];
             var finally_key=[];
             var index_one=1;
             var index_two=1;
             var key_value={};
             console.log("数据长度："+result.length);
             result.forEach(function(element){//去重复+减少对数据库的查询次数
                 new_key.push(element.class_id);
                 if(index_one==result.length){
                     finally_key=deleteRepetion(new_key.toString());
                 }
                 index_one++;
             })
             console.log("finally:"+JSON.stringify(finally_key));
             finally_key.forEach(function(class_id){
                   classes_m_sql.get_classname(class_id,function(err,result_class){
                            if(err){
                                cb(err);
                            }else{
                                if(result_class==""||result_class==null){//当前的班级被删除了
                                      key_value[class_id]="-1"
                                       if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                       });
                                    }
                                   index++;
                                }else{
                                    result_class.map(function(elem){//不存在空
                                        key_value[class_id]=class_change(elem.type_grade)+elem.class;//写一个function
                                    });
                                    if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                     });
                                    }
                                index++;
                              }
                            }
                     });
                });
             }
        }
     });//返回值没有设置 正常连接   
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
}
function formatDate_one (date) {  
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? '0' + m : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d ;
}
function formatDate_two (date) {  
            var h=date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var mi=date.getMinutes();
            mi = mi < 10 ? ('0' + mi) : mi;
            var s=date.getSeconds();
            s = s < 10 ? ('0' + s) : s;
            return  h + ':' + mi + ':' + s;  
}
//条件查询+学校
module.exports.query_School_Student = function(data,cb) {
    var school_id=data.school_id;
         //第一步做条件查询
         classes_m_sql.query_school_student(school_id,data,function(err, result) {//现在是查询全部
         if(err){
             cb(err);
         }else{
             //根据学校id查询出所有班级id 学生phone
             if(result==""||result==null){
                 cb(null,"1");
             }else{
             var index=1;
             var all_puch=[];
             var new_key=[];
             var finally_key=[];
             var index_one=1;
             var index_two=1;
             var key_value={};
             console.log("数据长度："+result.length);
             result.forEach(function(element){//去重复+减少对数据库的查询次数
                 new_key.push(element.class_id);
                 if(index_one==result.length){
                     finally_key=deleteRepetion(new_key.toString());
                 }
                 index_one++;
             })
             console.log("finally:"+JSON.stringify(finally_key));
             finally_key.forEach(function(class_id){
                   classes_m_sql.get_classname(class_id,function(err,result_class){
                            if(err){
                                cb(err);
                            }else{
                                if(result_class==""||result_class==null){//当前的班级被删除了
                                      key_value[class_id]="-1"
                                       if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                       });
                                    }
                                   index++;
                                }else{
                                    result_class.map(function(elem){//不存在空
                                        key_value[class_id]=class_change(elem.type_grade)+elem.class;//写一个function
                                    });
                                    if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                     });
                                    }
                                index++;
                              }
                            }
                     });
                });
             }
         }
     });//返回值没有设置 正常连接   
}
//条件查询+班级
module.exports.query_Class_Student = function(data,cb) {
    var school_id=data.school_id;
    var student_name_query=data.student_name_query;//学生名字
    console.log(student_name_query);
         //第一步做条件查询
         classes_m_sql.get_query_class_puch(school_id,data,function(err, result) {//现在是查询全部
         if(err){
             cb(err);
         }else{
             //根据学校id查询出所有班级id 学生phone
             if(result==""||result==null){
                 cb(null,"1");
             }else{
             var index=1;
             var all_puch=[];
             var new_key=[];
             var finally_key=[];
             var index_one=1;
             var index_two=1;
             var key_value={};
             console.log("数据长度："+result.length);
             result.forEach(function(element){//去重复+减少对数据库的查询次数
                 new_key.push(element.class_id);
                 if(index_one==result.length){
                     finally_key=deleteRepetion(new_key.toString());
                 }
                 index_one++;
             })
             console.log("finally:"+JSON.stringify(finally_key));
             finally_key.forEach(function(class_id){
                   classes_m_sql.get_classname(class_id,function(err,result_class){
                            if(err){
                                cb(err);
                            }else{
                                if(result_class==""||result_class==null){//当前的班级被删除了
                                      key_value[class_id]="-1"
                                       if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                       });
                                    }
                                   index++;
                                }else{
                                    result_class.map(function(elem){//不存在空
                                        key_value[class_id]=class_change(elem.type_grade)+elem.class;//写一个function
                                    });
                                    if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                     });
                                    }
                                index++;
                              }
                            }
                     });
                });
             }
         }
     });//返回值没有设置 正常连接   
}
//页面加载班级
module.exports.getTeacherAllInfoByUserId = function(corp_id,teacher_phone,cb) {
     classes_m_sql.query_teacher(teacher_phone,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//学校考勤+修改
module.exports.get_school_puch_modify = function(school_id,cb) {
     classes_m_sql.get_school_puch(school_id,function(err, result) {//现在是查询全部
         if(err){
             cb(err);
         }else{
             //根据学校id查询出所有班级id 学生phone
             if(result==""||result==null){
                 cb(null,"1");
             }else{
             var index=1;
             var all_puch=[];
             var new_key=[];
             var finally_key=[];
             var index_one=1;
             var index_two=1;
             var key_value={};
             console.log("数据长度："+result.length);
             result.forEach(function(element){//去重复+减少对数据库的查询次数
                 new_key.push(element.class_id);
                 if(index_one==result.length){
                     finally_key=deleteRepetion(new_key.toString());
                 }
                 index_one++;
             })
             console.log("finally:"+JSON.stringify(finally_key));
             finally_key.forEach(function(class_id){
                   classes_m_sql.get_classname(class_id,function(err,result_class){
                            if(err){
                                cb(err);
                            }else{
                                if(result_class==""||result_class==null){//当前的班级被删除了
                                      key_value[class_id]="-1"
                                       if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                       });
                                    }
                                   index++;
                                }else{
                                    result_class.map(function(elem){//不存在空
                                        key_value[class_id]=class_change(elem.type_grade)+elem.class;//写一个function
                                    });
                                    if(index==finally_key.length){//当数据很多的时候会报错原因
                                        console.log("66::"+JSON.stringify(key_value))
                                        result.forEach(function(finally_a){
                                        var student_puch={sort:"",student_name:"",student_phone:"",class_name:"",puch_time:""}
                                        if(finally_a.in_out=="0"){
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;进校"
                                        }else{
                                            student_puch.puch_time=formatDate(finally_a.puch_time)+"&nbsp;&nbsp;&nbsp;&nbsp;出校"
                                        }
                                        console.log("ppppp:"+key_value[finally_a.class_id])
                                        if(key_value[finally_a.class_id]=="-1"){
                                            if(index_two==result.length){
                                                cb(null,all_puch.sort(Sort_Two('sort')));
                                            }
                                            index_two++
                                        }else{
                                        student_puch.sort=finally_a.id;
                                        student_puch.student_phone=finally_a.student_phone;
                                        student_puch.student_name=finally_a.student_name;
                                        student_puch.class_name=key_value[finally_a.class_id]
                                        all_puch.push(student_puch);
                                        if(index_two==result.length){
                                            cb(null,all_puch.sort(Sort_Two('sort')));
                                        }
                                        index_two++;
                                        }
                                     });
                                    }
                                index++;
                              }
                            }
                     });
                });
             }
         }
     });//返回值没有设置 正常连接   
}
//数组去重
function deleteRepetion(arr){//数组去重
      var arrTable = {},arrData = [];
    if(arr.length>=2){
        var arr = arr.split(",")
    for (var i = 0; i < arr.length; i++) {
        if( !arrTable[ arr[i] ]){
            arrTable[ arr[i] ] = true;
            arrData.push(arr[i])
        }
    }
      return arrData;
    }else{
        arrData.push(arr);
         return arrData;
    }
  
}
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
  function Sort_Two(data){
    return function(a,b){
        var value1 = a[data];
        var value2 = b[data];
        return value2 -value1 ;
    }
}
//添加班主任校验
module.exports.check_headmaster_yes = function(school_id,headmaster_m_id,cb) {
    classes_m_sql.get_headmaster_m_id(school_id,headmaster_m_id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
//deleteRepetion(new_key.toString());
function unique(arr1,arr2){
    console.log(arr1.length) ;
    console.log(arr2.length)
    // var arr1 = ["i", "b", "c", "d", "e", "f","x"]; //数组A 
    // var arr2 = ["a", "b", "c", "d", "e", "f", "g"];//数组B 
    var temp = []; //临时数组1 
    var temparray = [];//临时数组2 
    for (var i = 0; i < arr2.length; i++) { 
       temp[arr2[i]] = true;//巧妙地方：把数组B的值当成临时数组1的键并赋值为真 
    }; 
    for (var i = 0; i < arr1.length; i++) { 
     if (!temp[arr1[i]]) { 
    temparray.push(arr1[i]);//巧妙地方：同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组 
      } ; 
    }; 
    return temparray;
    //console.log("去重复：："+JSON.stringify(temparray)+">>>>"+temparray.length);
}
//根据id获取parent
module.exports.check_student_parent_phone = function(student_phone,school_id,query_type,cb) {
    var class_id=[];
    var index=1;
    classes_m_sql.get_class_id(school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            result.map(function(elem){
                class_id.push(elem.id);
                if(index==result.length){
                classes_m_sql.check_student_parent_phone(student_phone,class_id,query_type,function(err, result) {//回函数
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,result);
                        }else{
                            cb(null,result);//存在
                        }
                    }
                });//返回值没有设置 正常连接   
            }
            index++;
            })
        }
    })
}
//家长的手机号不能是学生
module.exports.check_student_phone = function(student_phone,school_id,type,cb) {
    var class_id=[];
    var index=1;
    classes_m_sql.get_class_id(school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            result.map(function(elem){
                class_id.push(elem.id);
                if(index==result.length){
                classes_m_sql.check_student_parent_phone(student_phone,class_id,function(err, result) {//回函数
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"0");
                        }else{
                            cb(null,"1");//存在
                        }
                    }
                });//返回值没有设置 正常连接   
            }
            index++;
            })
        }
    })
}
//根据id获取parent
module.exports.check_student_parent_phone = function(student_phone,school_id,query_type,cb) {
    var class_id=[];
    var index=1;
    classes_m_sql.get_class_id(school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            result.map(function(elem){
                class_id.push(elem.id);
                if(index==result.length){
                classes_m_sql.check_student_parent_phone(student_phone,class_id,query_type,function(err, result) {//回函数
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,result);
                        }else{
                            cb(null,result);//存在
                        }
                    }
                });//返回值没有设置 正常连接   
            }
            index++;
            })
        }
    })
}
//家长的手机号不能是学生
module.exports.get_student_position = function(parent_phone,cb) {
    var student_all=[];//两个孩子的考虑
    var index=1;
    classes_m_sql.get_student_position(parent_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            result.forEach(function(elem){
                 var student_name_phone={student_name:"",student_phone:""}
                 student_name_phone.student_name=elem.student_name;
                 student_name_phone.student_phone=elem.student_phone;
                 student_all.push(student_name_phone);
                 if(index==result.length){
                     var long_lat_itude=[];
                     var index_two=1;
                      student_all.forEach(function(element){
                          classes_m_sql.get_position(element.student_phone,function(err,result){
                              if(err){
                                  cb(err);
                              }else{
                                  var position_long_lat={longitude:"",latitude:"",student_name:element.student_name,time:""}
                                  result.map(function(elem){
                                      position_long_lat.longitude=elem.longitude;
                                      position_long_lat.latitude=elem.latitude;
                                      position_long_lat.time=formatDate(elem.update_time);
                                  })
                                  long_lat_itude.push(position_long_lat);
                                  if(index_two==student_all.length){
                                      cb(null,long_lat_itude);
                                  }
                                  index_two++;
                              }
                          })
                      })
                 }
                 index++;
            })
        }
    })
}
//插入 家长 请求时间
module.exports.insert_parent_request = function(parent_phone,cb) {
    var student_phone="";
    var class_id="";
    var school_id="";
     classes_m_sql.query_student_phone(parent_phone,function(err,result){//student_m
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,"0");//没有进行学生绑定
            }else{
            result.map(function(elem){//如果该家长绑定了多个孩子怎么处理
                student_phone=elem.student_phone;
                class_id=elem.class_id;
            });//查看这个学校是否被删除根据class_id
            classes_m_sql.get_delete_status_class(class_id,function(err,result){//class_m
                if(err){
                    cb(err);
                }else{
                    if(result==""||result==null){
                        cb(null,"1");//说明已经删除该班级 学生所在的班级已经删除
                    }else{
                        result.map(function(elem){
                            school_id=elem.school_id;
                        })
                        classes_m_sql.get_delete_status_school(school_id,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                if(result==""||result==null){//绑定的学校服务停止
                                    cb(null,"2");
                                }else{
                                    //服务正常
                                    classes_m_sql.get_parent_request(parent_phone,school_id,function(err,result){
                                        if(err){
                                            cb(err);
                                        }else{
                                            if(result==""||result==null){
                                                classes_m_sql.insert_request(parent_phone,school_id,function(err,result){//插入家人的请求时间
                                                    if(err){
                                                        cb(err);
                                                    }else{
                                                        cb(null,result);
                                                    }
                                                });
                                            }else{
                                                var id="";
                                                result.map(function(element){
                                                    id=element.id;
                                                });
                                                classes_m_sql.update_request_time(id,function(err,result){
                                                    if(err){
                                                        cb(err);
                                                    }else{
                                                        cb(null,result);
                                                    }
                                                });
                                            }
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
            });
        }
    }
    });
}
//根据家长手机获取今日考勤信息
module.exports.get_Student_Position_Puch = function(parent_phone,cb) {
    var student_phone="";
    var class_id="";
    var school_id="";
    var student_name="";
       classes_m_sql.query_student_phone(parent_phone,function(err,result){
           if(err){
               cb(err);
           }else{
             result.map(function(elem){//如果该家长绑定了多个孩子怎么处理
                student_phone=elem.student_phone;
                class_id=elem.class_id;
                student_name=elem.student_name;
            });//查看这个学校是否被删除根据class_id
            classes_m_sql.get_delete_status_class(class_id,function(err,result){//class_m
                if(err){
                    cb(err);
                }else{
                    if(result==""||result==null){
                        cb(null,"1");//说明已经删除该班级 学生所在的班级已经删除
                    }else{
                        result.map(function(elem){
                            school_id=elem.school_id;
                        })
                        classes_m_sql.get_delete_status_school(school_id,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                if(result==""||result==null){//绑定的学校服务停止
                                    cb(null,"2");
                                }else{
                                    //服务正常
                                    classes_m_sql.getstudent_puch(student_phone,function(err,result){//获取今日打卡信息
                                        if(err){
                                            cb(err);
                                        }else{
                                            if(result==""||result==null){//今日还没有打卡信息
                                                cb(null,"3");
                                            }else{
                                                var date=new Date();
                                                var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
                                                var index_o=1;
                                                var time={date:linux_time,name:student_name,data:[]};
                                                result.forEach(function(element){
                                                    var last_mation={inout_name:"",puch_time_one:"",puch_time_two:"",student_name:""}
                                                    var inout_name="";
                                                    if(element.in_out=="0"){
                                                        last_mation.inout_name="进校"
                                                    }else{
                                                        last_mation.inout_name="离校"
                                                    }
                                                    last_mation.student_name=element.student_name;
                                                    last_mation.puch_time_one=formatDate_one(element.puch_time);
                                                    last_mation.puch_time_two=formatDate_two(element.puch_time);
                                                    time.data.push(last_mation);
                                                    if(index_o==result.length){
                                                        cb(null,time);
                                                  }
                                                    index_o++;
                                                 });
                                                }
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
            });
           }
       });
}
//根据家长手机获取历史考勤信息
module.exports.get_student_position_Allpuch = function(parent_phone,cb) {
       var student_phone="";
       var class_id="";
       var school_id="";
       var student_name="";
       classes_m_sql.query_student_phone(parent_phone,function(err,result){
           if(err){
               cb(err);
           }else{
             result.map(function(elem){//如果该家长绑定了多个孩子怎么处理
                student_phone=elem.student_phone;
                class_id=elem.class_id;
                student_name=elem.student_name;
            });//查看这个学校是否被删除根据class_id
            classes_m_sql.get_delete_status_class(class_id,function(err,result){//class_m
                if(err){
                    cb(err);
                }else{
                    if(result==""||result==null){
                        cb(null,"1");//说明已经删除该班级 学生所在的班级已经删除
                    }else{
                        result.map(function(elem){
                            school_id=elem.school_id;
                        })
                        classes_m_sql.get_delete_status_school(school_id,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                if(result==""||result==null){//绑定的学校服务停止
                                    cb(null,"2");
                                }else{
                                    //服务正常
                                     var time_array=[];
                                     for (var i = 0; i < 7; i++) {
                                        var date=new Date();
                                        var month=(date.getMonth()+1);
                                        var day=(date.getDate()-i);
                                        if(month<10){
                                            month="0"+month;
                                        }
                                        if(day<10){
                                            day="0"+day;
                                        }
                                        var linux_time =date.getFullYear()+"-"+month+"-"+day;
                                        time_array.push(linux_time)
                                     }
                                    console.log(time_array);
                                    var all_day=[];
                                    var index_o=1;
                                    time_array.forEach(function(time_e){ 
                                    var time={date:time_e,name:student_name,data:[]};
                                    classes_m_sql.getstudent_allpuch(student_phone,time_e,function(err,result){//获取今日打卡信息
                                        if(err){
                                            cb(err);
                                        }else{
                                            result.forEach(function(element){
                                                var last_mation={inout_name:"",puch_time_one:"",puch_time_two:"",weekend:"",student_name:""}
                                                var inout_name="";
                                                if(element.in_out=="0"){
                                                    last_mation.inout_name="进校"
                                                }else{
                                                    last_mation.inout_name="离校"
                                                }
                                                last_mation.weekend=element.day_name;
                                                last_mation.student_name=element.student_name;
                                                last_mation.puch_time_one=formatDate_one(element.puch_time);
                                                last_mation.puch_time_two=formatDate_two(element.puch_time);
                                                time.data.push(last_mation);
                                            });
                                            all_day.push(time);
                                            if(index_o==time_array.length){
                                                cb(null,all_day);
                                            }
                                            index_o++;
                                        }
                                      })
                                  })
                                }
                            }
                       });
                    }
                }
            });
           }
       });
}
module.exports.get_week = function(date,cb) {
    return new Promise(function(resolve, reject){
         classes_m_sql.get_delete_status_class(date,function(err,result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
}