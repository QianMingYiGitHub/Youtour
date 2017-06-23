var util = require('util');
var Promise = require('promise');
//var db = require('../../api/mongodb');
var DB = require('../../model/DB');
var activity_status = {
    draft: 0,
    published: 1,
    closed: 2
};
exports.activity_status = activity_status;

exports.saveActivity = function(corpId, activity){

    var tmpactivity = Object.assign({},activity);
    delete tmpactivity.id;
    tmpactivity.editTime = Date.now();
    if(util.isNullOrUndefined(activity)){
        return Promise.reject(new Error('作业通知无内容'));
    }
    tmpactivity.closeReason = tmpactivity.closeReason||'';
    tmpactivity.isHideFromHistory = tmpactivity.isHideFromHistory||false;
    if(util.isNullOrUndefined(activity.id) || activity.id === ''){
        return new Promise(function(resolve, reject){
            DB.save(corpId, 'activity_main', tmpactivity, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }else{
        return new Promise(function(resolve, reject){
            DB.updateById(corpId, 'activity_main', activity.id, {'$set':tmpactivity}, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
};

exports.deleteMainActivity = function(corpId, activityId){
    return new Promise(function(resolve, reject){
        DB.remove(corpId, 'activity_main', {_id:activityId,state:0}, function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.deleteMainActivityFromHistory = function(corpId, activityId){
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'activity_main', activityId, {'$set':{isHideFromHistory:true}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.deleteJoinerActivityFromHistory = function(corpId, activityId, userid, identity, ext){
    return new Promise(function(resolve, reject){
        var query = {'activityId':activityId, 'id':userid, 'identity':identity,'ext':ext};
        DB.update(corpId, 'activity_joiner', query, {'$set':{isHideFromHistory:true}},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.getActivity = function(corpId, activityId){
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'activity_main', {_id:activityId}, function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.hasActivityInJoniner = function(corpId, activity){
    return new Promise(function(resolve, reject){
        var query = {'activityId':activity.activityId, 'id':activity.id, 'identity':activity.identity,'ext':activity.ext};
        DB.findOne(corpId, 'activity_joiner', query, function(err, data){
            if(err){
                return reject(err);
            }
            if(data){
                return resolve(true);
            }else
                return resolve(false);
        });
    });
};

exports.saveActivityToJoiner = function(corpId, activity){
    return new Promise(function(resolve, reject){
        DB.save(corpId, 'activity_joiner', {activityId:activity.activityId,id:activity.id,identity:activity.identity,ext:activity.ext}, function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.updateActivityToJoiner = function(corpId, activity){
    return new Promise(function(resolve, reject){
        var query = {'activityId':activity.activityId, 'id':activity.id, 'identity':activity.identity,'ext':activity.ext};
        DB.updateData(corpId, 'activity_joiner', query, {'$set':activity},function(err,data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.queryAllActitivyByCreatorAndState = function(corpId, userid, type){
    // var activityMdl = getMainActivityModel(corpId)
    return new Promise(function(resolve, reject){
        var condition = {createPerson:userid, isHideFromHistory:false};
        console.log('queryAllActitivyByCreatorAndState.condition = ' + JSON.stringify(condition) + ', type=' + JSON.stringify(type));
        switch(type) {
        case activity_status.draft:
            condition.state = type;
            break;
        case activity_status.published:
            condition.endTime = {'$gte':new Date()};
            condition.state = type;
            break;
        case activity_status. d:
            condition['$or'] = [{state: type}, {endTime:{'$lt':new Date()}}];
            break;
        }
        console.log('queryAllActitivyByCreatorAndState.condition = ' + JSON.stringify(condition));
        DB.find(corpId, 'activity_main', condition, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.queryAllActitivyByJoinerAndState = function(corpId, userid, type){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'activity_joiner', {'id':userid, isHideFromHistory:false, state:type}, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.queryAllActitivyOfJoinerByState = function(corpId, activityId, type){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'activity_joiner', {'activityId':activityId, state:type}, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

///////////////////////////////////////////////////////////////////////////////////////
//新接口

function creator_findActivity(condition) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'activityOfCreator').findOne(condition).populate('partner').populate('leader').exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
}
function creator_findActivities(condition) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'activityOfCreator').find(condition).populate('partner').populate('leader').exec(function(err, results){
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}
function creator_updateActivity(condition, update) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'activityOfCreator').findOneAndUpdate(condition, update).populate('partner').populate('leader').exec(function(err, result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
}
function joiner_findActivity(condition) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'activityOfJoiner').findOne(condition).populate('activity').populate('user').exec(function(err, result){
            if(err){
                return reject(err);
            }
            DB.getConnection('', 'user').populate(result, 'activity.createPerson', function(err, result){
                if(err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    });
}
function joiner_findActivities(condition) {
    return new Promise(function(resolve, reject) {
        DB.getConnection('', 'activityOfJoiner').find(condition).populate('activity').populate('user').exec(function(err, results){
            if(err){
                return reject(err);
            }
            DB.getConnection('', 'user').populate(results, 'activity.createPerson', function(err, results){
                if(err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    });
}
function joiner_updateActivity(condition, update) {
    return new Promise(function(resolve, reject){
        DB.getConnection('', 'activityOfJoiner').findOneAndUpdate(condition, update).populate('activity').populate('user').exec(function(err, result){
            if(err){
                return reject(err);
            }
            DB.getConnection('', 'user').populate(result, 'activity.createPerson', function(err, result){
                if(err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    });
}
function creator_saveActivity(corpId, activity) {
    if(util.isNullOrUndefined(activity.id) || activity.id === '') {
        return new Promise(function(resolve, reject) {
            DB.getConnection('', 'activityOfCreator').create(activity, function(err, result) {
                if(err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    } else {
        return creator_updateActivity({_id: activity.id}, activity);
    }
}
function joiner_saveActivity(corpId, userid, activityId) {
    return joiner_findActivity({user: userid, activity:activityId}).then(function(result){
        if(result){
            return Promise.reject('该记录已经存在，无法保存');
        }
        return new Promise(function(resolve, reject){
            DB.getConnection('', 'activityOfJoiner').create({user:userid, activity:activityId}, function(err, result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            });
        });
    });
}
/**
 * 查找创建者的某个活动
 */
exports.creator_findActivity = creator_findActivity;
/**
 * 查找创建者的某些活动
 */
exports.creator_findActivities = creator_findActivities;
/**
 * 更新创建者的某个活动
 */
exports.creator_updateActivity = creator_updateActivity;

/**
 * 查找参与者的某个活动
 */
exports.joiner_findActivity = joiner_findActivity;
/**
 * 查找参与者的某些活动
 */
exports.joiner_findActivities = joiner_findActivities;
/**
 * 更新参与者的某个活动
 */
exports.joiner_updateActivity = joiner_updateActivity;

/**
 * 保存创建者活动
 */
exports.creator_saveActivity = creator_saveActivity;

/**
 * 保存参与者活动
 */
exports.joiner_saveActivity = joiner_saveActivity;

exports.creator_state = {
    draft:0,
    published:1,
    closed:2
};
exports.joiner_state = {
    noread: 0,
    readed: 1
};