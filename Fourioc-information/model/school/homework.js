var util = require('util');
var Promise = require('promise');
// var db = require('../../api/mongodb');
var DB = require('../../model/DB');
// var teacherHomeworkModel = [];
// var getTeacherHomeworkModel = function(corpId){
//     var key = corpId + '.teacher_homework';
//     if(util.isNullOrUndefined(teacherHomeworkModel[key])){
//         teacherHomeworkModel[key] = db.createModel(key,{
//             createPerson:String,
//             homeworkType:Number,//作业类型,0.课后作业，1.假期作业
//             title:String,
//             content:String,//文本内容
//             voice:[String],//语音id
//             pics:[String],
//             attachment:[String],//附件，没想好怎么实现
//             teacher:[{id:String}],//老师
//             parent:[{id:String,sid:String}],//家长
//             class:[Number],
//             createTime:{type:Date,default:Date.now},
//             editTime:{type:Date,default:Date.now},//编辑时间
//             beginTime:Date,//开始时间
//             endTime:Date,//结束时间
//             isNotifyBeforeBegin:Boolean,//开始前30分钟通知
//             isNotifyBeforeEnd:Boolean,//结束前30分钟通知
//             priority:Number,//优先级0.普通，1.不紧急但重要,2.紧急但不重要,3.紧急且重要
//             state:Number,//状态，0.草稿，1.已发布，2.已关闭
//             closeReason:String//关闭原因
//         });
//     }
//     return teacherHomeworkModel[key];
// }
//
// var parentHomeworkModel = [];
// var getParentHomeworkModel = function(corpId){
//     var key = corpId + '.parent_homework';
//     if(util.isNullOrUndefined(parentHomeworkModel[key])){
//         parentHomeworkModel[key] = db.createModel(key,{
//             homeworkId:String,//作业id
//             id:String,//家长id
//             sid:String,//学生id
//             state:Number//状态，0.未阅，1.已阅
//         });
//     }
//     return parentHomeworkModel[key];
// }

exports.saveHomework = function(corpId, homework){
    var model = {
        createPerson:homework.createPerson,
        homeworkType:homework.homeworkType,
        title:homework.title,
        content:homework.content,
        voice:homework.voice,//语音id
        pics:homework.pics,
        attachment:homework.attachment,
        teacher:homework.teacher,
        parent:homework.parent,
        class:homework.class,
        editTime:Date.now(),//编辑时间
        // beginTime:homework.beginTime,
        // endTime:homework.endTime,
        beginTime:homework.beginTime,
        endTime:homework.endTime,
        isNotifyBeforeBegin:homework.isNotifyBeforeBegin,
        isNotifyBeforeEnd:homework.isNotifyBeforeEnd,
        priority:homework.priority,
        state:homework.state,
        closeReason:''
    };
    return new Promise(function(resolve, reject){
        if(util.isNullOrUndefined(homework.id) || homework.id === ''){
            DB.save(corpId, 'teacher_homework', model, function(err, data){
                if(err){
                    return reject(err);
                }
                return resolve(data);
            });
        }else{

            DB.updateById(corpId, 'teacher_homework', homework.id,{'$set':model}, function(err,data){
                if(err){
                    return reject(err);
                }
                model._id = homework.id;
                return resolve(model);
            });
        }
    });
};

exports.closeHomework = function(corpId, info){
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'teacher_homework', info.id, {'$set':{state:2,closeReason:info.reason}},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.deleteHomework = function(corpId,id){
    return new Promise(function(resolve, reject){
        DB.updateById(corpId, 'teacher_homework', id, {'$set':{state:-1}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.deleteParentHomework = function(corpId, userid, sid, homeworkid){
    var query = {id:userid,sid:sid,homeworkId:homeworkid};
    return new Promise(function(resolve, reject){
        DB.updateData(corpId, 'parent_homework', query, {'$set':{state:-1}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};
exports.findHomeworkbyId = function(corpId, homeworkid){
    var query = {_id:homeworkid};
    return new Promise(function(resolve, reject){
        DB.findOne(corpId, 'teacher_homework', query, function(err, data){
            if(err){
                return reject(err);
            }
            if(util.isNullOrUndefined(data)){
                return reject(new Error('no homeworkid:' + homeworkid));
            }
            return resolve(data);
        });
    });
};

exports.createParentHomework = function(corpId, homework){
    return new Promise(function(resolve, reject){
        DB.save(corpId, 'parent_homework', homework,function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.getReadingStatus = function(corpId, homeworkid, state){
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'parent_homework',{homeworkId:homeworkid,state:state},{},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};

exports.parentHomeworkUpdateState = function(corpId, homeworkid, userid, sid, state){
    return new Promise(function(resolve, reject){
        DB.update(corpId, 'parent_homework',{homeworkId:homeworkid,id:userid,sid:sid},{'$set':{state:state}},function(err){
            if(err){
                return reject(err);
            }
            return resolve();
        });
    });
};

exports.findHomeworksByCreatorAndState = function(corpId, creator, state){
    var tmpstate = [];
    if(util.isArray(state)){
        state.forEach(function(data){
            tmpstate.push(data);
        });
    }else if(typeof(state) == 'number'){
        tmpstate.push(state);
    }
    return new Promise(function(resolve, reject){
        DB.find(corpId, 'teacher_homework', {createPerson:creator, state:{'$in':tmpstate}}, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};
exports.findHomeworksByPersonAndReadingState = function(corpId, person, state){
    var query = {id:person, state:state};
    return new Promise(function(resolve, reject){
        DB.find(corpId,'parent_homework',query, {},function(err, data){
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
};
