var Promise = require('promise');
var school_m_sql = require('./school_m_sql');
/**
 * 表结构  
 */
//添加学校
module.exports.add_School = function(data,cb) {
    school_m_sql.add_school(data,function(err,result_id){
        if(err){
            cb(err);
        }else{
            //添加用户
            school_m_sql.add_schooluser(result_id,data,function(err,result){
                if(err){
                    cb(err);
                }else{
                    //添加学校用户成功
                    school_m_sql.add_schoolrole(data,function(err,result){
                        if(err){
                            cb(err);
                        }else{
                            cb(null,result);
                        }
                    });
                }
            });
        }
    });
}
//修改学校
module.exports.modify_School = function(id,data,cb) {
    school_m_sql.modify_school(id,data,function(err,result){//修改学校基础信息
        if(err){
            cb(err);
        }else{
            school_m_sql.modify_school_user(id,data,function(err,result){//更新学校用户名和密码
                if(err){
                    cb(err);
                }else{
                    cb(null,result);
                }
            });
        }
    });
}
//修改学校+经纬度
module.exports.modify_school_Long_latitude = function(id,data,cb) {
    school_m_sql.modify_school_Long_latitude(id,data,function(err,result){//修改学校基础信息
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
//删除学校
module.exports.delete_School = function(id,cb) {
    school_m_sql.delete_school(id,function(err,result){//修改学校基础信息
        if(err){
            cb(err);
        }else{
            school_m_sql.delete_school_user(id,function(err,result){//更新学校用户名和密码
                if(err){
                    cb(err);
                }else{
                    cb(null,result);
                }
            });
        }
    });
}
//获取学校列表
module.exports.get_Schoollist = function(cb) {
    var data_all=[];
    var split_one=[];
    var index_one=1;
    var index_two=1;
    school_m_sql.get_school(function(err,result_array){//修改学校基础信息
        if(err){
            cb(err);
        }else{
            if(result_array==""||result_array==null){
                cb(null,result_array);
            }else{
                result_array.forEach(function(element) {
                    var data={id:"",school_name:"",school_position:"",long_latitude_range:[],username:"",name:""};
                    school_m_sql.get_school_username(element.id,function(err,result){
                        if(err){
                            cb(err);
                        }else{
                            result.map(function(elem_map){
                                data.username=elem_map.username;
                                data.name=elem_map.name;
                            });
                            data.id=element.id;
                            data.school_name=element.school_name;
                            data.school_position=element.school_position;
                          
                            var split_ll_t=element.long_latitude_range;//每次从头开始
                            var split_ll=split_ll_t.split("||")
                            split_ll.forEach(function(elem){
                                var array={longitude:"",latitude:""};
                                array.longitude=elem.split(",")[0];
                                array.latitude=elem.split(",")[1];
                                split_one.push(array);
                                   console.log("2:"+index_one);
                                if(index_one==split_ll.length){
                                    data.long_latitude_range=split_one;
                                    data_all.push(data);
                                    split_one=[];//重置数组
                                    index_one=0;//重新计数
                                }
                                index_one++;
                            });
                              console.log("index_two2:"+index_two);
                            if(index_two==result_array.length){
                                data_all.sort(Sort('id'));
                                cb(null,data_all);
                            }
                            index_two++;
                        }
                        
                    });
                });
            }
        }
    });
}
//条件查询学校
module.exports.query_Schoollist = function(data,cb) {
    var data_all=[];
    var split_one=[];
    var index_one=1;
    var index_two=1;
    school_m_sql.get_school_query(data,function(err,result_array){//修改学校基础信息
        if(err){
            cb(err);
        }else{
            if(result_array==""||result_array==null){
                cb(null,result_array);
            }else{
                result_array.forEach(function(element) {
                    var data={id:"",school_name:"",school_position:"",long_latitude_range:[],username:"",name:""};
                    school_m_sql.get_school_username(element.id,function(err,result){
                        if(err){
                            cb(err);
                        }else{
                            result.map(function(elem_map){
                                data.username=elem_map.username;
                                data.name=elem_map.name;
                            });
                            data.id=element.id;
                            data.school_name=element.school_name;
                            data.school_position=element.school_position;
                            var split_ll_t=element.long_latitude_range;//每次从头开始
                            var split_ll=split_ll_t.split("||")
                            split_ll.forEach(function(elem){
                                var array={longitude:"",latitude:""};
                                array.longitude=elem.split(",")[0];
                                array.latitude=elem.split(",")[1];
                                split_one.push(array);
                                if(index_one==split_ll.length){
                                    data.long_latitude_range=split_one;
                                    data_all.push(data);
                                    split_one=[];//重置数组
                                    index_one=0;//重新计数
                                }
                                index_one++;
                            });
                            if(index_two==result_array.length){
                                console.log("finall："+JSON.stringify(data_all));
                                cb(null,data_all);
                            }
                            index_two++;
                        }
                    });
                });
            }
        }
    });
}
//回滚机制测试
module.exports.roll_Back = function(cb) {
    school_m_sql.roll_back(function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    });
}
//正序 
function Sort(data){
    return function(a,b){
        var value1 = a[data];
        var value2 = b[data];
        return value2 - value1;
    }
 }
 //根据学校id查询数据
module.exports.get_school_Long_latitude = function(id,cb) {
    var data_all=[];
    var split_one=[];
    var index_one=1;
    var index_two=1;
    var long_latitude="";
    school_m_sql.get_school_query_byid(id,function(err,result_array){//修改学校基础信息
        if(err){
            cb(err);
        }else{
            if(result_array==""||result_array==null){
                cb(null,result_array);
            }else{
                result_array.map(function(element){
                    long_latitude=element.long_latitude_range;
                });
                var data={id:id,long_latitude_range:[]};
                var split_ll=long_latitude.split("||");
                split_ll.forEach(function(elem){
                    var array={longitude:"",latitude:""};
                    array.longitude=elem.split(",")[0];
                    array.latitude=elem.split(",")[1];
                    split_one.push(array);
                    if(index_one==split_ll.length){
                        data.long_latitude_range=split_one;
                        cb(null,data);
                        // split_one=[];//重置数组
                        // index_one=0;//重新计数
                    }
                    index_one++;
                });
            }
        }
    });
}