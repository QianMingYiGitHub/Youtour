var util = require('util');
var Promise = require('promise');
var DB = require('../../model/DB');
var sql= require('../../model/school_m_sql');
var phones_m = require('../../model/phones_m');
var message = require('../../api/media/message');
exports.createWxUser = function(corpId,user){
    user.extattr = user.extattr || {};
    return new Promise(function(resolve, reject){
        DB.save(corpId, 'wxUser', user, function(err, data){
            if(err){
                if(err.code && err.code === 11000){//键值重复

                }else{
                    return reject(err);
                }
            }
            return resolve();
        });
    }).then(function(){
        return new Promise(function(resolve, reject){
            DB.findOne(corpId, 'wxUser', {mobile:user.mobile}, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        });
    });
};

exports.getUserByName = function(corpId, name){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'wxUser', {name:name},function(err, user){
            if(err){
                return reject(err);
            }
            return resolve(user);
        });
    });
};

exports.getUserByMobile = function(corpId, mobile){
    return new Promise(function(resolve, reject){

        // DB.findOne(corpId, 'wxUser', {mobile:mobile},function(err, user){
        //     if(err){
        //         return reject(err);
        //     }
        //     return resolve(user);
        // });
    });
};

exports.getUserByFuzzy = function(corpId, fuzzy){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'wxUser', {'$or':[{mobile:fuzzy},{userid:fuzzy},{name:fuzzy},{weixinid:fuzzy},{email:fuzzy}]},{},function(err, users){
            if(err){
                return reject(err);
            }
            return resolve(users);
        });
    });
};

