const util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
var deptModel = [];
var getDepartmentModel = function(corpId){
    var key = corpId + '.wxDepartment';
    if(util.isNullOrUndefined(deptModel[key])){
        deptModel[key] = db.createModel(key,{
           id:{type:Number,unique: true},
           name:{type:String,required:true},
           parentid:{type:Number,required:true},
           order:{type:Number}
        });
    }
    return deptModel[key];
}
//创建家长
exports.createDepartment = function(corpId,Department){
    var deptMdl = getDepartmentModel(corpId);
    return new Promise(function(resolve, reject){
        deptMdl.create(Department,function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    })
}
function fetchChildDepartment(corpId, parentid, fetch_child,childs){
    var deptMdl = getDepartmentModel(corpId);
    if(util.isNullOrUndefined(fetch_child)||(fetch_child === 0)){
        return new Promise(function(resolve, reject){
            deptMdl.find({parentid:parentid},function(err, depts){
                if(err){
                    return reject(err);
                }
                return resolve(depts);
            })
        }).then(function(depts){
            depts.forEach(function(dept){
                childs.push({id:dept.id,name:dept.name,parentid:dept.parentid,order:dept.order||200});
            });
        });
    }else{
        return new Promise(function(resolve, reject){
            deptMdl.find({parentid:parentid},function(err, depts){
                if(err){
                    return reject(err);
                }
                depts.forEach(function(dept){
                    childs.push({id:dept.id,name:dept.name,parentid:dept.parentid,order:dept.order||200});
                });
                return resolve(depts);
            })
        }).then(function(depts){
            var promises = [];
            depts.forEach(function(dept){
                promises.push(fetchChildDepartment(corpId,dept.id,fetch_child,childs));
            })
            return Promise.all(promises);
        })
    }
}
exports.getDepartmentByParentId = fetchChildDepartment;

exports.getAllDepartments = function(corpId){
    var deptMdl = getDepartmentModel(corpId);
    return new Promise(function(resolve, reject){
       deptMdl.find({},function(err, depts){
           if(err){
               return reject(err);
           }
           return resolve(depts);
       })
    });
}

exports.getDepartmentById = function(corpId, id){
    var deptMdl = getDepartmentModel(corpId);
    return new Promise(function(resolve, reject){
       deptMdl.findOne({id:id},function(err, dept){
           if(err){
               return reject(err);
           }
           return resolve(dept);
       })
    });
}

exports.updateDepartment = function(corpId, id, update){
    var deptMdl = getDepartmentModel(corpId);
    return new Promise(function(resolve, reject){
       deptMdl.update({id:id},update,function(err){
           if(err){
               return reject(err);
           }
           return resolve();
       })
    });
}

exports.deleteDepartment = function(corpId, id){
    var deptMdl = getDepartmentModel(corpId);
    var updateVal = {};
    return new Promise(function(resolve, reject){
       deptMdl.remove({id:id},function(err){
           if(err){
               return reject(err);
           }
           return resolve();
       })
    });
}

exports.getAllDepartmentsWithAttr = function(corpId, attrkey,attrvalue){
    var deptMdl = getDepartmentModel(corpId);
    return new Promise(function(resolve, reject){
       deptMdl.find({attr:{name:attrkey,value:attrvalue}},function(err, depts){
           if(err){
               return reject(err);
           }
           return resolve(depts);
       })
    });
}
