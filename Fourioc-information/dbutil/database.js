(function() {
    var client, mysql, settings;

    settings = require('./settings');

    client = null;

    mysql = require('mysql');
  
  exports.getDbCon = function getDbCon() {
        try {
        var mysql = require('mysql');
        var conn="";
        if(settings.status=="0"){
             conn = mysql.createConnection(settings.db_l); //本地测试
        }else{
             conn = mysql.createConnection(settings.db_p); //外网测试
        }
        conn.connect(function (err) {//连接错误，10秒重试
        if (err) {
             console.log('error when connecting to db:', err);
             setTimeout(handleError , 10000);//设置十秒后重连
            }
        });
        conn.on('error', function (err) {
            console.log('db error', err);
            // 如果是连接断开，自动重新连接
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                handleError();
            } else {
                throw err;
            }
        });
          function handleError (err) { 
            if (err) {  
                // 如果是连接断开，自动重新连接  
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {  
                getDbCon();
                } else {  
                console.error(err.stack || err);  
                }  
            }  
         }     
        } catch (error) {
          console.log("数据库链接失败");  
        }finally{
             return conn;
        }
    };
//关闭数据库
exports.DbClose = function(conn) {
    conn
     //数据库Close
     try {
        console.log("关闭数据库:"+JSON.stringify(conn));
        conn.end();
        //conn.release();
     } catch (error) {
        console.log("error:数据库关闭:"+error);
     }
   };
exports.getDbPool = function getDbPool() {//连接池+测试
       var mysql = require('mysql');  
       var pool = mysql.createPool(settings.db_l);  
        pool.getConnection(function(err,connection) {  
            if(err) {  
                console.log("建立连接失败");  
            }else{  
                console.log("建立连接成功");  
                connection.query('select type_grade,class from class_m where id=1 and delete_status=0',function(err,rows) {  
                if(err) {  
                    console.log("查询失败");  
                }else{  
                    console.log(rows);                 
                }  
                console.log(pool._allConnections.length);//0      
            });   
            }  
            pool.end();  
        }) 
        return pool;
  }

}).call(this);




