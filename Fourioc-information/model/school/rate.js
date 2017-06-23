var util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
var classes_m_sql = require('../classes_m_sql');
var DB = require('../../model/DB');
// var teacherRateModel = [];
// var getTeacherRateModel = function(corpId){
//     var key = corpId + '.teacher_Rate';
//     if(util.isNullOrUndefined(teacherRateModel[key])){
//         teacherRateModel[key] = db.createModel(key,{
//             createPerson:String,
//             star:Number,
//             content:String,//文本内容
//             voice:[String],//语音id
//             parent:[{id:String,sid:String}],//家长
//             createTime:{type:Date,default:Date.now},
//             state:Number,//状态，1.已发布，2.已撤销,-1.已删除
//             editTime:{type:Date}
//         });
//     }
//     return teacherRateModel[key];
// }

// var parentRateModel = [];
// var getParenRateModel = function(corpId){
//     var key = corpId + '.parent_Rate';
//     if(util.isNullOrUndefined(parentRateModel[key])){
//         parentRateModel[key] = db.createModel(key,{
//             rateId:String,//评语id
//             id:String,//家长id
//             sid:String,//学生id
//             state:Number//状态，0.未阅，1.已阅,2.已撤销，-1.已删除
//         });
//     }
//     return parentRateModel[key];
// }

