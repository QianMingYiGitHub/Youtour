var util = require('util');
var Promise = require('promise');
var DB = require('../DB');


exports.createDepartment = function (corpId, department) {
    return new Promise(function (resolve, reject) {
        DB.getConnection('', 'department').create({
            _id: department.id,
            corp: corpId,
            name: department.name,
            parent: department.parent,
            kind: 3
        }, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.deleteDepartment = function(corpId, departmentId) {
    return new Promise(function (resolve, reject) {
        DB.getConnection('', 'department').remove({
            _id: departmentId
        }, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};


exports.createClass = function (corpId, Class) {
    return new Promise(function (resolve, reject) {
        DB.getConnection('', 'department').create({
            _id: Class.id,
            corp: corpId,
            name: Class.name,
            parent: Class.parent,
            kind: 4
        }, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

exports.updateDepartment = function (deptId, update) {
    return new Promise(function (resolve, reject) {
        DB.getConnection('', 'department').findByIdAndUpdate(deptId, update, { new: true })
            .exec(function (err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
    });
};

exports.updateClass = function (deptId, update) {
    return new Promise(function (resolve, reject) {
        DB.getConnection('', 'department').findByIdAndUpdate(deptId, update, { new: true })
            .exec(function (err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
    });
};

/**
 * 查找部门，不区分部门或班级
 */
exports.findDepartment = function (deptId) {
    return new Promise(function (resolve, reject) {
        DB.getConnection('', 'department').findById(deptId).populate('parent').exec(function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

/**
 * 根据父部门查找子部门
 */
exports.findDepartmentByParent = function(parentId) {
    return new Promise(function(resolve,reject) {
        DB.getConnection('', 'department').find({parent: parentId}).exec(function(err, results) {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

/**
 * 按条件查找部门
 */
exports.findDepartments = function(condition) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'department').find(condition).exec(function(err, results) {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};
