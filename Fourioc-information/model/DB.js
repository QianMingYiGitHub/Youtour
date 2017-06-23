var Promise = require('promise');
var class_m_sql=require('./classes_m_sql');
module.exports.dbInit = function() {//配置
 return  new  Promise(function(resolve, reject){
       class_m_sql.Initialization_corp_school(function(err,result){
            if (err) {
                return reject(err);
            }else{
               return resolve(result);
            }
    });
  });    
}
exports.findOne = function (corpId,school_role,data) {
    return new Promise(function (resolve, reject) {
       class_m_sql.query_teacher(data.userid,function(err,result){
            if (err) {
                return reject(err);
            }
            console.log("信息"+JSON.stringify(result));
            return resolve(result);
        });
    });
};