exports.saveRate = function(corpId, rate){
    var model = Object.assign({},rate);
    if(util.isNullOrUndefined(model.id) === false){
        delete model.id;
    }
    return new Promise(function(resolve, reject){
        if(util.isNullOrUndefined(rate.id) || rate.id === ''){
            //这里做存储
            DB.save(corpId,'teacher_Rate',model, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        }else{

            DB.updateById(corpId,'teacher_Rate',rate.id,{'$set':model}, function(err,data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        }
    });
};

exports.cancelRate = function(corpId, rateId){
    // var rateModel = getTeacherRateModel(corpId);
    return new Promise(function(resolve, reject){
        classes_m_sql.get_comment_content(rateId,function(err,result){
            if(err){
                 return reject(err);
            }else{
                 if(result==null||result==""){
                      return resolve("1");
                 }else{
                 var data={teacherName:"",content:""}
                    var teacher_phone="";
                    result.map(function(elem){
                        data.content=elem.evaluate_content;
                        teacher_phone=elem.publisher;
                    })
                 classes_m_sql.updatecommentById(rateId,function(err,result){
                    if(err){
                        return reject(err)
                    }else{
                            classes_m_sql.get_teacher_avatar(teacher_phone,function(err,result){
                                if(err){
                                    return reject(err)
                                }else{
                                    if(result==""||result==null){
                                        return  resolve("2");
                                    }else{
                                        result.map(function(elem){
                                            data.teacherName=elem.teacher_name;
                                        });
                                        return resolve(data);
                                    }
                                }
                            })
                        }
                  })
               }
            }
        })
    })
};
//根据corp获取日常表现appid
exports.getAppid = function(corpId){
    // var rateModel = getTeacherRateModel(corpId);
    return new Promise(function(resolve, reject){
        classes_m_sql.getAppid(corpId,function(err,result){
            if(err){
                 return reject(err);
            }else{
                if(result==""||result==null){
                    return resolve(result);
                }else{
                    var appid="";
                    result.map(function(elem){
                        appid=elem.performanceapp_id;
                    })
                    return resolve(appid);
                }
            }
        })
    })
};

exports.deleteTeacherRate = function(corpId,rateId, userid){
    var query = {_id:rateId, createPerson:userid};
    return new Promise(function(resolve, reject){
        DB.update(corpId,'teacher_Rate',query, {'$set':{state:-1}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.deleteParentRate = function(corpId, userid, sid, rateId){
    var query = {id:userid,sid:sid,rateId:rateId};
    return new Promise(function(resolve, reject){
        DB.update(corpId,'parent_Rate',query, {'$set':{state:-1}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.findRateInfobyId = function(corpId, rateId){
    return new Promise(function(resolve, reject){
        classes_m_sql.getcomment_parent(rateId,function(err,result){
            if(err){
                 return reject(err);
            }else{
                if(result==""||result==null){
                    return resolve(result);
                }else{
                    var data=[]
                    result.map(function(elem){

                    })
                  return resolve();
                }
            }
        })
    })
};

exports.createParentRate = function(corpId, rate){
    return new Promise(function(resolve, reject){
        DB.save(corpId,'parent_Rate',rate,function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.parentRateUpdateState = function(corpId, rateId, userid, sid, state){
    return new Promise(function(resolve, reject){
        DB.update(corpId,'parent_Rate',{rateId:rateId,userid:userid,sid:sid},{'$set':{state:state}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};


exports.parentRateChangeState = function(corpId, rateId, oldstate,newstate){
    return new Promise(function(resolve, reject){
        DB.update(corpId,'parent_Rate',{rateId:rateId,state:{'$in':oldstate}},{'$set':{state:newstate}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.findTeacherRateByCreatorAndState = function(corpId, creator, state){
    var tmpstate = [];
    console.log(typeof(state));
    if(util.isArray(state)){
        state.forEach(function(data){
            tmpstate.push(data);
        });
    }else if(typeof(state) == 'number'){
        tmpstate.push(state);
    }
    return new Promise(function(resolve, reject){
        DB.find(corpId,'teacher_Rate',{createPerson:creator, state:{'$in':tmpstate}}, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.parentRateUnreadToReaded = function(corpId, userid, sid, rateId){
    return new Promise(function(resolve, reject){
        DB.update(corpId,'parent_Rate',{rateId:rateId, id:userid, sid:sid, state:0}, {'$set':{state:1}}, function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.findParentRate = function(corpId, userid, sid, rateId) {
    return new Promise(function(resolve, reject){
        DB.findOne(corpId,'parent_Rate',{rateId:rateId, id:userid, sid:sid}, function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.findParentRateByUserAndState = function(corpId, person, state){
    var query = {id:person, state:{'$in':state}};
    return new Promise(function(resolve, reject){
        DB.find(corpId,'parent_Rate',query, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};
exports.findParentRateByState = function(corpId, state){
    var query = {state:{'$in':state}};
    return new Promise(function(resolve, reject){
        DB.find(corpId,'parent_Rate',query, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
//新接口
function getRateById(rateId) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'rate').findOne({_id:rateId}).populate('createPerson').populate('parent').exec(function(err, result){
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

function getTeacherRates(condition) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'rate').find(condition).populate('createPerson').populate('parent').exec(function(err, results){
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}

function getParentRate(condition) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'rate_user').findOne(condition).populate('parent').populate('rate').exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
}



function getParentRates(condition) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'rate_user').find(condition).populate('parent').populate('rate').exec(function(err, results){
            if(err){
                return reject(err);
            }
            DB.getConnection('', 'user').populate(results, 'rate.createPerson', function(err, results){
                if(err){
                    return reject(err);
                }
                return resolve(results);
            });
        });
    });
}

function updateRateById(rateId, rate) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'rate').findOneAndUpdate({_id:rateId}, rate, {new: true}).populate('parent').populate('createPerson').exec(function(err, result){
            if(err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

function updateParentRate(conditon, update) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('','rate_user').findOneAndUpdate(conditon, update, {new:true}).populate('rate').populate('parent').exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        }); 
    }); 
}

exports.updateTeacherRateState = function(rateId, state) {
    return updateRateById(rateId, {'$set':{state: state}});
};

exports.saveRateOfTeacher = function(corpId, rate) {
    return new Promise(function(resolve, reject){
        if(util.isNullOrUndefined(rate.id) || rate.id === ''){
            DB.getConnection('','rate').create(rate, function(err, result) {
                if(err){
                    return reject(err);
                }
                var opts = [
                    {
                        path:'parent'
                    },
                    {
                        path:'createPerson'
                    }
                ];
                DB.getConnection('','user').populate(result, opts, function(err, result){
                    if(err){
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
        }else{
            return getRateById(rate.id).then(function(result){
                switch(result.state) {
                case 0://草稿状态
                    return updateRateById(rate.id, rate);
                case 1://已发布
                    if(rate.state !== 2 && rate.state !== -1) {
                        return reject(new Error('无效操作'));
                    }else{
                        return updateRateById(rate.id, rate);
                    }
                case 2://已撤销
                    if(rate.state !== -1) {
                        return reject(new Error('无效操作'));
                    }else{
                        return updateRateById(rate.id, rate);
                    }
                case -1://已删除
                default:
                    return reject(new Error('无效操作'));
                }
            }).then(function(result){
                return resolve(result);
            }).catch(function(err){
                return reject(err);
            });
        }
    });
};

exports.updateParentRateState = function(parentId, rateId, state){
    return updateParentRate({parent:parentId, rate: rateId}, {'$set':{state:state}});
};

exports.saveRateOfParent = function(parentid,rateid) {
    return getParentRate({parent:parentid, rate: rateid}).then(function(result){
        if(result){
            return Promise.reject(new Error('该记录已存在，无法重复创建'));
        }
        return new Promise(function(resolve, reject) {
            DB.getConnection('','rate_user').create({parent:parentid, rate: rateid, state:0}, function(err, result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            });
        });
    });
};

exports.parentReadRate = function(parentid,rateid) {
    return getParentRate({parent:parentid, rate: rateid}).then(function(result){
        if(util.isNullOrUndefined(result)){
            return Promise.reject(new Error('该记录不存在'));
        }else{
            if(result.state === 0) {
                return updateParentRate({parent:parentid, rate: rateid}, {'$set': {state: 1}});
            }else{
                return Promise.resolve(result);
            }
        }
    });
};

exports.getTeacherRate = function(rateId) {
    return getRateById(rateId);
};

exports.getAllRateOfTeacher = function(userid, state) {
    return getTeacherRates({createPerson: userid, state: state});
};

exports.getAllRateOfParent = function(userid, state) {
    return getParentRates({parent:userid, state: state});
};

exports.getParentRates = function(condition) {
    return getParentRates(condition);
};

exports.getParentRate = function(userid, rateid) {
    return getParentRate({parent:userid, rate:rateid});
};

//获取日常表现的具体信息
exports.getcomment = function(id,userid,cb){
    var tmp = {creator:{},rate:{parent:[]}};
            classes_m_sql.getcomment_m(id,function(err,result){
                    if(err){
                            cb(err);
                        }else{
                                var teacher_phone="";
                            result.map(function(element){
                                teacher_phone=element.publisher;
                                tmp.creator.id=teacher_phone;
                                tmp.rate.star = element.evaluate_status;//星级评价
                                console.log("星级评价：：：：："+element.evaluate_status);
                                tmp.rate.content = element.evaluate_content//内容
                                tmp.rate.editTime =element.editTime;
                                if(element.photo_url_list=="||"){
                                    tmp.rate.pics=[];
                                }else{
                                tmp.rate.pics=(element.photo_url_list).split("||");
                                }
                            });
                        classes_m_sql.get_teacher_avatar(teacher_phone,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                result.map(function(element){
                                    tmp.creator.pic=element.teacher_avatar;
                                    tmp.creator.name=element.teacher_name;
                                })
                                classes_m_sql.get_new_m(id,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){//如果时空
                                        cb(null,result);
                                    }else{
                                    var index=1;
                                    var parent_list=[];
                                    result.forEach(function(elem){
                                        parent_list.push(elem.receive_phone);
                                    });
                                    var all_parent_mation=[];
                                    parent_list.forEach(function(elem){
                                        var parent_mation={name:"",avatar:""}
                                        classes_m_sql.getparent_avatar(elem,function(err,result){
                                            if(err){
                                                cb(err);
                                            }else{
                                                result.map(function(elem){
                                                    var array_l={bakname:elem.parent_name,pic:elem.parent_avatar};
                                                    tmp.rate.parent.push(array_l);
                                                });
                                                if(index==parent_list.length){
                                                    cb(null,tmp);
                                                }
                                                index++;
                                            }
                                        });
                                    })
                                    }
                                }
                                })
                                }
                            }) 
                        }
                    })
};
