var Promise = require('promise');
var user_m_sql = require('./user_m_sql');
var classes_m_sql=require('./classes_m_sql');
/**
 * 表结构  
 */
//更新密码
module.exports.updatePassword = function(phone,password,cb) {
     user_m_sql.updatePassword(phone,password,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//学校管理员修改密码
module.exports.updatePassword_schooladmin = function(phone,password,cb) {
     user_m_sql.updatePassword_schooladmin(phone,password,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             cb(null, result);
         }
     });//返回值没有设置 正常连接   
   
}
//查询用户信息
module.exports.getUser=function(phone,cb){
    var outpassword="";
    var name="";
     user_m_sql.getUser(phone,function(err,result){
        if(err){
            cb(err);
        }
        else{
            if(result==""||result==null){
                cb(null,"1");
            }else{
            var user={};
            result.forEach(function(element){
                 outpassword=element.password;
                 name=element.name;
            });
            user_m_sql.getRole(phone,function(err,roles_result){
                if(err){
                    cb(err);
                }
                else{
                   var  roles=[];
                    for(var i= 0,role;role=roles_result[i++];){//遍历数组
                        roles.push(role.role);
                    };
                     user={phone:phone,name:name,password:outpassword,roles:roles};
                      cb(null,user);
                }  
             })
            }
        }
     })
}
 
