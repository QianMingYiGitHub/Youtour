var Promise = require('promise');
var DB = require('../DB');
var util = require('util');

exports.initSchoolDepartment = function(corpId, schoolName){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId,'school_department',{id:1},function(err, res){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(res)){
                return resolve(false);
            }else{
                return resolve(true);
            }
        });
    }).then(function(isInited){
        if(isInited === false){
            var defaultDepartment = [
                {
                    corpId:corpId,//学校id
                    id:1,//部门id
                    name:schoolName,//部门名称
                    parent:0,//上级部门
                    kind:0,//0:root, 1:学校root 教职工，2：班级root，3：学校部门，4：班级
                    status:1,//状态，0：初始状态，1：启用状态，2：停用，3：删除（没有子节点，没有人员的才能删除）
                    history:[],
                    extattr:{}
                },
                {
                    corpId:corpId,//学校id
                    id:2,//部门id
                    name:'教职工',//部门名称
                    parent:1,//上级部门
                    kind:1,//0:root, 1:学校root 教职工，2：班级root，3：学校部门，4：班级
                    status:1,//状态，0：初始状态，1：启用状态，2：停用，3：删除（没有子节点，没有人员的才能删除）
                    history:[],
                    extattr:{}
                },
                {
                    corpId:corpId,//学校id
                    id:3,//部门id
                    name:'班级',//部门名称
                    parent:1,//上级部门
                    kind:2,//0:root, 1:学校root 教职工，2：班级root，3：学校部门，4：班级
                    status:1,//状态，0：初始状态，1：启用状态，2：停用，3：删除（没有子节点，没有人员的才能删除）
                    history:[],
                    extattr:{}
                }
            ];
            var promises = [];
            defaultDepartment.forEach(function(dept){
                promises.push(new Promise(function(resolve, reject){
                    DB.save(corpId,'school_department', dept, function(err, res){
                        if(err){
                            return reject(err);
                        }
                        return resolve();
                    });
                }));
            });
            return Promise.all(promises).then(function(){
                return new Promise(function(resolve, reject){
                    DB.save(corpId, 'department_id', {name:'department_id',id:4}, function(err, res){
                        if(err){
                            return reject(err);
                        }
                        return resolve();
                    });
                });
            });
        }
    });
};

// exports.createDepartment= function(corpId, department) {
//     DB.getConnection('', 'school_department').create({
//         corpId: corpId,

//     });
// };

exports.createDepartment = function(corpId,department){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'department_id', function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res.id);
        });
    }).then(function(id){
        if(util.isNullOrUndefined(department.corpId)){
            department.corpId = corpId;
        }
        department.id = id;
        return new Promise(function(resolve, reject){
            DB.save(corpId, 'school_department', department, function(err, res){
                if(err){
                    return reject(err);
                }
                return resolve(res.toObject());
            });
        });
    }).then(function(res){
        return new Promise(function(resolve, reject){
            DB.updateData(corpId, 'department_id', {name:'department_id'}, {'$inc':{id:1}}, function(err, result){
                if(err){
                    return reject(err);
                }
                return resolve(res);
            });
        });
    });
};

exports.updateDepartment = function(corpId, departmentId, department){
    return new Promise(function(resolve, reject){
        DB.updateData(corpId, 'school_department', {id:departmentId}, {'$set':department, '$push':{'history': Date.now()}}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res.toObject());
        });
    });
};

exports.deleteDepartment = function(corpId, departmentId){
    return new Promise(function(resolve, reject){
        DB.updateData(corpId, 'school_department', {id:departmentId}, {'$set':{status:3},'$push':{'history': Date.now()}}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res.toObject());
        });
    });
};

exports.findDepartmentByKinds = function(corpId, kinds){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'school_department', {kind:{'$in':kinds},status:1}, {},function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.findDepartmentById = function(corpId, id){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_department', {id:id}, function(err, res){
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

exports.findDepartmentByName = function(corpId, name){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'school_department', {name:name, status:1}, function(err, datas){
            if(err){
                return reject(err);
            }
            return resolve(datas);
        });
    });
};
