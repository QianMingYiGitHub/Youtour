(function() {
   // var database = require('../database');
    var database = require('../dbutil/database');
    var conn=null; 
   //添加学校
    exports.add_school = function(data,cb) {
     conn=database.getDbCon();
      var all_tude=data.long_latitude_range;//[{longitude:111,latitude:11.1},{longitude:222,latitude:22.2},{longitude:333,latitude:33.3},{longitude:444,latitude:44.4}]
      var string_ll="";
      var index=1;
        if(all_tude.length>0){
            all_tude.forEach(function(every_array){
            if(index==all_tude.length){
                string_ll+=every_array.longitude+","+every_array.latitude
            }else{
                string_ll+=every_array.longitude+","+every_array.latitude+"||"
            }
        index++;
        });
        }else{
            string_ll="||";
        }   
    try { 
        var usr={
            school_name:data.school_name,
            school_position:data.school_position,
            long_latitude_range:string_ll
            };
        conn.query('insert into school_m set ?', usr, function(err, result) {
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
  //添加学校角色
    exports.add_schoolrole = function(data,cb) {
      conn=database.getDbCon();
    try { 
        var usr={
            username:data.phone,
            role:"admin",
            };
        conn.query('insert into schooluser_role_m set ?', usr, function(err, result) {
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
  //添加学校用户
    exports.add_schooluser = function(school_id,data,cb) {
      conn=database.getDbCon();
    try { 
        var usr={
            username:data.phone,
            name:data.name,
            password:"123456",//默认
            school_m_id:school_id
            };
        conn.query('insert into schooluser_m set ?', usr, function(err, result) {
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
//编辑学校
exports.modify_school = function(school_id,data,cb) {
      conn=database.getDbCon();
      var all_tude=data.long_latitude_range;
      var index=1;
        if(all_tude.length>0){
            var string_ll="";
            all_tude.forEach(function(every_array){
            if(index==all_tude.length){
                string_ll+=every_array.longitude+","+every_array.latitude
            }else{
                string_ll+=every_array.longitude+","+every_array.latitude+"||"
            }
        index++;
        });
        }  
    try { 
        if(all_tude.length>0){
            var usr={
            school_name:data.school_name,
            school_position:data.school_position,
            long_latitude_range:string_ll
            };
        conn.query('update school_m set ? where id='+school_id+'', usr, function(err, result) {
            if (err) {
                cb(err);
            
            }else{
                cb(null, result);
            }

        });
        }else{
            var usr={
            school_name:data.school_name,
            school_position:data.school_position,
            };
        conn.query('update school_m set ? where id='+school_id+'', usr, function(err, result) {
            if (err) {
                cb(err);
            
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
//编辑学校+经纬度
exports.modify_school_Long_latitude = function(school_id,data,cb) {
      conn=database.getDbCon();
      var all_tude=data.long_latitude_range;
      var string_ll="";
      var index=1;
        if(all_tude.length>0){
            all_tude.forEach(function(every_array){
            if(index==all_tude.length){
                string_ll+=every_array.longitude+","+every_array.latitude
            }else{
                string_ll+=every_array.longitude+","+every_array.latitude+"||"
            }
        index++;
        });
        }else{
            string_ll="||";
        }   
        console.log(string_ll);
    try { 
       var usr={
            long_latitude_range:string_ll
            };
        conn.query('update school_m set ? where id='+school_id+'', usr, function(err, result) {
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
  //跟新学校用户信息
    exports.modify_school_user = function(school_id,data,cb) {
      conn=database.getDbCon();
    try { 
        var usr={
            name:data.name,
            username:data.phone
            };
        conn.query('update schooluser_m set ? where school_m_id='+school_id+'', usr, function(err, result) {
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
  //删除学校
exports.delete_school = function(school_id,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('update school_m set delete_status=1 where id='+school_id+'', function(err, result) {
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
  //删除学校用户
exports.delete_school_user = function(school_id,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('delete from schooluser_m  where school_m_id='+school_id+'',  function(err, result) {
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
//获取所有学校信息
exports.get_school = function(cb) {
      conn=database.getDbCon();
    try { 
        conn.query(' select * from school_m where delete_status=0 order by id desc', function(err, result) {
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
//获取学校id下的信息
exports.get_school_username = function(id,cb) {
      conn=database.getDbCon();
    try { 
        conn.query(' select * from schooluser_m where  school_m_id='+id+'', function(err, result) {
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
//条件查询学校信息
exports.get_school_query = function(data,cb) {
      conn=database.getDbCon();
      var condition="";
      console.log(JSON.stringify(data));
      var school_position=data.school_position;
      var school_name=data.school_name;
      if(school_name!=""||school_name!="undefined"){
          condition+=' and school_name like "'+"%"+school_name+"%"+'"';
        }
      if(school_position!=""){
          condition+=' and school_position like "'+"%"+school_position+"%"+'"';
        }
        console.log(condition);
      var sql="select * from school_m where delete_status=0 "+condition+" order by id desc";
    try { 
        conn.query(sql, function(err, result) {
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
//回滚机制测试
//获取学校id下的信息
exports.roll_back = function(cb) {
     conn=database.getDbCon();
    // pool=database.getDbPool();
    //   var  a=[[1,3,5,7],[9,11,13,15],[17,19,21,23]]
    //   console.log(JSON.stringify(a[0][0]));
    //   console.log(conn)
    //   pool.getConnection(function(err,conn){
    //         if(err){
    //             console.log(err);
    //         }else{
    //             console.log("连接池测试");
    //             try {
    //                 conn.query("select * from user_m where id=1",function(err,rows){
    //                 if(err){
    //                     console.log(err);
    //                 }else{
    //                     cb(null,rows);
    //                     console.log("连接池测试"+JSON.stringify(rows));
    //                     conn.release();
    //                 }
    //             });     
    //         } catch (error) {
    //             console.log("链接错误");
    //             }   
    //         }
    //     });
      var school_id="";
    try { 
        conn.query('select school_id from class_m where id='+1+'' , function(err, result_one) {
            if (err) {
                cb(err);
            }else{
                result_one.map(function(elem){
                    school_id=elem.school_id;
                })
                console.log(JSON.stringify(school_id));
                conn.query('select  *  from school_m where id='+school_id+'', function(err, result) {
                      if(err){
                          cb(err);
                      }else{
                          cb(null,result) 
                      }
                  });

            }
        });
    } catch (error) {
        console.log("链接错误");
        conn.rollback();
  } finally{
      //conn.end();
  }
};
//根据学校id获取经纬度
exports.get_school_query_byid = function(id,cb) {
      conn=database.getDbCon();
    try { 
        conn.query(' select * from school_m where  id='+id+'', function(err, result) {
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
//绑定school——id下的所有信息
exports.Initialization_school_bycorpid = function(corpId,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('select * from corpId_schoolId where corpId="'+corpId+'"', function(err, result) {
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
//查询是不是家长
exports.get_parent_yes = function(userid,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('select * from  student_m where parent_phone="'+userid+'"', function(err, result) {
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





//查询是不是 老师 
exports.get_teacher_yes = function(userid,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('select * from  teacher_m where phone="'+userid+'"', function(err, result) {
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
//查询是不是    学生
exports.get_student_yes = function(userid,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('select * from  student_m where student_phone="'+userid+'"', function(err, result) {
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
//update_avatar
exports.update_avatar_parent = function(id,parent_avatar,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('update student_m set parent_avatar="'+parent_avatar+'" where id='+id+'', function(err, result) {
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
//update_avatar
exports.update_avatar_student = function(id,student_avatar,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('update student_m set student_avatar="'+student_avatar+'" where id='+id+'', function(err, result) {
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
//update_avatar_teacher
exports.update_avatar_teacher = function(id,teacher_avatar,cb) {
      conn=database.getDbCon();
    try { 
        conn.query('update teacher_m set teacher_avatar="'+teacher_avatar+'" where id='+id+'', function(err, result) {
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






}).call(this);