module.exports.removeRole = function(phone,role,cb) {

     user_m_sql.removeRole(phone,role,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//获取某个角色下的用户列表
module.exports.getRole = function(phone,cb) {
      
     user_m_sql.getRole(phone,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
            
           cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//获取某个角色下的用户列表
module.exports.getRoles = function(role,cb) {
      
     user_m_sql.getRoles(role,function(err, result) {
         if(err){
             cb(err);
         }else{
             cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//获取某个角色下的用户列表
module.exports.getRoles_query = function(role,name,cb) {
      
     user_m_sql.getRoles_query(role,name,function(err, result) {
         if(err){
             cb(err);
         }else{
             cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//查询部门1
module.exports.queryDepartment1 = function(cb) {
     user_m_sql.queryDepartment(function(err, result_length) {
         if(err){
             cb(err);
         }else{
              var count_all=[];
              var index=0;
             result_length.forEach(function(element){   
                 var count={department_name:"",people_count:""};//每次建立新的对象
                 count.department_name=element.department_name
                 var department_id=element.id
                 user_m_sql.queryDepartment_count(department_id,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                         result.map(function(elem){
                         count.people_count=elem.people_count;
                         index++;
                         })
                         count_all.push(count); 
                        if(index==result_length.length){
                              console.log("部门查询"+JSON.stringify(count_all));
                              cb(null,count_all);//返回的位置
                        }     
                     }
                 })
               
             }) 
                 
         }
     });
  
}
//查询部门
module.exports.queryDepartment = function(school_id,cb) {
     user_m_sql.queryDepartment(school_id,function(err, result) {
         if(err){
             cb(err);
         }else{
             cb(null,result);        
         }
     });
  
}

//addDepartment
module.exports.addDepartment = function(department_name,school_id,cb) {
    user_m_sql.query_Department(department_name,school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                user_m_sql.addDepartment(department_name,school_id,function(err, result) {
                    if(err){
                        cb(err);
                    }else{
                        cb(null,result);
                    }
                });//返回值没有设置 正常连接 
            }else{
                 cb(null,"1");
            }
        }
    });
}
//modifyDepartment
module.exports.modifyDepartment = function(id,department_name,cb) {
      
     user_m_sql.modifyDepartment(id,department_name,function(err, result) {
         if(err){
             cb(err);
         }else{
             cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//deletDepartment 删除所有教师下的该部门
module.exports.deleteDepartment = function(id,department_name,school_id,cb) {
    var all_id=[];
    var data=[];
    var index=1;
    var index_all=1;
     user_m_sql.deleteDepartment(id,function(err, result) {//删除该部门
         if(err){
             cb(err);
         }else{
             user_m_sql.querydeparTeacher(department_name,school_id,function(err,result){
                 if(err){
                     cb(err);
                 }else{
                     if(result==""||result==null){
                          cb(null,result);
                     }else{
                     result.forEach(function(element){
                         var newdepartment_list={department_name:"",id:""};
                          console.log(element.department_list);
                         newdepartment_list.department_name=element.department_list.replace(department_name,"");
                         newdepartment_list.id=element.id;
                         all_id.push(newdepartment_list);
                         if(all_id.length==index){
                             console.log("all_id::"+JSON.stringify(all_id)); 
                         }
                         index++;
                     });
                      all_id.forEach(function(elem){
                             var department_name_last=elem.department_name;
                             var id_last=elem.id;
                             user_m_sql.update_teacher_depar(department_name_last,id_last,school_id,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    if(index_all==all_id.length){
                                          cb(null,result);
                                    }
                                    index_all++;
                                }
                          });
                     })
                  }
                 }
             });
         }
     });//返回值没有设置 正常连接   
  
}
//查询某个部门下的教师
module.exports.queryDepartment_teacher = function(id,cb) {
      //部门id
     user_m_sql.queryDepartment_teacher(id,function(err, result) {
         if(err){
             cb(err);
         }else{
             cb(null,result);
         }
     });//返回值没有设置 正常连接   
}
//查询全体教师
module.exports.queryAllteacher = function(school_id,cb) {
      //部门id 查询老师所
      var return_all=[];
      var index=1;
      var class_name="";
      var type_grade="";
      var class_one="";
      var class_id="";
      var index_array=1;      
     user_m_sql.queryAllteacher(school_id,function(err, result_for) {
         if(err){
             cb(err);
         }else{
             console.log();
             if(result_for!=""){
                    result_for.forEach(function(element){
                        var return_all_one={id:"",teacher_name:"",department_list:"",teacheringclass_list:"",phone:"",headmaster_class_name:"",headmaster_status:"",school_id:"",type_grade:"",class:"",display:"",class_id:""};//新组建一个数组
                        if(element.headmaster_class_id==null||element.headmaster_class_id==""){
                            return_all_one.id=element.id;
                            return_all_one.teacher_name=element.teacher_name;
                            return_all_one.department_list=element.department_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;//任职班级
                            return_all_one.phone=element.phone;
                            return_all_one.headmaster_class_name="未担任班主任";
                            return_all_one.headmaster_status="-1";//未担任班主任
                            return_all_one.display="-1";
                            return_all_one.school_id=element.school_id;
                            return_all.push(return_all_one);
                            if(index==result_for.length){
                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                cb(null,return_all.sort(Sort('id')));
                            }
                             index++;//放的位置
                        }else{
                            //根据headmaster_class_id查询  id;
                            var spilte_head=element.headmaster_class_id;//但是没有查询到该班级
                            var type_grade=spilte_head.split(",")[0];
                            var class_id=spilte_head.split(",")[1];
                            //user_m_sql.query_classname_2(type_grade,class_id,school_id,function(){});
                            user_m_sql.query_classname_2(type_grade,class_id,school_id,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){
                                        //有班级但是还没有录入班级
                                            if(type_grade==0){
                                                class_name="一年级 ";
                                            }else if( type_grade==1){
                                                class_name="二年级 " 
                                            }else if( type_grade==2){
                                                class_name="三年级 " 
                                            }else if( type_grade==3){
                                                class_name="四年级 " 
                                            }else if( type_grade==4){
                                                class_name="五年级 " 
                                            }else if( type_grade==5){
                                                class_name="六年级 " 
                                            }else if( type_grade==6){
                                                class_name="七年级 " 
                                            }else if( type_grade==7){
                                                class_name="八年级 " 
                                            }else if( type_grade==8){
                                                class_name="九年级 " 
                                            }else if(type_grade==9){
                                                class_name="高一 ";
                                            }else if( type_grade==10){
                                                class_name="高二 ";
                                            }else if(type_grade==11){
                                                class_name="高三 ";
                                            }else{
                                                class_name="大学 ";
                                            }
                                            return_all_one.id=element.id;
                                            return_all_one.teacher_name=element.teacher_name;
                                            return_all_one.headmaster_class_name=class_name+class_id;
                                            return_all_one.headmaster_status="1";//未录入
                                            return_all_one.type_grade=type_grade;
                                            return_all_one.class=class_one;
                                            return_all_one.display="0"
                                            return_all_one.class_id=class_id;
                                            return_all_one.department_list=element.department_list;
                                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                                            return_all_one.phone=element.phone;
                                            return_all_one.school_id=element.school_id;
                                            return_all.push(return_all_one);
                                            if(index==result_for.length){
                                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                                cb(null,return_all.sort(Sort('id')));
                                            }
                                            index++;//放的位置
                                    }else{
                                    console.log(JSON.stringify(result));
                                    result.map(function(element2){
                                        if(element2.type_grade==0){
                                            class_name="一年级 "+element2.class;
                                        }else if(element2.type_grade==1){
                                            class_name="二年级 "+element2.class;
                                        }else if(element2.type_grade==2){
                                            class_name="三年级 "+element2.class;
                                        }else if(element2.type_grade==3){
                                            class_name="四年级 "+element2.class;
                                        }else if(element2.type_grade==4){
                                            class_name="五年级 "+element2.class;
                                        }else if(element2.type_grade==5){
                                            class_name="六年级 "+element2.class;
                                        }else if(element2.type_grade==6){
                                            class_name="七年级 "+element2.class;
                                        }else if(element2.type_grade==7){
                                            class_name="八年级 "+element2.class;
                                        }else if(element2.type_grade==8){
                                            class_name="九年级 "+element2.class;
                                        }else if(element2.type_grade==9){
                                            class_name="高一 "+element2.class;
                                        }else if(element2.type_grade==10){
                                            class_name="高二 "+element2.class;
                                        }else if(element2.type_grade==11){
                                            class_name="高三 "+element2.class;
                                        }else{
                                            class_name="大学 "+element2.class;
                                        }
                                         type_grade=element2.type_grade;
                                         class_one=element2.class;
                                         class_id=element2.id;
                                    });
                                    return_all_one.id=element.id;
                                    return_all_one.teacher_name=element.teacher_name;
                                    return_all_one.headmaster_class_name=class_name;
                                    return_all_one.headmaster_status="0";//已经录入
                                    return_all_one.type_grade=type_grade;
                                    return_all_one.class=class_one;
                                    return_all_one.display="0"
                                    return_all_one.class_id=class_id;
                                    return_all_one.department_list=element.department_list;
                                    return_all_one.teacheringclass_list=element.teacheringclass_list;
                                    return_all_one.phone=element.phone;
                                    return_all_one.school_id=element.school_id;
                                    return_all.push(return_all_one);
                                   
                                    if(index==result_for.length){
                                        console.log("返回最终结果2"+JSON.stringify(return_all));
                                        cb(null,return_all.sort(Sort('id')));
                                    }
                                     index++;//放的位置
                                }
                                }
                            });//根据id查询班级
                        }
                        
                    });
             }else{
                 cb(null,"1");
             }

         }
     });//返回值没有设置 正常连接   
}
//查询某个部门下的教师
module.exports.querydeparTeacher = function(department_name,school_id,cb) {
      //部门id 查询老师所
      var return_all=[];
      var index=1;
      var class_name="";
      var type_grade="";
      var class_one="";
      var class_id="";
     user_m_sql.querydeparTeacher(department_name,school_id,function(err, result_for) {
         if(err){
             cb(err);
         }else{   
             if(result_for!=""){
                    result_for.forEach(function(element){
                        var return_all_one={id:"",teacher_name:"",department_list:"",teacheringclass_list:"",phone:"",headmaster_class_name:"",headmaster_status:"",school_id:"",type_grade:"",class:"",display:"",class_id:""};//新组建一个数组
                        if(element.headmaster_class_id==null||element.headmaster_class_id==""){
                            return_all_one.id=element.id;
                            return_all_one.teacher_name=element.teacher_name;
                            return_all_one.department_list=element.department_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;//任职班级
                            return_all_one.phone=element.phone;
                            return_all_one.headmaster_class_name="未担任班主任";
                            return_all_one.headmaster_status="-1";//未担任班主任
                            return_all_one.display="-1";
                            return_all_one.school_id=element.school_id;
                            return_all.push(return_all_one);
                            if(index==result_for.length){
                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                cb(null,return_all.sort(Sort('id')));
                            }
                             index++;//放的位置
                        }else{
                            //根据headmaster_class_id查询  id;
                            var spilte_head=element.headmaster_class_id;//但是没有查询到该班级
                            var type_grade=spilte_head.split(",")[0];
                            var class_id=spilte_head.split(",")[1];
                            //user_m_sql.query_classname_2(type_grade,class_id,school_id,function(){});
                            user_m_sql.query_classname_2(type_grade,class_id,school_id,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){
                                        //有班级但是还没有录入班级
                                            if(type_grade==0){
                                                class_name="一年级";
                                            }else if( type_grade==1){
                                                class_name="二年级" 
                                            }else if( type_grade==2){
                                                class_name="三年级" 
                                            }else if( type_grade==3){
                                                class_name="四年级" 
                                            }else if( type_grade==4){
                                                class_name="五年级" 
                                            }else if( type_grade==5){
                                                class_name="六年级" 
                                            }else if( type_grade==6){
                                                class_name="七年级" 
                                            }else if( type_grade==7){
                                                class_name="八年级" 
                                            }else if( type_grade==8){
                                                class_name="九年级" 
                                            }else if(type_grade==9){
                                                class_name="高一 ";
                                            }else if( type_grade==10){
                                                class_name="高二 ";
                                            }else if(type_grade==11){
                                                class_name="高三 ";
                                            }else{
                                                class_name="大学 ";
                                            }
                                            return_all_one.id=element.id;
                                            return_all_one.teacher_name=element.teacher_name;
                                            return_all_one.headmaster_class_name=class_name+class_id;
                                            return_all_one.headmaster_status="1";//未录入
                                            return_all_one.type_grade=type_grade;
                                            return_all_one.class=class_one;
                                            return_all_one.display="0"
                                            return_all_one.class_id=class_id;
                                            return_all_one.department_list=element.department_list;
                                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                                            return_all_one.phone=element.phone;
                                            return_all_one.school_id=element.school_id;
                                            return_all.push(return_all_one);
                                            if(index==result_for.length){
                                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                                cb(null,return_all.sort(Sort('id')));
                                            }
                                            index++;//放的位置
                                    }else{
                                    console.log(JSON.stringify(result));
                                    result.map(function(element2){
                                        if(element2.type_grade==0){
                                            class_name="一年级"+element2.class;
                                        }else if(element2.type_grade==1){
                                            class_name="二年级"+element2.class;
                                        }else if(element2.type_grade==2){
                                            class_name="三年级"+element2.class;
                                        }else if(element2.type_grade==3){
                                            class_name="四年级"+element2.class;
                                        }else if(element2.type_grade==4){
                                            class_name="五年级"+element2.class;
                                        }else if(element2.type_grade==5){
                                            class_name="六年级"+element2.class;
                                        }else if(element2.type_grade==6){
                                            class_name="七年级"+element2.class;
                                        }else if(element2.type_grade==7){
                                            class_name="八年级"+element2.class;
                                        }else if(element2.type_grade==8){
                                            class_name="九年级"+element2.class;
                                        }else if(element2.type_grade==9){
                                            class_name="高一 "+element2.class;
                                        }else if(element2.type_grade==10){
                                            class_name="高二 "+element2.class;
                                        }else if(element2.type_grade==11){
                                            class_name="高三 "+element2.class;
                                        }else{
                                            class_name="大学 "+element2.class;
                                        }
                                         type_grade=element2.type_grade;
                                         class_one=element2.class;
                                         class_id=element2.id;
                                    });
                                    return_all_one.id=element.id;
                                    return_all_one.teacher_name=element.teacher_name;
                                    return_all_one.headmaster_class_name=class_name;
                                    return_all_one.headmaster_status="0";//已经录入
                                    return_all_one.type_grade=type_grade;
                                    return_all_one.class=class_one;
                                    return_all_one.display="0"
                                    return_all_one.class_id=class_id;
                                    return_all_one.department_list=element.department_list;
                                    return_all_one.teacheringclass_list=element.teacheringclass_list;
                                    return_all_one.phone=element.phone;
                                    return_all_one.school_id=element.school_id;
                                    return_all.push(return_all_one);
                                   
                                    if(index==result_for.length){
                                        console.log("返回最终结果2"+JSON.stringify(return_all));
                                        cb(null,return_all.sort(Sort('id')));
                                    }
                                     index++;//放的位置
                                }
                                }
                            });//根据id查询班级
                        }
                        
                    });
             }else{
                 cb(null,"1");
             }

         }
     });//返回值没有设置 正常连接   
}
//添加教师——全体
module.exports.addTeacher_all = function(data,school_id,cb) {
      var teacher_m_id="";
      user_m_sql.get_Teacher(data,school_id,function(err,result){//查询这个老师是否存在 
          if(err){
              cb(err);
          }else{
              if(result==""||result==null){//不存在
                user_m_sql.addTeacher(data,school_id,function(err, result) {
                    if(err){
                        cb(err);
                    }else{
                        //插入用户之前查询user_m是否存在
                        user_m_sql.queryUser_Phone(data.phone,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                //不存在
                                if(result==null||result==""){
                                    //插入一个用户
                                    user_m_sql.addUser(data,school_id,function(err,result){
                                    if(err){
                                        cb(err);
                                    }else{
                                        //插入一个角色
                                        user_m_sql.insertRole(data,function(err,result){
                                            if(err){
                                                cb(err);
                                            }else{
                                                cb(null,result);
                                            }
                                        })
                                    }
                                })
                                }else{
                                    cb(null,result);
                                }
                            }
                        })
                    }
                });//返回值没有设置 正常连接
              }else{//存在
                  result.map(function(element){
                      teacher_m_id=element.id;
                  });
                   var  department_list_index=1;
                   var string_department_list="";
                    data.department_name.forEach(function(element){
                        if(department_list_index === data.department_name.length){
                            string_department_list+=element;
                        }else{
                            string_department_list+=element+" ";
                        }
                        department_list_index++;
                    });
                  console.log(string_department_list+"string_department_list");
                  user_m_sql.update_partment_list(teacher_m_id,string_department_list,function(err,result){
                      if(err){
                          cb(err);
                      }else{//更新用户之后查询user_m是否存在
                        user_m_sql.queryUser_Phone(data.phone,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                //不存在
                                if(result==null||result==""){
                                    //插入一个用户
                                    user_m_sql.addUser(data,function(err,result){
                                    if(err){
                                        cb(err);
                                    }else{
                                        //插入一个角色
                                        user_m_sql.insertRole(data,function(err,result){
                                            if(err){
                                                cb(err);
                                            }else{
                                                cb(null,result);
                                            }
                                        })
                                    }
                                })
                                }else{
                                    cb(null,result);
                                }
                            }
                        })
                      }
                  });
              }
          }
      });
   
}
//添加部门教师
module.exports.addTeacher = function(department_name,data,school_id,cb) {
      //先查询这个老师是否存在某个部门  如果存在 更新不存在  插入
      var teacher_m_id="";
      user_m_sql.get_Teacher(data,school_id,function(err,result){//查询是否存在这个老师
          if(err){
              cb(err);
          }else{
              if(result==""||result==null){//不存在
                user_m_sql.addTeacher(data,school_id,function(err, result) {
                    if(err){
                        cb(err);
                    }else{
                        //插入用户之前查询user_m是否存在
                        user_m_sql.queryUser_Phone(data.phone,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                //不存在
                                if(result==null||result==""){
                                    //插入一个用户
                                    user_m_sql.addUser(data,school_id,function(err,result){
                                    if(err){
                                        cb(err);
                                    }else{
                                        //插入一个角色
                                        user_m_sql.insertRole(data,function(err,result){
                                            if(err){
                                                cb(err);
                                            }else{
                                                cb(null,result);
                                            }
                                        })
                                    }
                                })
                                }else{
                                    cb(null,result);
                                }
                            }
                        })
                    }
                });//返回值没有设置 正常连接
              }else{//存在
                  result.map(function(element){
                      teacher_m_id=element.id;
                  });
                   var  department_list_index=1;
                   var string_department_list="";
                    data.department_list.forEach(function(element){
                        if(department_list_index === data.department_list.length){
                            string_department_list+=element;
                        }else{
                            string_department_list+=element+" ";
                        }
                        department_list_index++;
                    });
                  console.log(string_department_list+"string_department_list");
                  user_m_sql.update_partment_list(teacher_m_id,string_department_list,function(err,result){
                      if(err){
                          cb(err);
                      }else{//更新用户之后查询user_m是否存在
                        user_m_sql.queryUser_Phone(data.phone,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                //不存在
                                if(result==null||result==""){
                                    //插入一个用户
                                    user_m_sql.addUser(data,function(err,result){
                                    if(err){
                                        cb(err);
                                    }else{
                                        //插入一个角色
                                        user_m_sql.insertRole(data,function(err,result){
                                            if(err){
                                                cb(err);
                                            }else{
                                                cb(null,result);
                                            }
                                        })
                                    }
                                })
                                }else{
                                    cb(null,result);
                                }
                            }
                        })
                      }
                  });
              }
          }
      });
   
}
//deleteTeacher删除老师的时候是在某个部门下还是在所有老师下、
module.exports.deleteTeacher_depart = function(id,department_name,cb) {
      user_m_sql.querydepartment_list(id,function(err,result){
          if(err){
              cb(err);
          }else{
              //查询出department_list去除department_name这个名
             var result_list="";
             result.map(function(element){
                 result_list=element.department_list
             })
             var newdepartment_list=result_list.replace(department_name,"");//只能是一个
             //update这个
             user_m_sql.update_partment_list(id,newdepartment_list,function(err,result){
                 if(err){
                     cb(err);
                    }else{
                        cb(null,result);
                    }
             })
          }

      })
      
  
}
//modifyTeacher
module.exports.modifyTeacher_all = function(id,data,cb) {
      
     user_m_sql.modifyTeacher_all(id,data,function(err, result) {
         if(err){
             cb(err);
         }else{
             //更新用户phone
             if(data.phone==data.old_phone&&data.name==data.old_name){//未做用户phone更改
                  cb(null,result);
             }else{
             user_m_sql.updatePhone(data.phone,data.teacher_name,data,function(err,result){
                 if(err){
                     cb(err);
                 }else{
                      cb(null,result);
                 }    
             })
          }
         }
     });//返回值没有设置 正常连接   
  
}
//deleteTeacher
module.exports.deleteTeacher = function(id,cb) {
    //
     user_m_sql.querydepartment_list(id,function(err, result) {
         if(err){
             cb(err);
         }else{
              //查询出department_list去除department_name这个名
              console.log(JSON.stringify(result));
              if(result==""||result==null){
                  console.log(1);
              }else{
                  console.log(2);
              }
             var user_phone="";
             result.map(function(element){
                 user_phone=element.phone;
             })
             //删除老师后删除用户
             user_m_sql.deleteUser(user_phone,function(err,result){
                 if(err){
                     cb(err);
                 }else{
                     user_m_sql.deleteTeacher(id,function(err,result){
                         if(err){
                             cb(err);
                         }else{
                              cb(null,result);
                         }
                     })
                 }
             })
         }
     });//返回值没有设置 正常连接   
  
} 
//mac 创建查询
module.exports.create_query_Wbnumber = function(mac,cb) {
      
     user_m_sql.query_Wbnumber(mac,function(err, result) {
         if(err){
             cb(err);
         }else{
             //结果
             if(result==""||result==null){
                 //查询最大的wb_number
                 user_m_sql.get_Max(function(err,result){
                     if(err){
                         cb(err);
                     }else{
                          var now_wb_number=0;
                          result.map(function(element){
                              console.log(element);
                             now_wb_number=element.max_number+1;
                          })
                         user_m_sql.create_Wbnumber(mac,now_wb_number,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                user_m_sql.query_Wbnumber(mac,function(err,result){
                                    if(err){
                                        cb(err);
                                    }else{
                                        cb(null,result);
                                    }
                                })
                            }    
                        })
                     }
                 });
            }else{
                 console.log("wb_number:"+JSON.stringify(result));
                 cb(null,result);
             }
            
         }
     });//返回值没有设置 正常连接   
  
}
//条件查询全体教师
module.exports.query_Teacher = function(data,cb) {
    //  user_m_sql.query_Teacher(data,function(err, result) {
    //      if(err){
    //          cb(err);
    //      }else{
    //          cb(null,result);
    //      }
    //  });//返回值没有设置 正常连接  
    //        //部门id 查询老师所
      var school_id=data.school_id;  
      var return_all=[];
      var class_name="";
      var type_grade="";
      var class_one="";
      var class_id="";
      var index_array=1;  
      console.log("走了几遍：：：：");    
     user_m_sql.query_Teacher(data,function(err, result_for) {
         if(err){
             cb(err);
         }else{
             console.log();
             if(result_for!=""){
                    var index=1;
                    result_for.forEach(function(element){
                        var return_all_one={id:"",teacher_name:"",department_list:"",teacheringclass_list:"",phone:"",headmaster_class_name:"",headmaster_status:"",school_id:"",type_grade:"",class:"",display:"",class_id:""};//新组建一个数组
                        if(element.headmaster_class_id==null||element.headmaster_class_id==""){
                            return_all_one.id=element.id;
                            return_all_one.teacher_name=element.teacher_name;
                            return_all_one.department_list=element.department_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;//任职班级
                            return_all_one.phone=element.phone;
                            return_all_one.headmaster_class_name="未担任班主任";
                            return_all_one.headmaster_status="-1";//未担任班主任
                            return_all_one.display="-1";
                            return_all_one.school_id=element.school_id;
                            return_all.push(return_all_one);
                            if(index==result_for.length){
                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                cb(null,return_all.sort(Sort('id')));
                            }
                             index++;//放的位置
                        }else{
                            //根据headmaster_class_id查询  id;
                            var spilte_head=element.headmaster_class_id;//但是没有查询到该班级
                            var type_grade=spilte_head.split(",")[0];
                            var class_id=spilte_head.split(",")[1];
                            //user_m_sql.query_classname_2(type_grade,class_id,school_id,function(){});
                            user_m_sql.query_classname_2(type_grade,class_id,school_id,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){
                                        //有班级但是还没有录入班级
                                            if(type_grade==0){
                                                class_name="一年级";
                                            }else if( type_grade==1){
                                                class_name="二年级" 
                                            }else if( type_grade==2){
                                                class_name="三年级" 
                                            }else if( type_grade==3){
                                                class_name="四年级" 
                                            }else if( type_grade==4){
                                                class_name="五年级" 
                                            }else if( type_grade==5){
                                                class_name="六年级" 
                                            }else if( type_grade==6){
                                                class_name="七年级" 
                                            }else if( type_grade==7){
                                                class_name="八年级" 
                                            }else if( type_grade==8){
                                                class_name="九年级" 
                                            }else if(type_grade==9){
                                                class_name="高一 ";
                                            }else if( type_grade==10){
                                                class_name="高二 ";
                                            }else if(type_grade==11){
                                                class_name="高三 ";
                                            }else{
                                                class_name="大学 ";
                                            }
                                            return_all_one.id=element.id;
                                            return_all_one.teacher_name=element.teacher_name;
                                            return_all_one.headmaster_class_name=class_name+class_id;
                                            return_all_one.headmaster_status="1";//未录入
                                            return_all_one.type_grade=type_grade;
                                            return_all_one.class=class_one;
                                            return_all_one.display="0"
                                            return_all_one.class_id=class_id;
                                            return_all_one.department_list=element.department_list;
                                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                                            return_all_one.phone=element.phone;
                                            return_all_one.school_id=element.school_id;
                                            return_all.push(return_all_one);
                                            if(index==result_for.length){
                                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                                cb(null,return_all.sort(Sort('id')));
                                            }
                                            index++;//放的位置
                                    }else{
                                    console.log("结果长度："+JSON.stringify(result.length));
                                    result.map(function(element2){
                                        if(element2.type_grade==0){
                                            class_name="一年级"+element2.class;
                                        }else if(element2.type_grade==1){
                                            class_name="二年级"+element2.class;
                                        }else if(element2.type_grade==2){
                                            class_name="三年级"+element2.class;
                                        }else if(element2.type_grade==3){
                                            class_name="四年级"+element2.class;
                                        }else if(element2.type_grade==4){
                                            class_name="五年级"+element2.class;
                                        }else if(element2.type_grade==5){
                                            class_name="六年级"+element2.class;
                                        }else if(element2.type_grade==6){
                                            class_name="七年级"+element2.class;
                                        }else if(element2.type_grade==7){
                                            class_name="八年级"+element2.class;
                                        }else if(element2.type_grade==8){
                                            class_name="九年级"+element2.class;
                                        }else if(element2.type_grade==9){
                                            class_name="高一 "+element2.class;
                                        }else if(element2.type_grade==10){
                                            class_name="高二 "+element2.class;
                                        }else if(element2.type_grade==11){
                                            class_name="高三 "+element2.class;
                                        }else{
                                            class_name="大学 "+element2.class;
                                        }
                                         type_grade=element2.type_grade;
                                         class_one=element2.class;
                                         class_id=element2.id;
                                    });
                                    return_all_one.id=element.id;
                                    return_all_one.teacher_name=element.teacher_name;
                                    return_all_one.headmaster_class_name=class_name;
                                    return_all_one.headmaster_status="0";//已经录入
                                    return_all_one.type_grade=type_grade;
                                    return_all_one.class=class_one;
                                    return_all_one.display="0"
                                    return_all_one.class_id=class_id;
                                    return_all_one.department_list=element.department_list;
                                    return_all_one.teacheringclass_list=element.teacheringclass_list;
                                    return_all_one.phone=element.phone;
                                    return_all_one.school_id=element.school_id;
                                    return_all.push(return_all_one);
                                   
                                    if(index==result_for.length){
                                        console.log("返回最终结果2"+JSON.stringify(return_all));
                                        cb(null,return_all.sort(Sort('id')));
                                    }
                                     index++;//放的位置
                                }
                                }
                            });//根据id查询班级
                        }
                        
                    });
             }else{
                    cb(null,"1");
             }

         }
     });//返回值没有设置 正常连接    
  
}
//查询学校管理员信息
module.exports.getUser_schooladmin=function(username,cb){
     var  roles=[];
     user_m_sql.getUser_schooladmin(username,function(err,result){
        if(err){
            cb(err);
        }
        else{
            if(result==""||result==null){
                cb(null,"1");
            }else{
            var user={username:"",name:"",password:"",roles:"",school_id:""};
            result.forEach(function(element){
                     user.password=element.password;
                     user.name=element.name;
                     user.school_id=element.school_m_id;
                     user.username=username;                     
            });
            user_m_sql.getRole_schooladmin(username,function(err,roles_result){
                if(err){
                    cb(err);
                }
                else{
                    roles_result.forEach(function(elem){
                        roles.push(elem.role);
                    });
                    user.roles=roles;
                     console.log("ssssuser:"+JSON.stringify(user));
                      cb(null,user);
                }
                
            })
          }
        }
     })
}
//查询该老师是不是headmaster
module.exports.query_headmaster = function(phone,cb) {
     user_m_sql.query_headmaster(phone,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });//返回值没有设置 正常连接   
  
}
//查询总管理平台的信息
module.exports.get_all_admin=function(username,cb){
    user_m_sql.get_all_admin(username,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
 function Sort(data){
    return function(a,b){
        var value1 = a[data];
        var value2 = b[data];
        return value2 - value1;
    }
}
//条件查询某个部门下的教师
module.exports.querydeparTeacher_condition = function(department_name,school_id,data,cb) {
      //部门id 查询老师所
      var return_all=[];
      var index=1;
      var class_name="";
      var type_grade="";
      var class_one="";
      var class_id="";

     user_m_sql.query_Teacher_depart(department_name,school_id,data,function(err, result_for) {
         if(err){
             cb(err);
         }else{   
             if(result_for!=""){
                    result_for.forEach(function(element){
                        var return_all_one={id:"",teacher_name:"",department_list:"",teacheringclass_list:"",phone:"",headmaster_class_name:"",headmaster_status:"",school_id:"",type_grade:"",class:"",display:"",class_id:""};//新组建一个数组
                        if(element.headmaster_class_id==null||element.headmaster_class_id==""){
                            return_all_one.id=element.id;
                            return_all_one.teacher_name=element.teacher_name;
                            return_all_one.department_list=element.department_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                            return_all_one.teacheringclass_list=element.teacheringclass_list;//任职班级
                            return_all_one.phone=element.phone;
                            return_all_one.headmaster_class_name="未担任班主任";
                            return_all_one.headmaster_status="-1";//未担任班主任
                            return_all_one.display="-1";
                            return_all_one.school_id=element.school_id;
                            return_all.push(return_all_one);
                            if(index==result_for.length){
                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                cb(null,return_all.sort(Sort('id')));
                            }
                             index++;//放的位置
                        }else{
                            //根据headmaster_class_id查询  id;
                            var spilte_head=element.headmaster_class_id;//但是没有查询到该班级
                            var type_grade=spilte_head.split(",")[0];
                            var class_id=spilte_head.split(",")[1];
                            //user_m_sql.query_classname_2(type_grade,class_id,school_id,function(){});
                            user_m_sql.query_classname_2(type_grade,class_id,school_id,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){
                                        //有班级但是还没有录入班级
                                            if(type_grade==0){
                                                class_name="一年级";
                                            }else if( type_grade==1){
                                                class_name="二年级" 
                                            }else if( type_grade==2){
                                                class_name="三年级" 
                                            }else if( type_grade==3){
                                                class_name="四年级" 
                                            }else if( type_grade==4){
                                                class_name="五年级" 
                                            }else if( type_grade==5){
                                                class_name="六年级" 
                                            }else if( type_grade==6){
                                                class_name="七年级" 
                                            }else if( type_grade==7){
                                                class_name="八年级" 
                                            }else if( type_grade==8){
                                                class_name="九年级" 
                                            }else if(type_grade==9){
                                                class_name="高一 ";
                                            }else if( type_grade==10){
                                                class_name="高二 ";
                                            }else if(type_grade==11){
                                                class_name="高三 ";
                                            }else{
                                                class_name="大学 ";
                                            }
                                            return_all_one.id=element.id;
                                            return_all_one.teacher_name=element.teacher_name;
                                            return_all_one.headmaster_class_name=class_name+class_id;
                                            return_all_one.headmaster_status="1";//未录入
                                            return_all_one.type_grade=type_grade;
                                            return_all_one.class=class_one;
                                            return_all_one.display="0"
                                            return_all_one.class_id=class_id;
                                            return_all_one.department_list=element.department_list;
                                            return_all_one.teacheringclass_list=element.teacheringclass_list;
                                            return_all_one.phone=element.phone;
                                            return_all_one.school_id=element.school_id;
                                            return_all.push(return_all_one);
                                            if(index==result_for.length){
                                                console.log("返回最终结果1"+JSON.stringify(return_all));
                                                cb(null,return_all.sort(Sort('id')));
                                            }
                                            index++;//放的位置
                                    }else{
                                    console.log(JSON.stringify(result));
                                    result.map(function(element2){
                                        if(element2.type_grade==0){
                                            class_name="一年级"+element2.class;
                                        }else if(element2.type_grade==1){
                                            class_name="二年级"+element2.class;
                                        }else if(element2.type_grade==2){
                                            class_name="三年级"+element2.class;
                                        }else if(element2.type_grade==3){
                                            class_name="四年级"+element2.class;
                                        }else if(element2.type_grade==4){
                                            class_name="五年级"+element2.class;
                                        }else if(element2.type_grade==5){
                                            class_name="六年级"+element2.class;
                                        }else if(element2.type_grade==6){
                                            class_name="七年级"+element2.class;
                                        }else if(element2.type_grade==7){
                                            class_name="八年级"+element2.class;
                                        }else if(element2.type_grade==8){
                                            class_name="九年级"+element2.class;
                                        }else if(element2.type_grade==9){
                                            class_name="高一 "+element2.class;
                                        }else if(element2.type_grade==10){
                                            class_name="高二 "+element2.class;
                                        }else if(element2.type_grade==11){
                                            class_name="高三 "+element2.class;
                                        }else{
                                            class_name="大学 "+element2.class;
                                        }
                                         type_grade=element2.type_grade;
                                         class_one=element2.class;
                                         class_id=element2.id;
                                    });
                                    return_all_one.id=element.id;
                                    return_all_one.teacher_name=element.teacher_name;
                                    return_all_one.headmaster_class_name=class_name;
                                    return_all_one.headmaster_status="0";//已经录入
                                    return_all_one.type_grade=type_grade;
                                    return_all_one.class=class_one;
                                    return_all_one.display="0"
                                    return_all_one.class_id=class_id;
                                    return_all_one.department_list=element.department_list;
                                    return_all_one.teacheringclass_list=element.teacheringclass_list;
                                    return_all_one.phone=element.phone;
                                    return_all_one.school_id=element.school_id;
                                    return_all.push(return_all_one);
                                   
                                    if(index==result_for.length){
                                        console.log("返回最终结果2"+JSON.stringify(return_all));
                                        cb(null,return_all.sort(Sort('id')));
                                    }
                                     index++;//放的位置
                                }
                                }
                            });//根据id查询班级
                        }
                        
                    });
             }else{
                 cb(null,"1");
             }

         }
     });//返回值没有设置 正常连接   
}
//查询class_id
module.exports.getclass_id = function(headmaster_class_id,school_id,cb) {
    var type_grade=headmaster_class_id.split(",")[0];
    var class_one=headmaster_class_id.split(",")[1];
    //学校是否删除后不能用
     classes_m_sql.get_delete_status_school(school_id,function(err,result){
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){
                 cb(null,"1");
             }else{
             classes_m_sql.get_delete_status_classid(type_grade,class_one,school_id,function(err, result) {//回函数
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"2");
                        }else{
                            cb(null,result);
                        }
                    }
                });//返回值没有设置 正常连接
             }
         }
     });
}
//查询是不是老师
module.exports.get_all_admin=function(username,cb){
    user_m_sql.get_all_admin(username,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
//查询班级是否存在
module.exports.get_class_status=function(type_grade,class_id,school_id,cb){
    user_m_sql.query_classname_2(type_grade,class_id,school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
//获取教师信息
module.exports.get_teacher_phone=function(id,cb){
    user_m_sql.get_teacher_phone(id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
//添加教师校验
module.exports.addTeacher_check=function(check_phone,school_id,cb){
    user_m_sql.addTeacher_check(check_phone,school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
//更改教师校验
module.exports.updateTeacher_check=function(check_phone,school_id,cb){
    user_m_sql.updateTeacher_check(check_phone,school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
