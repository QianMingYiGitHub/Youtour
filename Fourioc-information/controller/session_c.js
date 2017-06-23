var util = require('util');

//系统管理员登录、注销的session记录
module.exports.User = {
    //登录成功后，要记入session
    logIn: function (req, userid,macid,login_role) {
        req.session.user = userid;
        req.session.roles = [];
        req.session.mac=macid;
        req.session.login_role=login_role;
    },
    platform_Login: function (req,teacher,headmaster,admin,username,student) {
        req.session.teacher=teacher
        req.session.headmaster=headmaster
        req.session.admin=admin
        req.session.user=username;
    },
     student_Login: function (req,student) {
        req.session.student=student
    },
    getUser: function (req) {
        return req.session.user;
    },
    isLogin: function (req) {
        return util.isNullOrUndefined(req.session.user) === false;
    },
    saveRole: function (req, role) {
        if (util.isNullOrUndefined(req.session.roles)) {
            req.session.roles = [role];
        } else {
            req.session.roles.push(role);
        }
    },
    saveHeadmaster:function(req,headmaster_class_id,school_id,class_id,type_grade){
        req.session.headmaster_class_id = headmaster_class_id;
        req.session.school_id = school_id;
        req.session.class_id = class_id;
        req.session.type_grade=type_grade;
    },
    hasRole: function (req, role) {
        if (util.isNullOrUndefined(req.session.roles)) {
            return false;
        } else {
            return (util.isNullOrUndefined(req.session.roles.find(function(elem) {
                return elem === role;
            })) === false);
        }
    },
    //登录成功后，注销用户
    logOut: function (req) {
        console.log("注销用户");
        delete req.session.roles;
        delete req.session.user;
        delete req.session.mac;
    }
    // Session_Login:function (req,res) {
    //     if (Session_c.isLogin(req)&&req.originalUrl) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    // }
}
//Wechat
