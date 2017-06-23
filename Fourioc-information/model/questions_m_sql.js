(function() {
   // var database = require('../database');
    var database = require('../dbutil/database');
    var conn=null; 
   //添加版本
    exports.add_Edition = function(data,cb) {
         conn=database.getDbCon();
try { 
  var usr={
      subject:data.subject,
      grade:data.grade,
      semester:data.semester,
      edition:data.edition
    };
  conn.query('insert into edition_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
    
    }else{
        
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//查询Edition status=0 默认1 不显示
exports.getEdition = function(cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from edition_m where status="0" ', function(err, result) {
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
   //查询Edition _teacher_phone;
exports.getEdition_In = function(phone,edition_m_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from edition_m where id in('+edition_m_id+') order by grade', function(err, result) {
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
      //查询Edition _teacher_phone;
exports.query_edition_id = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select id,eidition_m_id from eidition_teacher_m where teacher_phone="'+phone+'"', function(err, result) {
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
   
//更新当前显示版本
exports.update_Edition = function(id,cb) {
         conn=database.getDbCon();
         
try {
  conn.query('update edition_m set status="0" where id in ('+id+')', function(err, result) {
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
   //更新当前显示版本_teacher
exports.update_Edition_teacher = function(id,phone,cb) {
         conn=database.getDbCon();
         
try {
  conn.query('update eidition_teacher_m set eidition_m_id="'+id+'" where  teacher_phone="'+phone+'"', function(err, result) {
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
      //更新当前显示版本_teacher
exports.insert_teacher_phone = function(phone,cb) {
         conn=database.getDbCon();
         
try {
  conn.query('insert into eidition_teacher_m set teacher_phone="'+phone+'"', function(err, result) {
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
   //更新当前显示版本+del
exports.updatedel_Edition = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('update edition_m set status="1" where id ='+id+'', function(err, result) {
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
   //版本筛选
exports.query_Edition = function(data,eidition_m_id,cb) {
    var subject=data.subject;//可能是数组
    var grade=data.grade;//可能是数组
    var semester=data.semester; 
         conn=database.getDbCon();
try {
    if(eidition_m_id!=""){
    if(subject.length==0){//艺术为空
        conn.query('select * from edition_m where grade in ('+grade +') and semester="'+semester+'" and id not in ('+eidition_m_id+')', function(err, result) {
            if (err) {
              cb(err);
             
                   }else{
                  cb(null, result);
                 }
             });    
    }else if(grade.length==0){//年级为空
         conn.query('select * from edition_m where subject in ('+subject +') and semester="'+semester+'" and id not in ('+eidition_m_id+')', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             });   
    }else if(semester==""||semester==null){//学期为空
        conn.query('select * from edition_m where grade in ('+grade +') and subject in ('+subject +') and id not in ('+eidition_m_id+')', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(subject.length==0 && grade.length==0){//艺术为空&&年级为空
        conn.query('select * from edition_m where   semester="'+semester+'" and id not in ('+eidition_m_id+')', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(subject.length==0 && semester==""||semester==null){//艺术为空&&学期为空
        conn.query('select * from edition_m where grade in ('+grade+') and id not in ('+eidition_m_id+')', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(grade.length==0 && semester==""||semester==null){//年级为空&&学期为空
        conn.query('select * from edition_m where subject in ('+subject+') and id not in ('+eidition_m_id+')', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else{//都不为空
        console.log("subject:"+subject);
      
        //subject_re=char(39)+replace('字符串',',',char(39)+','+char(39)))+char(39);
      
        conn.query('select * from edition_m where subject in ('+subject+') and grade in ('+grade+')and semester="'+semester+'" and id not in ('+eidition_m_id+')', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                       console.log("123::"+JSON.stringify(result))
                  cb(null, result);
                 }
             }); 
    }
  
}else{
     if(subject.length==0){//艺术为空
        conn.query('select * from edition_m where grade in ('+grade +') and semester="'+semester+'"  ', function(err, result) {
            if (err) {
              cb(err);
             
                   }else{
                  cb(null, result);
                 }
             });    
    }else if(grade.length==0){//年级为空
         conn.query('select * from edition_m where subject in ('+subject +') and semester="'+semester+'" ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             });   
    }else if(semester==""||semester==null){//学期为空
        conn.query('select * from edition_m where grade in ('+grade +') and subject in ('+subject +')  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(subject.length==0 && grade.length==0){//艺术为空&&年级为空
        conn.query('select * from edition_m where   semester="'+semester+'"  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(subject.length==0 && semester==""||semester==null){//艺术为空&&学期为空
        conn.query('select * from edition_m where grade in ('+grade+')  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(grade.length==0 && semester==""||semester==null){//年级为空&&学期为空
        conn.query('select * from edition_m where subject in ('+subject+')  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else{//都不为空
        console.log("subject:"+subject);
      
        //subject_re=char(39)+replace('字符串',',',char(39)+','+char(39)))+char(39);
      
        conn.query('select * from edition_m where subject in ('+subject+') and grade in ('+grade+')and semester="'+semester+'"  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                       console.log("123::"+JSON.stringify(result))
                  cb(null, result);
                 }
             }); 
    }
}
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };

exports.query_Edition_all = function(data,eidition_m_id,cb) {
    var subject=data.subject;//可能是数组
    var grade=data.grade;//可能是数组
    var semester=data.semester; 
         conn=database.getDbCon();
try {
    
     if(subject.length==0){//艺术为空
        conn.query('select * from edition_m where grade in ('+grade +') and semester="'+semester+'"  ', function(err, result) {
            if (err) {
              cb(err);
             
                   }else{
                  cb(null, result);
                 }
             });    
    }else if(grade.length==0){//年级为空
         conn.query('select * from edition_m where subject in ('+subject +') and semester="'+semester+'" ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             });   
    }else if(semester==""||semester==null){//学期为空
        conn.query('select * from edition_m where grade in ('+grade +') and subject in ('+subject +')  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(subject.length==0 && grade.length==0){//艺术为空&&年级为空
        conn.query('select * from edition_m where   semester="'+semester+'"  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(subject.length==0 && semester==""||semester==null){//艺术为空&&学期为空
        conn.query('select * from edition_m where grade in ('+grade+')  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else if(grade.length==0 && semester==""||semester==null){//年级为空&&学期为空
        conn.query('select * from edition_m where subject in ('+subject+')  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                  cb(null, result);
                 }
             }); 
    }else{//都不为空
        console.log("subject:"+subject);
      
        //subject_re=char(39)+replace('字符串',',',char(39)+','+char(39)))+char(39);
      
        conn.query('select * from edition_m where subject in ('+subject+') and grade in ('+grade+')and semester="'+semester+'"  ', function(err, result) {
            if (err) {
              cb(err);
              console.error('error connecting: ' + err.stack);
                   }else{
                       console.log("123::"+JSON.stringify(result))
                  cb(null, result);
                 }
             }); 
}
} catch (error) {
     console.log(error.message);
}
       
conn.end();
  
   };
    //添加章节
    exports.add_Chapter = function(id,element,index_c,cb) {
         conn=database.getDbCon();
try { 
  var usr={
      edition_m_id:id,
      chapter_content:element,
      index_c:index_c
    };
  conn.query('insert into chapter_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   
    //添加课节
    exports.add_Classhour = function(id,data,index_c,cb) {
         conn=database.getDbCon();
try { 
  var usr={
      chapter_m_id:id,
      classhour_content:data,
      index_c:index_c
    };
  conn.query('insert into classhour_m set ?', usr, function(err, result) {
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
      //query_id
    exports.query_Id = function(id,cb) {
         conn=database.getDbCon();
try { 
  
  conn.query('select id from chapter_m where edition_m_id='+id+' order by index_c ',  function(err, result) {
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
  //根据id查询章节
exports.query_Chapter = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from chapter_m where edition_m_id="'+id+'"', function(err, result) {
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
     //根据id查询课节
exports.query_Classhour = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from classhour_m where chapter_m_id="'+id+'"', function(err, result) {
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
//根据课时id查询题库
exports.query_Questions = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from questions_m where classhour_m_id="'+id+'" and status=0  order by id desc', function(err, result) {
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
    //根据题库id查询题库
exports.check_Questions = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from questions_m where id="'+id+'"', function(err, result) {
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
 //添加课时id下的课题
    exports.add_Questions = function(id,data,post_phone,cb) {
         conn=database.getDbCon();
         var string_answer_list="";
         var answer_list_index=1;
         var string_answer_ok="";
         var answer_ok_index=1;
         data.answer_list.forEach(function(element){
             if(answer_list_index === data.answer_list.length){
                 string_answer_list+=element;
             }else{
                 string_answer_list+=element+",";
             }
               answer_list_index++;
         });
         data.answer_ok.forEach(function(element){
              if(answer_ok_index === data.answer_ok.length){
                 string_answer_ok+=element;
             }else{
                 string_answer_ok+=element+",";
             }
               answer_ok_index++;
         });
       
try { 
  var usr={
      classhour_m_id:id,
      title_content:data.title_content,
      type:data.type,
      answer_ok:string_answer_ok,
      analysis:data.analysis,
      knowledge_point:data.knowledge_point,
      facility_value:data.facility_value,
      score_value:data.score_value,
      answer_list:string_answer_list,
      photo_url:data.photo_url,
      status:"0",
      post_phone:post_phone
    };
  conn.query('insert into questions_m set ?', usr, function(err, result) {
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
   // 删除课题
exports.delete_Questions = function(id,cb) {
         conn=database.getDbCon();
try {
  console.log("id"+id);// 
  var sql='update questions_m  set status=1 where id="'+id+'"';
 // var sql='delete  from  questions_m where id="'+id+'"';
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
 //修改课题
    exports.modify_Questions = function(id,data,cb) {
        console.log("课题：：：："+id);
         conn=database.getDbCon();
         conn=database.getDbCon();
         var string_answer_list="";
         var answer_list_index=1;
         var string_answer_ok="";
         var answer_ok_index=1;
         data.answer_list.forEach(function(element){
             if(answer_list_index === data.answer_list.length){
                 string_answer_list+=element;
             }else{
                 string_answer_list+=element+",";
             }
               answer_list_index++;
         });
         data.answer_ok.forEach(function(element){
              if(answer_ok_index === data.answer_ok.length){
                 string_answer_ok+=element;
             }else{
                 string_answer_ok+=element+",";
             }
               answer_ok_index++;
         });
        
try { 
    //photo_url:data.url不能是空
  var usr={
      title_content:data.title_content,
      type:data.type,
      answer_ok:string_answer_ok,
      analysis:data.analysis,
      knowledge_point:data.knowledge_point,
      facility_value:data.facility_value,
      score_value:data.score_value,
      answer_list:string_answer_list, 
      photo_url:data.url
    };
  conn.query('update questions_m  set ? where id="'+id+'"', usr, function(err, result) {
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
     //根据id查询章节
exports.query_ChapterAll = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from chapter_m where edition_m_id="'+id+'" order by index_c', function(err, result) {
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
   //根据id查询课节
   exports.query_ClasshourAll = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from classhour_m where chapter_m_id="'+id+'" order by index_c', function(err, result) {
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
//添加书签
 exports.add_Bookmark = function(phone,question_id,cb) {
         conn=database.getDbCon();
try { 
    var date=new Date();
    var time_date=date.toLocaleTimeString();
    var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
  var usr={
      phone:phone,
      questions_m_id:question_id,
      createtime: linux_time
    };
  conn.query('insert into bookmark_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
          
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   //删除书签
 exports.delete_Bookmark = function(id,cb) {
         conn=database.getDbCon();
         var sql='update bookmark_m  set delete_status=1 where id in ('+id+')';
         //var sql='delete from bookmark_m where id in ('+id+')'
try { 
  conn.query(sql,  function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
          
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
      //清空书签
 exports.empty_Bookmark = function(phone,cb) {
         conn=database.getDbCon();
try { 
  conn.query('update bookmark_m  set delete_status=1 where phone='+phone+'', function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
         
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//根据题库id查询题库
exports.query_Questions_Mark = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from questions_m where id="'+id+'"', function(err, result) {
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
//根据phone查询
exports.get_Bookmark_list = function(phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select id,questions_m_id from bookmark_m where phone="'+phone+'" and delete_status=0 order by id desc', function(err, result) {
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
   //根据id查询
exports.get_Bookmark = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select id,questions_m_id from bookmark_m where id="'+id+'" and delete_status=0', function(err, result) {
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
//开始答题
 exports.update_answer_mark = function(wb_number,phone,cb) {
         conn=database.getDbCon();
try { 
  conn.query('update answer_mark_m  set answer_status=1 where wb_number="'+wb_number+'" and phone="'+phone+'"', function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
         
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   //根据wb_number查询
exports.query_wb_number = function(wb_number,phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select id from answer_mark_m where wb_number="'+wb_number+'" and answer_status=0 and phone="'+phone+'"', function(err, result) {
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
//插入wb_number
 exports.insert_wb_number = function(wb_number,phone,cb) {
         conn=database.getDbCon();
try {
      var date=new Date();
    var time_date=date.toLocaleTimeString();
    var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date; 
  var usr={
      wb_number:wb_number,
      phone:phone,
      answer_status:0,
      start_time: linux_time
    };
  conn.query('insert into answer_mark_m set ?', usr, function(err, result) {
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

//结束答题
 exports.end_Question = function(id,cb) {
         conn=database.getDbCon();
try { 
    var date=new Date();
    var time_date=date.toLocaleTimeString();
    var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
    var usr={
      answer_status:1,
      end_time: linux_time
    };
  conn.query('update answer_mark_m  set ? where id='+id+' ',usr,function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
         
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
   //查询学生是否存在
exports.query_student = function(student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where student_phone="'+student_phone+'"', function(err, result) {
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
      //查询此时白板号的答题状态
exports.query_wb_number_status = function(wb_number,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from answer_mark_m where wb_number="'+wb_number+'" and answer_status=0', function(err, result) {
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
         ///查询是否添加过该id
exports.query_record = function(answer_mark_m_id,student_name,student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from answer_student_m where answer_mark_m_id="'+answer_mark_m_id+'" and student_name="'+student_name+'" and student_phone="'+student_phone+'"', function(err, result) {
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

//插入wb_number
 exports.insert_student_answer = function(student_phone,student_name,answer_mark_m_id,answer_ok,class_id,student_id,cb) {
         conn=database.getDbCon();
try { 
  var usr={
      student_phone:student_phone,
      student_name:student_name,
      answer_mark_m_id:answer_mark_m_id,
      answer_ok:answer_ok,
      class_id: class_id,
      student_id:student_id
    };
  conn.query('insert into answer_student_m set ?', usr, function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
          
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };

   //插入wb_number
 exports.update_student_answer = function(answer_student_m_id,answer_ok,cb) {
         conn=database.getDbCon();
try { 
  conn.query('update  answer_student_m set answer_ok="'+answer_ok+'" where id='+answer_student_m_id+'', function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{
          
        cb(null, result.insertId);
    }

});
 
} catch (error) {
     console.log("链接出错");
}
       
conn.end();
  
   };
//查询所有参加答题的学生的class_id去重复
exports.query_all_class_id = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select DISTINCT class_id FROM answer_student_m where answer_mark_m_id='+id+' order by id', function(err, result) {
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
//查询所有参加答题的学生的class_id去重复
exports.all_class_person = function(class_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT count(*) as class_person,class_id FROM `student_m`  GROUP BY class_id  HAVING class_id in ('+class_id+') ', function(err, result) {
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
//查询作答人数单选
exports.post_class_person = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT count(*) as post_person ,answer_ok,answer_mark_m_id from answer_student_m group by answer_mark_m_id ,answer_ok HAVING  answer_mark_m_id='+id+'', function(err, result) {
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
   //查询作答人数单type=1
exports.post_class_person_tt = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT count(*) as post_person ,answer_ok,answer_mark_m_id from answer_student_m where  answer_mark_m_id='+id+'', function(err, result) {
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
   //修改
exports.post_class_person_one = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT count(*) as post_person,answer_ok,answer_mark_m_id from answer_student_m  GROUP by answer_ok HAVING answer_mark_m_id='+id+'', function(err, result) {
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
   
   
//查询作答人数+多选
exports.post_class_person_two = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT  answer_ok,answer_mark_m_id from answer_student_m   where  answer_mark_m_id='+id+'', function(err, result) {
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

//查询作答人数
exports.query_name_ok = function(element_class_id,id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT student_id,student_name,answer_ok FROM `answer_student_m` where class_id='+element_class_id+' and answer_mark_m_id='+id+'', function(err, result) {
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

//查询班级人数
exports.query_once_person = function(element_class_id,student_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT student_name,student_phone,id FROM student_m where class_id='+element_class_id+' and id not in('+student_id+')', function(err, result) {
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
   //查询班级人数
exports.query_all_class_person = function(element_class_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT Count(*) as all_person FROM student_m where class_id='+element_class_id+'', function(err, result) {
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

   //查询该课时下的所有问题
exports.get_question_list = function(classhour_m_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('SELECT  id  FROM questions_m where classhour_m_id='+classhour_m_id+'  and status=0  order by id desc', function(err, result) {
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

   //查看书签是否存在
 exports.query_Bookmark_Exist = function(phone,question_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from bookmark_m where phone="'+phone+'" and questions_m_id="'+question_id+'" and delete_status=1',  function(err, result) {
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
 exports.query_Bookmark_Exist0 = function(phone,question_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from bookmark_m where phone="'+phone+'" and questions_m_id="'+question_id+'" and delete_status=0',  function(err, result) {
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
 exports.query_Bookmark_Exist1_update = function(phone,question_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('update bookmark_m set delete_status=0 where phone="'+phone+'" and questions_m_id="'+question_id+'" ',  function(err, result) {
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

//撤销答题
exports.delete_student_answer = function(answer_mark_m_id,student_name,student_phone,cb) {
         conn=database.getDbCon();
try {
    conn.query(' delete * from answer_student_m where answer_mark_m_id="'+answer_mark_m_id+'" and student_name="'+student_name+'" and student_phone="'+student_phone+'" ', function(err, result) {
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
   //查询学生所在班级学生
exports.query_student_phone = function(student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where  class_id in(select class_id from student_m where student_phone="'+student_phone+'")', function(err, result) {
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
   //查询name
   exports.query_student_name = function(student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_m where  student_phone="'+student_phone+'"', function(err, result) {
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
   //查询学生班主任
exports.get_headermaster_phone = function(class_id,school_id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from teacher_m where  headmaster_class_id="'+class_id+'" and school_id='+school_id+'', function(err, result) {
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
//查询学生班主任
exports.query_type_grade = function(class_id,cb) {
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
     console.log(error.message);
}
       
conn.end();
  
   };
      //查询学生亲戚
exports.get_relative_phone = function(student_phone,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from student_relative_m where  student_phone="'+student_phone+'" and  status=0', function(err, result) {
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
   //查询版本号是否存在
exports.app_Mac = function(wb_number,cb) {
         conn=database.getDbCon();
try {
  conn.query('select * from mac_m where  wb_number='+wb_number+'', function(err, result) {
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
   //查询版本号是否存在
exports.getposition = function(id,cb) {
         conn=database.getDbCon();
try {
  conn.query('select door_position from puch_m where  id >=923 and  school_id='+id+'', function(err, result) {
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
//添加亲戚
 exports.app_AddPhone = function(student_phone,relative_name,phone,cb) {
         conn=database.getDbCon();
try { 
  var usr={
      student_phone:student_phone,
      relative_name:relative_name,
      phone:phone
    };
  conn.query('insert into student_relative_m set ?', usr, function(err, result) {
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
//删除亲戚
 exports.app_DeletePhone = function(student_phone,phone,cb) {
         conn=database.getDbCon();
try { 
   
  conn.query('update student_relative_m set status="1" where student_phone="'+student_phone+'" and phone="'+phone+'"',  function(err, result) {
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
//查询亲戚
 exports.query_relativephone = function(student_phone,phone,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from student_relative_m where status=1 and student_phone="'+student_phone+'" and phone="'+phone+'"', function(err, result) {
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
//删除亲戚2
 exports.update_relative = function(id,relative_name,cb) {
         conn=database.getDbCon();
try { 
   var usr={
       relative_name:relative_name,
       status:0
   }
  conn.query('update student_relative_m set ? where id= '+id+'',usr, function(err, result) {
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
//查询学生
 exports.get_student_classid = function(student_phone,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from student_m where student_phone="'+student_phone+'"', function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{  
        cb(null, result);
    }

});
 
} catch (error) {
     conn.rollback();
     console.log("链接出错");
}
       
conn.end();
  
   };
   //查询家长
 exports.get_parent_classid = function(parent_phone,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from student_m where parent_phone="'+parent_phone+'"', function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{  
        cb(null, result);
    }

});
 
} catch (error) {
     conn.rollback();
     console.log("链接出错");
}
       
conn.end();
  
   };
   //查询老师
 exports.get_teacher = function(teacher_phone,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from teacher_m where phone="'+teacher_phone+'"', function(err, result) {
     if (err) {
         cb(err);
      console.error('error connecting: ' + err.stack);
    }else{  
        cb(null, result);
    }

});
 
} catch (error) {
     conn.rollback();
     console.log("链接出错");
}
       
conn.end();
  
   };
//查询学校id
//查询学生
 exports.get_schoolid = function(id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from class_m where id in ('+id+') and delete_status=0 ', function(err, result) {
     if (err) {
         cb(err);
    }else{
          
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错33");
}   
conn.end();
   };
//查询学校内容
 exports.get_school_longlattude_range = function(id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from school_m where id='+id+'', function(err, result) {
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

//学生签到
 exports.puch_Student = function(student_phone,class_id,school_id,in_out,temporary,student_name,cb) {
         conn=database.getDbCon();
try { 
    var date=new Date();
    var time_date=date.toLocaleTimeString();
    var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
    var usr={
      student_phone:student_phone,
      class_id:class_id,
      school_id:school_id,
      in_out:in_out,
      puch_time:linux_time,
      door_position:temporary,
      student_name:student_name
    };
  conn.query('insert into puch_m set ?', usr, function(err, result) {
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
//查询现在的时间内某个学校学生家长的人数
 exports.get_requestmount = function(delay_time,school_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select count(*) as one_count from parentrequest_m where school_id= '+school_id+' and request_time >="'+delay_time+'"',function(err, result) {
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
//查询现在的时间内某个学校学生家长的人数
 exports.get_requestmount_two = function(delay_time,school_id,parent_phone,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select count(*) as count_m from parentrequest_m where parent_phone="'+parent_phone+'" and school_id= '+school_id+' and request_time >="'+delay_time+'"',function(err, result) {
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

//查询数据库短时间内的并发量
 exports.get_allschool_count = function(delay_time,cb) {
         conn=database.getDbCon();
          var date=new Date();
          var time_date=date.toLocaleTimeString();
          var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
          
try {
  conn.query('select count(*) as all_count from parentrequest_m where  request_time >="'+delay_time+'"',function(err, result) {
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
//查询数据库短时间内的并发量
 exports.school_count = function(cb) {
         conn=database.getDbCon();
    try {
    conn.query('select count(*) as school_count from  school_m ',function(err, result) {
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
//学生经纬度
 exports.student_Long_Lat = function(student_phone,longitude,latitude,cb) {
         conn=database.getDbCon();
try { 
     var date=new Date();
     var time_date=date.toLocaleTimeString();
     var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
  var usr={
      student_phone:student_phone,
      longitude:longitude,
      latitude:latitude,
      createtime:linux_time
    };
  conn.query('insert into studentposition_m set ?', usr, function(err, result) {
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
   //得到最新的一条经纬度记录
 exports.get_student_Long_Lat = function(student_phone,cb) {
         conn=database.getDbCon();
try { 
     var date=new Date();
     var time_date=date.toLocaleTimeString();
     var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
  conn.query('SELECT  * FROM  `studentposition_m` where  student_phone="'+student_phone+'"  ORDER BY ID DESC  limit   1', function(err, result) {
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

//跟新最新一条数据的犀利位置的时间
 exports.update_student_Long_Lat = function(id,cb) {
         conn=database.getDbCon();
     var date=new Date();
     var time_date=date.toLocaleTimeString();
     var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
try { 
  conn.query('update studentposition_m set createtime="'+linux_time+'" where id='+id+'', function(err, result) {
     if (err) {
         cb(err);
    }else{
          
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错33");
}   
conn.end();
   };
//查询学生
 exports.getbase_config = function(school_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from corpId_schoolId where schoolId='+school_id+'', function(err, result) {
     if (err) {
         cb(err);
    }else{
          
        cb(null, result);
    }

});
 
} catch (error) {
     console.log("链接出错33");
}   
conn.end();
   };

      //清空书签
 exports.get_chapter = function(classhour_m_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from classhour_m where id='+classhour_m_id+'', function(err, result) {
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
 exports.get_edition = function(classhour_m_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from chapter_m where id='+classhour_m_id+'', function(err, result) {
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
 exports.get_edition_last = function(classhour_m_id,cb) {
         conn=database.getDbCon();
try { 
  conn.query('select * from edition_m where id='+classhour_m_id+'', function(err, result) {
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
   //学生临时位置
 exports.get_student_Long_Lat_tem = function(student_phone,school_id,cb) {
         conn=database.getDbCon();
try { 
     var date=new Date();
     var time_date=date.toLocaleTimeString();
     var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
  conn.query('SELECT  * FROM  `temporaryposition_m` where  student_phone="'+student_phone+'" and school_id='+school_id+'', function(err, result) {
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
  //insert学生临时位置
 exports.insert_tempary = function(student_phone,longitude,latitude,school_id,cb) {
         conn=database.getDbCon();
try { 
     var date=new Date();
     var time_date=date.toLocaleTimeString();
     var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
     var usr={
         student_phone:student_phone,
         longitude:longitude,
         latitude:latitude,
         school_id:school_id,
         update_time:linux_time
     }
  conn.query('insert into  `temporaryposition_m` set ?',usr, function(err, result) {
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
  //update学生临时位置
 exports.update_tempary = function(id,longitude,latitude,cb) {
         conn=database.getDbCon();
try { 
     var date=new Date();
     var time_date=date.toLocaleTimeString();
     var linux_time =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time_date;
     var usr={
         longitude:longitude,
         latitude:latitude,
         update_time:linux_time
     }
  conn.query('update  temporaryposition_m set ? where id='+id+'',usr, function(err, result) {
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