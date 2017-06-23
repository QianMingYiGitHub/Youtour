(function() {
    var database = require('../dbutil/database');
    var conn=null; 

//录入用户+user数组
  exports.queryClass = function(school_id,cb) {
         conn=database.getDbCon();
try {
   
  conn.query('select count(*) count ,type_grade,school_id,delete_status from class_m where delete_status=0 and school_id='+school_id+'  GROUP BY type_grade   ORDER BY type_grade ',  function(err, result) {
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
 //页面加载班级
  exports.queryClass_all = function(type_grade,school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where type_grade='+type_grade+' and delete_status=0 and school_id='+school_id+' order by index_c', function(err, result) {
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
  
   }
//添加班级
    exports.addClass = function(type_grade,classes,school_id,index_c,cb) {
         conn=database.getDbCon(); 
         
try { 
    console.log(classes);
  var usr={
      type_grade:type_grade,
      class:classes,
      school_id:school_id,
      index_c:index_c
    };
  conn.query('insert into class_m set ?', usr, function(err, result) {
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
   //删除班级
    exports.deleteClass = function(id,cb) {
         conn=database.getDbCon(); 
try { 
 
  conn.query('delete from class_m  where id='+id+'', function(err, result) {
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
 
//添加学生
    exports.addStudent = function(id,data,cb) {
         conn=database.getDbCon(); 
try { 
  var usr={
      student_name:data.student_name,
      student_phone:data.student_phone,
      parent_name:data.parent_name,
      parent_phone:data.parent_phone,
      student_ID:data.student_ID,
      class_id:id
    };
  conn.query('insert into student_m set ?', usr, function(err, result) {
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
//查询学校班级年级
    exports.check_headmaster_yes = function(id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select * from class_m where school_id='+id+' and delete_status=0',function(err, result) {
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
//查询学校班级年级
    exports.get_headmaster_class = function(id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select * from teacher_m where school_id='+id+' and headmaster_class_id!=""',function(err, result) {
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
//修改学生
    exports.modifyStudent = function(id,data,cb) {
         conn=database.getDbCon(); 
try { 
  var usr={
      student_name:data.student_name,
      student_phone:data.student_phone,
      parent_name:data.parent_name,
      parent_phone:data.parent_phone,
      student_ID:data.student_ID
    };
  conn.query('update student_m  set ? where id='+id+'', usr, function(err, result) {
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
   //删除学生
    exports.deleteStudent = function(id,cb) {
         conn=database.getDbCon(); 
try { 
 
  conn.query('delete  from  student_m where id='+id+'', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
      
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
 //学生转班
    exports.modify_Class = function(id,class_id,cb) {
         conn=database.getDbCon(); 
try { 
    var usr={class_id:class_id};
  conn.query('update student_m  set ? where id='+id+'', usr, function(err, result) {
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

 //学生升级
    exports.all_Upgrade = function(school_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('update class_m  set type_grade=type_grade+1 where school_id='+school_id+' and delete_status=0',  function(err, result) {
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

//查询6,10
  exports.query_Upgrade = function(school_id,cb) {
         conn=database.getDbCon();
try {

  conn.query('select * from class_m where type_grade=6 or type_grade=10 and school_id='+school_id+' and delete_status=0',  function(err, result) {
     if (err) {
         cb(err);1
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
     console.log("链接出错9999");
}
       
conn.end();
  
   };
   //查询班主任id
exports.get_headmaster_Up = function(school_id,cb) {
         conn=database.getDbCon();
try {

  conn.query('select * from teacher_m where school_id='+school_id+' and headmaster_class_id!=""',  function(err, result) {
     if (err) {
         cb(err);
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
     console.log("链接出错9999");
}
       
conn.end();
  
   };
//查询任课班级id
exports.get_teacheringclass_notnull = function(school_id,cb) {
         conn=database.getDbCon();
try {

  conn.query('select * from teacher_m where school_id='+school_id+' and teacheringclass_list like "%,%"',  function(err, result) {
     if (err) {
         cb(err);
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
     console.log("链接出错9999");
}
       
conn.end();
  
   };
 //班主任任职班级为空
    exports.update_Upgrade = function(school_id,headmaster_class_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('update teacher_m  set headmaster_class_id="" where headmaster_class_id="'+headmaster_class_id+'" and school_id='+school_id+'',  function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   };
//headmaster
    exports.update_Upgrade_one = function(id,teacheringclass_list_new,school_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('update teacher_m  set teacheringclass_list="'+teacheringclass_list_new+'" where id= '+id+' and school_id='+school_id+'',  function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   };
//update ，
    exports.update_headmaster = function(school_id,id,headmaster_class_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('update teacher_m  set headmaster_class_id="'+headmaster_class_id+'" where school_id ='+school_id+' and id='+id+'',  function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   };
   //update ，
    exports.update_headmaster_one = function(school_id,headmaster_class_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('update teacher_m  set headmaster_class_id="" where school_id ='+school_id+' and headmaster_class_id="'+headmaster_class_id+'"',  function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   };
exports.update_headmaster_two = function(school_id,id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('update teacher_m  set headmaster_class_id="" where school_id ='+school_id+' and id in ('+id+')',  function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   };
   //条件查询班级下的学生
exports.query_Student = function(id,data,cb) {
         conn=database.getDbCon();
try {
 var student_phone=data.student_phone;
 var student_name=data.student_name;
 var condition="";
 if(student_phone!=""){
     condition+='and  student_phone like "'+"%"+student_phone+"%"+'"';
 }
 if(student_name!=""){
     condition+='and   student_name like "'+"%"+student_name+"%"+'"'
 }
 var sql='select * from student_m where class_id='+id+' '+condition;
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

 //删除最大的 
exports.delete_Upgrade = function(school_id,type_grade_max,cb) {
         conn=database.getDbCon(); 
try { 
 
  conn.query('update class_m set delete_status=1 where type_grade='+type_grade_max+' and school_id='+school_id+'', function(err, result) {
     if (err) {
         cb(err);
    
    }else{
        console.log("deleteid:"+JSON.stringify(result));
        cb(null, result);
    }
});
} catch (error) {
     console.log(error+"链接出错tets");
}
       
conn.end();
  
   };

//查询学校的该班级是否存在
    exports.query_Class = function(type_grade,classes,school_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select * from class_m where school_id='+school_id+' and type_grade='+type_grade+' and class="'+classes+'" and delete_status=0',function(err, result) {
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
 //查询某个学校下年级下的班级
  exports.queryType_Class = function(type_grade,school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where type_grade='+type_grade+' and school_id='+school_id+' and delete_status=0 order by index_c', function(err, result) {
     if (err) {
         cb(err);
      
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   }
 //删除年级
    exports.deleteClassAll = function(type_grade,school_id,cb) {
         conn=database.getDbCon(); 
try { 
 
  conn.query('delete  from  class_m where school_id='+school_id+' and type_grade='+type_grade+'', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
     
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//
exports.get_grade = function(type_grade,school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where type_grade='+type_grade+' and school_id='+school_id+' and delete_status=0', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//查询绑定
exports.binding_Phone_getphone = function(openid,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from binding_m where openid="'+openid+'"', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//查询student_phone
exports.query_student_phone = function(parent_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where parent_phone="'+parent_phone+'"', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//查询
exports.get_delete_status_class = function(class_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where id='+class_id+' and delete_status=0', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   //查询+班级id
exports.get_delete_status_classid = function(type_grade,class_one,school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where type_grade='+type_grade+' and class="'+class_one+'" and school_id='+school_id+' and delete_status=0', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//查询
exports.get_delete_status_school = function(school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from school_m where id='+school_id+' and delete_status=0', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//插入请求信息
exports.insert_request = function(parent_phone,school_id,cb) {
         conn=database.getDbCon();
          var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
         var usr={
             parent_phone:parent_phone,
             request_time:linux_time,
             school_id:school_id
         }
try {
  conn.query('insert into parentrequest_m set ?', usr,function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//更新请求信息
exports.update_request_time = function(id,cb) {
         conn=database.getDbCon();
           var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
         var usr={
             request_time:linux_time
         }
try {
  conn.query('update parentrequest_m set ? where id='+id+'', usr,function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   //get_parent_request
exports.get_parent_request = function(parent_phone,school_id,cb) {
         conn=database.getDbCon();
           var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
         var usr={
             request_time:linux_time
         }
try {
  conn.query('select * from  parentrequest_m   where parent_phone="'+parent_phone+'" and school_id='+school_id+'', usr,function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//插入获取经纬度
exports.getstudent_long_latitude = function(student_phone,date,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from studentposition_m where student_phone="'+student_phone+'" and createtime>="'+date+'"',function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//queryStudent
  exports.addStudent_check = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where student_phone='+phone+'', function(err, result) {
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
//查询学校最大的type
exports.get_school_maxgrade = function(school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select max(type_grade) as max_grade from class_m where school_id='+school_id+' and delete_status=0', function(err, result) {
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
//查询学校原来一年级班级的个数
exports.get_type_count = function(school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select count(*) as class_count from class_m where school_id='+school_id+' and delete_status=0 and type_grade=1', function(err, result) {
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
 //根据headermaster_id:查询id  
exports.query_headmaster_m = function(school_id,grade_type,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select id  from  teacher_m  where school_id ='+school_id+' and headmaster_class_id="'+grade_type+'"',  function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   }
 //删除年级
exports.delete_class_type = function(school_id,type_grade,cb) {
         conn=database.getDbCon(); 
try { 
 
  conn.query('update class_m set delete_status=1 where type_grade='+type_grade+' and school_id='+school_id+'', function(err, result) {
     if (err) {
         cb(err);
    
    }else{
        console.log("deleteid:"+JSON.stringify(result));
        cb(null, result);
    }
});
} catch (error) {
     console.log(error+"链接出错tets");
}
       
conn.end();
  
   };
 //根据headermaster_id:查询id  
exports.get_grade_type = function(id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select * from  teacher_m  where id='+id+'',  function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   }
//查询+学生是否存在
exports.get_student_exsit = function(student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where student_phone="'+student_phone+'"', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };

//查询+学生是否存在
exports.get_binding_yes = function(student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from binding_m where student_phone="'+student_phone+'" and delete_status=0 ', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   //查询+学生是否存在
exports.get_parent_phone = function(student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where student_phone="'+student_phone+'"', function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   // 
exports.binding_parent_phone = function(parent_phone,student_phone,openid,cb) {
         conn=database.getDbCon();
           var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
         var usr={
             parent_phone:parent_phone,
             openid:openid,
             student_phone:student_phone,
             binding_time:linux_time
         }
try {
  conn.query('insert into binding_m set ?',usr, function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };

 //根据学校id查询class_id
  exports.get_class_id = function(school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where  school_id='+school_id+' and delete_status=0', function(err, result) {
     if (err) {
         cb(err);
      
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   }
    //根据学校idtype_grade查询id
  exports.get_classid_bytype = function(type_grade,class_m,school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where  school_id='+school_id+' and delete_status=0 and type_grade='+type_grade+' and class="'+class_m+'"', function(err, result) {
     if (err) {
         cb(err);
      
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   }
 // 
exports.get_school_puch = function(school_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select * from puch_m where school_id='+school_id+' and date_sub(curdate(),interval 7 day) <= date(puch_time) order by id desc',  function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   }
    // 
exports.get_class_puch = function(school_id,class_id,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select * from puch_m where school_id='+school_id+' and class_id='+class_id+' and date_sub(curdate(),interval 7 day) <= date(puch_time) order by id desc ',  function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   }
   exports.get_query_class_puch = function(school_id,data,cb) {
         conn=database.getDbCon(); 
     var student_phone=data.student_phone;
     var puch_time=data.puch_time;
     var class_m=data.class_id;
    var student_name=data.student_name_query;
    var condition="";
    if(puch_time==""){//没做时间查询
        if(student_name!=""){
            condition+=' and date_sub(curdate(),interval 7 day) <= date(puch_time) and  student_name like "'+"%"+student_name+"%"+'"'
        }
        if(student_phone!=""){
            condition+=' and date_sub(curdate(),interval 7 day) <= date(puch_time) and  student_phone like "'+"%"+student_phone+"%"+'"';
        }
        if(class_m!=""){
            condition+=' and date_sub(curdate(),interval 7 day) <= date(puch_time) and   class_id ='+class_m+''
        }
    }else{
         if(student_name!=""){
            condition+=' and  student_name like "'+"%"+student_name+"%"+'"'
        }
        if(student_phone!=""){
            condition+=' and  student_phone like "'+"%"+student_phone+"%"+'"';
        }
        if(puch_time!=""){
            condition+=' and   puch_time like "'+"%"+puch_time+"%"+'"'
        }
        if(class_m!=""){
            condition+=' and   class_id ='+class_m+''
        }
    }
    var sql='select * from puch_m where school_id='+school_id+' and class_id='+class_m+' ' +condition+' order by id desc';
         conn=database.getDbCon(); 
try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }

    });
} catch (error) {
    console.log("链接出错3333");
}     
conn.end();
   }
 //根据student_phone
exports.get_student = function(student_phone,cb) {
         conn=database.getDbCon(); 
try { 
  conn.query('select * from student_m where student_phone='+student_phone+'',  function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错3333");
}
       
conn.end();
  
   }
 //根据student_phone
exports.get_classname = function(class_id,cb) {
        conn=database.getDbCon(); 
        //conn=database.getDbPool();
try { 
  conn.query('select type_grade,class from class_m where id='+class_id+' and delete_status=0',  function(err, result) {
     if (err) {
         cb(err);
    }else{
        cb(null, result);
    }
});
 
} catch (error) {
     console.log("链接出错3333");
}  
         conn.end(); 
   }
// 没输入学生姓名查询考勤情况
exports.query_school_student = function(school_id,data,cb) {
     var student_phone=data.student_phone;
     var puch_time=data.puch_time;
     var class_m=data.class_m;
     var student_name=data.student_name_query;
    var condition="";
        if(puch_time==""){//没做时间查询
        if(student_name!=""){
            condition+=' and date_sub(curdate(),interval 7 day) <= date(puch_time) and  student_name like "'+"%"+student_name+"%"+'"'
        }
        if(student_phone!=""){
            condition+=' and date_sub(curdate(),interval 7 day) <= date(puch_time) and  student_phone like "'+"%"+student_phone+"%"+'"';
        }
        if(class_m!=""){
            condition+=' and date_sub(curdate(),interval 7 day) <= date(puch_time) and   class_id ='+class_m+''
        }
    }else{
         if(student_name!=""){
            condition+=' and  student_name like "'+"%"+student_name+"%"+'"'
        }
        if(student_phone!=""){
            condition+=' and  student_phone like "'+"%"+student_phone+"%"+'"';
        }
        if(puch_time!=""){
            condition+=' and   puch_time like "'+"%"+puch_time+"%"+'"'
        }
        if(class_m!=""){
            condition+=' and   class_id ='+class_m+''
        }
    }
    var sql='select * from puch_m where school_id='+school_id+' '+condition+' order by id desc';
    console.log(sql);
         conn=database.getDbCon(); 
try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }

    });
} catch (error) {
    console.log("链接出错3333");
}     
conn.end();
}

 //根据student_phone 根据输入的student_name查询
exports.get_student_name = function(student_phone,student_name_query,cb) {
         conn=database.getDbCon(); 
          var sql="";

         if(student_name_query==""){
             console.log(student_name_query);
             sql='select * from student_m where student_phone='+student_phone+''+' order by id desc';
         }else{
             sql='select * from student_m where student_phone='+student_phone+' and student_name like "'+"%"+student_name_query+"%"+'"'+' order by id desc';
         }
         console.log(sql);
    try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }

    });
    
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//queryStudent
  exports.queryStudent = function(class_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where class_id='+class_id+' order by id desc', function(err, result) {
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
   
   //queryStudent
  exports.get_parent_phonebyid = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where  class_id='+id+'', function(err, result) {
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
   //queryStudent
  exports.query_parent = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where  parent_phone="'+phone+'"', function(err, result) {
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

  exports.query_teacher = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from teacher_m where  phone='+phone+'', function(err, result) {
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

 //
exports.get_studentname_byparentphone = function(parent_phone,cb) {
         conn=database.getDbCon(); 
             var sql="";
             sql='select * from student_m where parent_phone='+parent_phone+''+' order by id desc';
         console.log(sql);
    try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }

    });
    
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
 
 //
exports.insert_comment = function(data,cb) {
         conn=database.getDbCon(); 
           var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
          var photo_url_list="";
          if(data.rate.photo_url_list==""){
              photo_url_list="||";
          }else{
              photo_url_list=data.rate.photo_url_list;
          }
    var usr={
      evaluate_status:data.rate.star,
      evaluate_content:data.rate.content,   
      notice_parent_list:"data.list",
      publisher:data.rate.createPerson,
      photo_url_list:photo_url_list,
      corp_id:data.corpId,
      editTime:linux_time
    };
   
     try{
  conn.query('insert into teacher_comment_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }


   exports.insert_new = function(data,comment_id,element,cb) {
    conn=database.getDbCon(); 
    var usr={
      sender_phone:data.rate.createPerson,
      teacher_comment_id:comment_id,   
      receive_phone:element,
      corp_id:data.corpId,
      application_name:"日常表现"
    };
   
     try{
  conn.query('insert into new_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
 
//得到发布的commentid
 exports.get_new_comid = function(data,status,cb) {
    var userid=data.info.userid;
    var corpid=data.corpId;
    var application_name="日常表现";
    conn=database.getDbCon(); 
        var sql="";
        if(status=="0"){
            sql='select * from new_m where receive_phone="'+userid+'" and corp_id="'+corpid+'" and application_name="'+application_name+'" and readed_status=0'+' order by id desc';
        }else{
            sql='select * from new_m where receive_phone="'+userid+'" and corp_id="'+corpid+'" and application_name="'+application_name+'" and readed_status=1'+' order by id desc';
        }
        console.log(sql)
    try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }

    });
    
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
   //
exports.get_comment = function(id,cb) {
        conn=database.getDbCon(); 
        var sql="";
        sql='select * from teacher_comment_m where id ='+id+' order by id desc';
    try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }
   //
exports.get_published = function(userid,corpid,cb) {
        conn=database.getDbCon(); 
        var sql="";
        sql='select * from teacher_comment_m where publisher="'+userid+'" and corp_id="'+corpid+'" order by id desc';
    try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }
//
exports.get_parentinfo = function(userid,corpid,cb) {
        conn=database.getDbCon(); 
        var sql="";
        sql='select * from teacher_m where phone="'+userid+'"';
    try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }


   //queryStudent
  exports.get_student_yes = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where  student_phone="'+phone+'"', function(err, result) {
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

   //queryStudent
  exports.get_parent_yes = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where  parent_phone="'+phone+'"', function(err, result) {
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


      //queryStudent
  exports.get_teacher_yes = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from teacher_m where  phone="'+phone+'"', function(err, result) {
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



   //queryStudent
  exports.get_class_yes = function(class_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select count(*) as student_num from student_m where  class_id='+class_id+'', function(err, result) {
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
   //queryStudent
  exports.get_grade_type_byclassid = function(class_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where  id='+class_id+'', function(err, result) {
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


  exports.get_headmaster_name = function(headmaster_class_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from teacher_m where  headmaster_class_id="'+headmaster_class_id+'"', function(err, result) {
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



  exports.get_class_deletestatus = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from class_m where id='+id+' and delete_status=0', function(err, result) {
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




//初始化文件
  exports.Initialization_corp_school = function(cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from corpId_schoolId', function(err, result) {
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

//添加班级通知
exports.insert_activity = function(data,cb) {
         conn=database.getDbCon(); 
           var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
    var usr={
      title:data.activity.title,
      content:data.activity.content,   
      start_time:data.activity.beginTime,
      end_time:data.activity.endTime,
      person_incharge_list:"",
      related_person_list:"",
      draft_status:data.activity.state,
      publisher:data.activity.createPerson,
      corp_id:data.corpId,
      editTime: linux_time
    };
   
     try{
  conn.query('insert into teacher_classnotice_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//插入通知人员
  exports.insert_classnotice = function(data,classnotice_id,element,cb) {
    conn=database.getDbCon(); 
    var usr={
      sender_phone:data.activity.createPerson,
      teacher_classnotice_id:classnotice_id,   
      receive_phone:element,
      corp_id:data.corpId,
      application_name:"班级通知",
      readed_status:0
    };
   
     try{
  conn.query('insert into classnotice_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
   }

//
exports.get_classnotice = function(userid,corpid,type,cb) {
        conn=database.getDbCon(); 
        var sql="";
        if(type=="4"){//
            console.log("typetypetypetypetypetypetypetypetype:"+type);
             sql='select * from classnotice_m where receive_phone="'+userid+'"  and corp_id="'+corpid+'"  and readed_status=1 order by id desc';
        }else{
            console.log("typetypetypetypetypetypetypetypetype:"+type);            
             sql='select * from classnotice_m where receive_phone="'+userid+'"  and corp_id="'+corpid+'"  and readed_status=0  order by id desc';
        }
        console.log(sql);
         try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }

exports.get_draftactivity = function(userid,corpid,type,cb) {
        conn=database.getDbCon(); 
        var sql="";
        if(type==0){//草稿
              sql='select * from teacher_classnotice_m where publisher="'+userid+'" and draft_status=0 and corp_id="'+corpid+'" order by id desc';
        }else if(type==1){//已经发布
              sql='select * from teacher_classnotice_m where publisher="'+userid+'" and draft_status=1 and corp_id="'+corpid+'" order by id desc';
        }else{//已经关闭
              var date=new Date().toLocaleString();
              sql='select * from teacher_classnotice_m where publisher="'+userid+'" and  end_time<="'+date+'" and corp_id="'+corpid+'" order by id desc';
        }
         try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }

exports.get_draftactivity_byid = function(id,cb) {
        conn=database.getDbCon(); 
        console.log("sql+++++++"+JSON.stringify(id));
        var sql="";
            sql='select * from teacher_classnotice_m where id in ('+id+') order by id desc';
         try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }
//添加作业通知
exports.insert_homework = function(data,cb) {
         conn=database.getDbCon(); 
          var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
    var usr={
      title:data.homework.title,
      content:data.homework.content,   
      end_time:data.homework.endTime,
      parent_list:"",
      task_type:data.homework.homeworkType,
      draft_status:data.homework.state,
      publisher:data.homework.createPerson,
      corp_id:data.corpId,
      editTime: linux_time
    };
   
     try{
  conn.query('insert into teacher_homework_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//插入通知人员+homework
  exports.insert_homework_notice = function(data,homework_id,element,cb) {
    conn=database.getDbCon(); 
    var usr={
      sender_phone:data.homework.createPerson,
      teacher_homework_id:homework_id,   
      receive_phone:element,
      corp_id:data.corpId,
      application_name:"作业通知",
      readed_status:0
    };
   
     try{
  conn.query('insert into homework_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
   }

exports.get_drafthomework = function(userid,corpid,type,cb) {
        conn=database.getDbCon(); 
        var sql="";
        if(type==0){//草稿
              sql='select * from teacher_homework_m where publisher="'+userid+'" and draft_status=0 and corp_id="'+corpid+'" order by id desc';
        console.log(sql);
    }else if(type==1){//已经发布
              sql='select * from teacher_homework_m where publisher="'+userid+'" and draft_status=1 and corp_id="'+corpid+'" order by id desc';
       console.log(sql);
     }else{//已经关闭
           var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
              sql='select * from teacher_homework_m where publisher="'+userid+'" and  end_time<="'+linux_time+'" and corp_id="'+corpid+'" order by id desc';
       console.log(sql);
     }
         try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }


exports.get_homework = function(userid,corpid,type,cb) {
        conn=database.getDbCon(); 
        var sql="";
        if(type=="4"){//
            console.log("typetypetypetypetypetypetypetypetype:"+type);
             sql='select * from homework_m where receive_phone="'+userid+'"  and corp_id="'+corpid+'"  and readed_status=1 order by id desc';
        }else{
            console.log("typetypetypetypetypetypetypetypetype:"+type);            
             sql='select * from homework_m where receive_phone="'+userid+'"  and corp_id="'+corpid+'"  and readed_status=0  order by id desc';
        }
        console.log(sql);
         try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }

exports.get_drafthomework_byid = function(id,cb) {
        conn=database.getDbCon(); 
        console.log("sql+++++++"+JSON.stringify(id));
        var sql="";
            sql='select * from teacher_homework_m where id in ('+id+') order by id desc';
         try { 
    conn.query(sql, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    } 
conn.end();
   }
//添加问卷
exports.insert_questionnair = function(data,cb) {
         conn=database.getDbCon(); 
    var usr={
      title:data.info.title,
      explain:data.info.summary,   
      pic_url:"url",
      end_time:data.info.endTime,
      participant:"",
      anonymous_status:"",
      check_status:"",
      draft_status:data.info.status,
      publisher:data.info.userid,
      corp_id:data.info.corpId
    };
   
     try{
  conn.query('insert into teacher_questionnair_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }

//添加project
exports.insert_questionnair_subject = function(data,questionnair_id,cb) {
         conn=database.getDbCon(); 
         var list="";
         var index=1;
         if(data.mode<=2){
            if(data.optionList.length>0){
                data.optionList.forEach(function(element) {
                    if(data.optionList.length==1){
                        list+=element.optionName;
                    }else{
                    if(index==data.optionList.length){
                        list+=element.optionName;
                        }else{
                        list+=element.optionName+"||"
                        }
                    }
                    index++;
                } );
            }else{
                list="";
            }
         }else{
             list="";
         }
            var usr={
            questionnair_m_id:questionnair_id,
            model_type:data.mode,
            title:data.description,   
            option:list
            };
        try{
     conn.query('insert into  questionnair_subject_m set ?', usr, function(err, result) {
            if (err) {
                cb(err);
            }else{
              cb(null, result);
            }
        });
        } catch (error) {
            console.log("链接出错3333");
        }
      conn.end();
    
   }


//插入通知人员
  exports.insert_questionnair_notice = function(data,classnotice_id,element,cb) {
    conn=database.getDbCon(); 
    var usr={
      sender_phone:data.info.userid,
      teacher_questionnair_id:classnotice_id,   
      receive_phone:element,
      corp_id:data.info.corpId,
      application_name:"问卷调查",
      readed_status:0
    };
   
     try{
  conn.query('insert into questionnair_m set ?', usr, function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
   }

//插入通知人员
  exports.check_student_parent_phone = function(student_phone,class_id,type,cb) {
    conn=database.getDbCon(); 
     try{
if(type=="0"){//新增+学生校验
      conn.query('select * from student_m where student_phone="'+student_phone+'" or parent_phone="'+student_phone+'" and class_id in('+class_id+')',   function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
}else if(type=="1"){//新增+家长校验
     conn.query('select * from student_m where student_phone="'+student_phone+'"  and class_id in('+class_id+')',   function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
}else if(type=="2"){//编辑+学生校验
     conn.query('select count(*) as count from student_m where student_phone="'+student_phone+'" or parent_phone="'+student_phone+'"  and class_id in('+class_id+')',   function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
}else{//编辑+家长校验
     conn.query('select count(*) as count from student_m where student_phone="'+student_phone+'"  and class_id in('+class_id+')',   function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
}
} catch (error) {
        console.log("链接出错3333");
    }
conn.end();
   }
//添加问卷
exports.get_headmaster_m_id = function(school_id,headmaster_m_id,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select * from teacher_m where school_id='+school_id+' and headmaster_class_id="'+headmaster_m_id+'"',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }

//根据家长手机号获取学生的信息
exports.get_student_position = function(parent_phone,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select * from student_m where parent_phone="'+parent_phone+'"',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//查询位置
exports.get_position = function(student_phone,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select * from temporaryposition_m where student_phone="'+student_phone+'" order by  id desc LIMIT 1',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//日常表现  查询
exports.getcomment_m = function(id,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select * from  teacher_comment_m where id= '+id+'',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//获取家长 列表
exports.get_new_m = function(id,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select * from  new_m where teacher_comment_id= '+id+'',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//获取teacher 列表
exports.get_teacher_avatar = function(phone,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select * from  teacher_m where phone= "'+phone+'"',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//获取家长 列表
exports.getparent_avatar = function(phone,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select * from  student_m where parent_phone= "'+phone+'"',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//获取学生今日打卡信息
exports.getstudent_puch = function(student_phone,cb) {
         conn=database.getDbCon(); 
         var date=new Date();
         //var time_date=date.toLocaleTimeString();
         var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+""//+time_date;
     try{
  conn.query('select * from  puch_m where student_phone= "'+student_phone+'" and puch_time >= "'+linux_time+'"',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//获取进一周的打卡信息
exports.getstudent_allpuch = function(student_phone,time_e,cb) {
         conn=database.getDbCon(); 
     try{
  conn.query('select  a.* ,b.day_name  from  puch_m a,(select dayname("'+time_e+'") as day_name) b where student_phone= "'+student_phone+'" and puch_time like "'+"%"+time_e+"%"+'"',  function(err, result) {
        if (err) {
            cb(err);
        }else{
            cb(null, result);
        }
    });
    } catch (error) {
        console.log("链接出错3333");
    }
       
conn.end();
  
   }
//查看日常表现是否取消
  exports.findParentRate = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from teacher_comment_m where  id='+id+'', function(err, result) {
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
//查看日常表现撤销
  exports.updatecommentById = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('update teacher_comment_m set delete_status=1 where  id='+id+'', function(err, result) {
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
//查看日常表现撤销 要通知的家长
  exports.getcomment_parent = function(comment_id,cb) {
         conn=database.getDbCon();
try {
  conn.query(' select * from  new_m   where  teacher_comment_id='+comment_id+'', function(err, result) {
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
//获取appid
  exports.getAppid = function(corpId,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from corpId_schoolId where corpId="'+corpId+'"', function(err, result) {
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
//查看日常表现
  exports.get_comment_content = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from teacher_comment_m where  id='+id+' and  delete_status=0 ', function(err, result) {
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
//获取星期
  exports.get_week = function(date,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from teacher_comment_m where  id='+id+' and  delete_status=0 ', function(err, result) {
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









}).call(this);