exports.getUserByUserId_one = function(corpId, userid,cb){
     
        sql.get_school_username(userid,function(err,user){
            if(err){
                    cb(err);
                }else{
                    cb(null,user);
                }
            });
        // DB.findOne(corpId, 'wxUser', {userid:userid},function(err, user){
        //     if(err){
        //         return reject(err);
        //     }
        //     return resolve(user);
        // });
};
exports.getUserByUserId = function(corpId, userid){
      return new Promise(function(resolve, reject){
        sql.get_school_username(userid,function(err,user){
            if(err){
                     return reject(err);
                }else{
                   return resolve(user);
                }
            });
        // DB.findOne(corpId, 'wxUser', {userid:userid},function(err, user){
        //     if(err){
        //       
        //     }
        //     
        // });
        });
};
exports.Initialization_school_bycorpid = function(corpId){
      return new Promise(function(resolve, reject){
        sql.Initialization_school_bycorpid(corpId,function(err,user){
            if(err){
                     return reject(err);
                }else{
                   return resolve(user);
                }
            });
        });
};
exports.Initialization_avatar_byuserid = function(userid){
      return new Promise(function(resolve, reject){
          //查询是或否是  学生  老师  家长  三个身份  
          sql.get_parent_yes(userid,function(err,result){//看是否是  家长
              if(err){
                  return reject(err);
              }else{
                  if(result==""||result==null){
                       sql.get_teacher_yes(userid,function(err,result){//看是否是  老师
                            if(err){
                                return reject(err);
                            }else{
                                if(result==""||result==null){
                                     sql.get_student_yes(userid,function(err,result){//看是否是  学生
                                        if(err){
                                            return reject(err);
                                        }else{
                                            if(result==""||result==null){
                                              
                                            }else{
                                                var student_id="";
                                                result.map(function(elem){
                                                    student_id=elem.id;
                                                });
                                                var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
                                                phones_m.getbase_config(userid,function(err,result){
                                                    if(err){
                                                         return reject(err.message);
                                                    }else{
                                                        if(result==""||result==null){
                                                             return reject(err);
                                                        }else{
                                                            result.map(function(elem){
                                                                base_config.token=elem.token;
                                                                base_config.encodingAESKey=elem.encodingAESKey;
                                                                base_config.corpId=elem.corpId;
                                                                base_config.agentid=elem.studentsaveapp_id;
                                                                base_config.secret=elem.secret;
                                                            });
                                                            message.get_user(userid,base_config,function(err,result_message){
                                                            if(err){
                                                               console.log("服务器错误");
                                                            }else{
                                                            // phones_m.analys_Questions();
                                                                console.log(student_id);
                                                                console.log("avatar::"+result_message.avatar+"0")
                                                                var student_avatar=result_message.avatar+"0";
                                                                sql.update_avatar_student(student_id,student_avatar,function(err,result){
                                                                    if(err){
                                                                        console.log("失败");
                                                                    }else{
                                                                        console.log("成功");
                                                                    }
                                                                });
                                                            }
                                                        })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }else{//是老师
                                    var teacher_id="";
                                    result.map(function(elem){
                                        teacher_id=elem.id;
                                    });
                                    var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
                                    phones_m.getbase_config_teacher(userid,function(err,result){
                                        if(err){
                                             console.log(err)
                                        }else{
                                            if(result==""||result==null){
                                               console.log("对不起没有查询到你所在学校的信息，请联系学校管理员");  
                                            }else{
                                                result.map(function(elem){
                                                    base_config.token=elem.token;
                                                    base_config.encodingAESKey=elem.encodingAESKey;
                                                    base_config.corpId=elem.corpId;
                                                    base_config.agentid=elem.studentsaveapp_id;
                                                    base_config.secret=elem.secret;
                                                });
                                            //
                                                message.get_user(userid,base_config,function(err,result_message){
                                                if(err){
                                                    console.log("服务器错误");
                                                }else{
                                                // phones_m.analys_Questions();
                                                    console.log(teacher_id);
                                                    console.log("avatar::"+result_message.avatar+"0")
                                                    var teacher_avatar=result_message.avatar+"0";
                                                    sql.update_avatar_teacher(teacher_id,teacher_avatar,function(err,result){
                                                        if(err){
                                                            console.log("失败");
                                                        }else{
                                                            console.log("成功");
                                                        }
                                                    });
                                                }
                                            })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                  }else{//是家长
                      //是不是老师 
                       sql.get_teacher_yes(userid,function(err,result){//看是否是  老师
                            if(err){
                                return reject(err);
                            }else{
                                if(result==null||result==""){
                                var student_id="";
                                result.map(function(elem){
                                    student_id=elem.id;
                                });
                                var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
                                phones_m.getbase_config_parent(userid,function(err,result){
                                    if(err){
                                        res.json({success:-1,desc:err.message,data:{}})
                                    }else{
                                        if(result==""||result==null){
                                             console.log("对不起没有查询到你所在学校的信息，请联系学校管理员");
                                        }else{
                                            result.map(function(elem){
                                                base_config.token=elem.token;
                                                base_config.encodingAESKey=elem.encodingAESKey;
                                                base_config.corpId=elem.corpId;
                                                base_config.agentid=elem.studentsaveapp_id;
                                                base_config.secret=elem.secret;
                                            });
                                        //
                                            message.get_user(userid,base_config,function(err,result_message){
                                            if(err){
                                                console.log("服务器错误");
                                            }else{
                                            // phones_m.analys_Questions();
                                                console.log(student_id);
                                                console.log("avatar::"+result_message.avatar+"0")
                                                var parent_avatar=result_message.avatar+"0";
                                                sql.update_avatar_parent(student_id,parent_avatar,function(err,result){
                                                    if(err){
                                                        console.log("失败");
                                                    }else{
                                                        console.log("成功");
                                                    }
                                                });
                                            }
                                        })
                                        }
                                    }
                                })
                                }else{
                                 var teacher_id="";
                                    result.map(function(elem){
                                        teacher_id=elem.id;
                                    });
                                    var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
                                    phones_m.getbase_config_teacher(userid,function(err,result){
                                        if(err){
                                            console.log("服务器错误");
                                        }else{
                                            if(result==""||result==null){
                                                 console.log("对不起没有查询到你所在学校的信息，请联系学校管理员");
                                            }else{
                                                result.map(function(elem){
                                                    base_config.token=elem.token;
                                                    base_config.encodingAESKey=elem.encodingAESKey;
                                                    base_config.corpId=elem.corpId;
                                                    base_config.agentid=elem.studentsaveapp_id;
                                                    base_config.secret=elem.secret;
                                                });
                                            //
                                                message.get_user(userid,base_config,function(err,result_message){
                                                if(err){
                                                    console.log("服务器错误");
                                                }else{
                                                // phones_m.analys_Questions();
                                                    console.log(teacher_id);
                                                    console.log("avatar::"+result_message.avatar+"0")
                                                    var teacher_avatar=result_message.avatar+"0";
                                                    sql.update_avatar_teacher(teacher_id,teacher_avatar,function(err,result){
                                                        if(err){
                                                            console.log("失败");
                                                        }else{
                                                            console.log("成功");
                                                        }
                                                    });
                                                }
                                            })
                                            }
                                        }
                                    }) 
                                }
                            }
                       });
                  }
              }
          })
    });
};
exports.updateUser = function(corpId, user){
    return new Promise(function(resolve, reject){
        DB.update(corpId, 'wxUser', {userid:user.userid},{'$set':user},function(err){
            if(err){
                return reject(err);
            }
            resolve();
        });
    });
};

exports.getAllUser = function(corpId){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'wxUser', {},{},function(err, users){
            if(err){
                return reject(err);
            }
            return resolve(users);
        });
    });
};
