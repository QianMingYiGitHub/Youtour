(function() {
    var database = require('../dbutil/database');
    var conn=null; 

//录入用户+user数组
  exports.addUser = function(data,school_id,cb) {
         conn=database.getDbCon();
try {
     
  var usr={phone:data.phone,password:"123456",name:data.teacher_name,school_id:school_id};
  conn.query('insert into user_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
        try {
            console.log(JSON.stringify(result));
        } catch (error) {
            console.log(error.message);
        }
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//插入role
exports.insertRole = function(data,cb) {
         conn=database.getDbCon();
try { 
  var usr={phone:data.phone,role:"teacher"};
  conn.query('insert into user_role_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
        try {
            console.log(JSON.stringify(result));
        } catch (error) {
            console.log(error.message);
        }
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//更新密码
   exports.updatePassword = function(phone,password,cb) {
         conn=database.getDbCon();
try {
  var usr=[password,phone];
  conn.query('update user_m set password=? where phone=?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

   });
 
 } catch (error) {
     console.log("链接出错");
 }   
conn.end();
  
   };
//获取用户信息
exports.getUser = function(phone,cb) {
         conn=database.getDbCon();
try {
     
  conn.query('select password,name from user_m where phone="'+phone+'"', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错1");
}
       
conn.end();
  
   };
   //获取用户权限
exports.getRole = function(phone,cb) {
         conn=database.getDbCon();
try {
     
  
  conn.query('select role from user_role_m where phone="'+phone+'"',  function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错2");
}
       
conn.end();
  
   };
//获取+name
exports.getName = function(phone,cb) {
    //查询name
         conn=database.getDbCon();
try {
  var usr=[phone];
  conn.query('select name from user_m where phone=?', usr, function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
      
   
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
 
//添加部门
exports.addDepartment = function(department_name,school_id,cb) {
         conn=database.getDbCon();
try {
     
  var usr={department_name:department_name,school_id:school_id};
  conn.query('insert into department_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
        try {
            console.log(JSON.stringify(result));
        } catch (error) {
            console.log(error.message);
        }
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//获取+部门
exports.queryDepartment = function(school_id,cb) {
    //查询name
         conn=database.getDbCon();
try {
  
  conn.query('select * from department_m where school_id='+school_id+'', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
      
   
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
   //获取+部门+人数
exports.queryDepartment_count = function(department_id,cb) {
    //查询name
         conn=database.getDbCon();
try {
 
  conn.query('select count(*) as people_count from teacher_m where department_id='+department_id+'', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
      
   
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//更新部门
   exports.modifyDepartment = function(id,department_name,cb) {
         conn=database.getDbCon();
try {
  var usr=[department_name,id];
  conn.query('update department_m set department_name=? where id=?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

   });
 
 } catch (error) {
     console.log("链接出错");
 }   
conn.end();
  
   };
   // 删除部门
exports.deleteDepartment = function(id,cb) {
         conn=database.getDbCon();
try {
  console.log("id"+id);// 
 
  var sql='delete  from  department_m where id="'+id+'"';
  conn.query(sql, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}

       
conn.end();
  
   };
   //获取+部门+教师
exports.queryDepartment_teacher = function(department_id,cb) {
    //查询name
         conn=database.getDbCon();
try {
 
  conn.query('select * from teacher_m where department_id='+department_id+'', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
   //查询全体教师
exports.queryAllteacher = function(school_id,cb) {
    //查询name
         conn=database.getDbCon();
try {
 
  conn.query('select * from teacher_m where school_id='+school_id+'', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//查询全体教师
exports.query_classname = function(id,cb) {
    //查询name
         conn=database.getDbCon();
try {
 
  conn.query('select * from class_m where id='+id+' and school_id=1', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
   //查询全体教师
exports.query_classname_2 = function(type_grade,class_id,school_id,cb) {
    //查询name
         conn=database.getDbCon();
         
try {
 
  conn.query('select * from class_m where type_grade='+type_grade+' and school_id='+school_id+' and class="'+class_id+'" and delete_status=0', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//查询部门教师
exports.querydeparTeacher = function(department_name,school_id,cb) {
    //查询name
         conn=database.getDbCon();
try {
 
  conn.query('select * from teacher_m where department_list like "'+"%"+department_name+"%"+'" and school_id='+school_id+'', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//添加教师——全体
exports.addTeacher_all = function(data,cb) {
         conn=database.getDbCon();
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
try {
     
  var usr={
      teacher_name:data.teacher_name,
      phone:data.phone,
      headmaster_class_id:data.headmaster_class_id,
      department_list:string_department_list,
      school_id:data.school_id
    };
  conn.query('insert into teacher_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
        try {
            console.log(JSON.stringify(result));
        } catch (error) {
            console.log(error.message);
        }
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
   //添加老师
exports.addTeacher = function(data,school_id,cb) {
         conn=database.getDbCon();
         var  department_list_index=1;
         var string_department_list="";
         var  teacheringclass_list_index=1;
         var  string_teacheringclass_list="";
        if(data.department_name.length>0){
             data.department_name.forEach(function(element){
              if(department_list_index === data.department_name.length){
                 string_department_list+=element;
             }else{
                 string_department_list+=element+" ";
             }
               department_list_index++;
         });
        }
         var index=1;
         var string_ll="";
        if(data.teacheringclass_list.length>0){
            data.teacheringclass_list.forEach(function(every_array){
            if(index==data.teacheringclass_list.length){
                string_ll+=every_array.type_grade+","+every_array.class
            }else{
                string_ll+=every_array.type_grade+","+every_array.class+"||"
            }
        index++;
        });
        }else{
            string_ll="||";
        }  
         
try {    
  var usr={
      teacher_name:data.teacher_name,
      phone:data.phone,
      headmaster_class_id:data.headmaster_class_id,
      department_list:string_department_list,
      teacheringclass_list:string_ll,
      school_id:school_id
    };
  conn.query('insert into teacher_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
        try {
            console.log(JSON.stringify(result));
        } catch (error) {
            console.log(error.message);
        }
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//查询部门老师
exports.get_Teacher = function(data,school_id,cb) {
     conn=database.getDbCon();
try {    
 var phone=data.phone;
  conn.query('select * from teacher_m where phone="'+phone+'"', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };

    // 删除老师某个部门下
exports.deleteTeacher_depart = function(id,cb) {
         conn=database.getDbCon();
try {
  console.log("id"+id);// 
 
  var sql='delete  from  teacher_m where id="'+id+'"';
  conn.query(sql, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}

       
conn.end();
  
   };


//更新老师
   exports.modifyTeacher_all = function(id,data,cb) {
         conn=database.getDbCon();
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
         var index=1;
         var string_ll="";
        if(data.teacheringclass_list.length>0){
            data.teacheringclass_list.forEach(function(every_array){
            if(index==data.teacheringclass_list.length){
                string_ll+=every_array.type_grade+","+every_array.class
            }else{
                string_ll+=every_array.type_grade+","+every_array.class+"||"
            }
          index++;
        });
        }else{
            string_ll="||";
        }  
try {
    //更新部门教师
    if(string_department_list=="" && data.headmaster_class_id==""){
     var usr={teacher_name:data.teacher_name,phone:data.phone};
     conn.query('update teacher_m set ? where id='+id+'', usr, function(err, result) {
        if (err) {
            cb(err);
        console.error('error connecting: ' + err.stack);
        }else{
            cb(null, result);
        }
   });
    }else{//更新所有老师
    var usr={teacher_name:data.teacher_name,phone:data.phone,department_list:string_department_list,headmaster_class_id:data.headmaster_class_id,teacheringclass_list:string_ll};
    conn.query('update teacher_m set ? where id='+id+'', usr, function(err, result) {
        if (err) {
            cb(err);
        console.error('error connecting: ' + err.stack);
        }else{
            cb(null, result);
        }
   });
    }
 } catch (error) {
     console.log("链接出错");
 }   
conn.end();
  
   };

//更新用户
   exports.updatePhone = function(phone,name,data,cb) {
         conn=database.getDbCon();
         var old_phone=data.old_phone;
         var usr={
             phone:phone,
             name:name
         };
try {
  conn.query('update user_m set ? where phone="'+old_phone+'"',usr,function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

   });
 
 } catch (error) {
     console.log("链接出错");
 }   
conn.end();
  
   };

//查询phone是否存在
exports.queryUser_Phone = function(phone,cb) {
    //查询name
         conn=database.getDbCon();
try {
 var usr=[phone];
  conn.query('select * from user_m where phone=?',usr, function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//querydepartment_list
exports.querydepartment_list = function(id,cb) {
    //查询name
         conn=database.getDbCon();
try {
 var usr=[id];
  conn.query('select * from teacher_m where id=?',usr, function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//更新update_partment_list
   exports.update_partment_list = function(id,newdepartment_list,cb) {
         conn=database.getDbCon();
try {
  var usr=[newdepartment_list,id];
  conn.query('update teacher_m set department_list=? where id=?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

   });
 
 } catch (error) {
     console.log("链接出错");
 }   
conn.end();
  
   };
   // 删除老师
exports.deleteTeacher = function(id,cb) {
         conn=database.getDbCon();
try {
  console.log("id"+id);// 
 
  var sql='delete  from  teacher_m where id="'+id+'"';
  conn.query(sql, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}

       
conn.end();
  
   };

   // 删除用户
exports.deleteUser = function(phone,cb) {
         conn=database.getDbCon();
try {
  var sql='delete  from  user_m where phone="'+phone+'"';
  conn.query(sql, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}

       
conn.end();
  
   };

//查询mac是否存在
exports.query_Wbnumber = function(mac,cb) {
    //查询name
         conn=database.getDbCon();
try {
 var usr=[mac];
  conn.query('select mac_address,wb_number from mac_m where mac_address=?',usr, function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//生成白板号
exports.create_Wbnumber = function(mac,wb_number,cb) {
         conn=database.getDbCon();
          
try {  
  var date=new Date();
  var time_date=date.toLocaleTimeString();
  var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
  var usr={
      wb_number:wb_number,
      mac_address:mac,
      createtime:linux_time
    };
  conn.query('insert into mac_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
        try {
            console.log(JSON.stringify(result));
        } catch (error) {
            console.log(error.message);
        }
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };

//查询最大版本号
exports.get_Max = function(cb) {
    //查询name
         conn=database.getDbCon();
try {
  conn.query('select max(wb_number) as max_number from mac_m ', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
   //条件查询老师
exports.query_Teacher = function(data,cb) {
         conn=database.getDbCon();
try {
   
 var phone=data.phone;
 var schol_id=data.school_id;
 var teacher_name=data.teacher_name;
 var condition="";
 if(phone!=""){
     condition+='and  phone like "'+"%"+phone+"%"+'"';
 }
 if(teacher_name!=""){
     condition+='and  teacher_name like "'+"%"+teacher_name+"%"+'"'
 }
 var sql='select * from teacher_m where school_id='+schol_id+' '+condition;
 console.log(sql);
  conn.query(sql, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}

       
conn.end();
  
   };
//获取学校管理员
exports.getUser_schooladmin = function(username,cb) {
         conn=database.getDbCon();
try {
     
  conn.query('select password,username,school_m_id,name from schooluser_m where username="'+username+'"', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
} catch (error) {
     console.log("链接出错1");
}
       
conn.end();
   };
   //获取学校用户权限
exports.getRole_schooladmin = function(username,cb) {
         conn=database.getDbCon();
try {
     
  
  conn.query('select role from schooluser_role_m where username="'+username+'"',  function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错2");
}
       
conn.end();
  
   };


//查询教师是不是headermaster
exports.query_headmaster = function(phone,cb) {
         conn=database.getDbCon();
    try {
         conn.query('select * from teacher_m where phone="'+phone+'"',  function(err, result) {
            if (err) {
                cb(err);//返回值设定
            console.error('error connecting: ' + err.stack);
            }else{
                cb(null, result);
            }
    });
   } catch (error) {
            console.log("链接出错2");
    }
conn.end();

};
//更新密码+学校管理员
   exports.updatePassword_schooladmin = function(phone,password,cb) {
         conn=database.getDbCon();
try {
  var usr=[password,phone];
  conn.query('update schooluser_m set password=? where username=?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

   });
 
 } catch (error) {
     console.log("链接出错");
 }   
conn.end();
  
   };

//查询部门是否存在
exports.query_Department = function(department_name,school_id,cb) {
    //查询name
         conn=database.getDbCon();
try {
  conn.query('select * from department_m where department_name="'+department_name+'" and school_id='+school_id+'', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//更改教师所在的部门
exports.update_teacher_depar = function(department_name_last,id_last,school_id,cb) {
    //查询name
         conn=database.getDbCon();
try {
 
  conn.query(' update  teacher_m set department_list="'+department_name_last+'" where id='+id_last+' and school_id='+school_id+'', function(err, result) {
     if (err) {
         cb(err);//返回值设定
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
//总平台
exports.get_all_admin = function(username,cb) {
         conn=database.getDbCon();
    try {
         conn.query('select * from admin_m where username="'+username+'"',  function(err, result) {
            if (err) {
                cb(err);//返回值设定
            console.error('error connecting: ' + err.stack);
            }else{
                cb(null, result);
            }
    });
   } catch (error) {
            console.log("链接出错2");
    }
conn.end();

};
   //条件查询老师+部门的
exports.query_Teacher_depart = function(department_name,school_id,data,cb) {
         conn=database.getDbCon();
try {
   
 var phone=data.phone;
 var teacher_name=data.teacher_name;
 var condition="";
 if(phone!=""){
     condition+='and  phone like "'+"%"+phone+"%"+'"';
 }
 if(teacher_name!=""){
     condition+='and  teacher_name like "'+"%"+teacher_name+"%"+'"'
 }
 var sql='select * from teacher_m where department_list like "'+"%"+department_name+"%"+'" and school_id='+school_id+' '+condition;
 console.log(sql);
  conn.query(sql, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log(error.message);
}

       
conn.end();
  
   };
//获取教师信息
exports.get_teacher_phone = function(id,cb) {
         conn=database.getDbCon();
    try {
         conn.query('select * from teacher_m where id='+id+'',  function(err, result) {
            if (err) {
                cb(err);//返回值设定
            console.error('error connecting: ' + err.stack);
            }else{
                cb(null, result);
            }
    });
   } catch (error) {
            console.log("链接出错2");
    }
conn.end();

};
//添加教师校验
exports.addTeacher_check = function(check_phone,school_id,cb) {
         conn=database.getDbCon();
    try {
         conn.query('select * from teacher_m where phone="'+check_phone+'" and school_id='+school_id+'',  function(err, result) {
            if (err) {
                cb(err);//返回值设定
            console.error('error connecting: ' + err.stack);
            }else{
                cb(null, result);
            }
    });
   } catch (error) {
            console.log("链接出错2");
    }
conn.end();

};
//更爱老师校验
exports.updateTeacher_check = function(check_phone,school_id,cb) {
         conn=database.getDbCon();
    try {
         conn.query('select count(*) as count_m from teacher_m where phone="'+check_phone+'" and school_id='+school_id+'',  function(err, result) {
            if (err) {
                cb(err);//返回值设定
            console.error('error connecting: ' + err.stack);
            }else{
                cb(null, result);
            }
    });
   } catch (error) {
            console.log("链接出错2");
    }
conn.end();

};
//根据phone获取教师信息
exports.query_teacher = function(phone,cb) {
         conn=database.getDbCon();
    try {
         conn.query('select * from teacher_m where phone='+phone+'',  function(err, result) {
            if (err) {
                cb(err);//返回值设定
            console.error('error connecting: ' + err.stack);
            }else{
                cb(null, result);
            }
    });
   } catch (error) {
            console.log("链接出错2");
    }
conn.end();

};

}).call(this);




