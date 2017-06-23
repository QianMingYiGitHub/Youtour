var express = require('express');
var router = express.Router();
var user_m = require('../../model/user_m');
var user_c = require('../../controller/user_c');
var session_c = require('../../controller/session_c');
 
/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('edition_main_v', {});
//    //res.render('excel', {});
// });
//controller层

//判断登录是否登录 如果登录判断权限
router.get('/', function (req, res, next) {
    user_c.Root(req, res, next);
});
router.get('/admin_root', function (req, res, next) {
    user_c.admin_Root(req, res, next);
});
router.get('/general_platform_root', function (req, res, next) {
    user_c.general_Platform_Root(req, res, next);
});
router.get('/student_root', function (req, res, next) {
    user_c.Student_Root(req, res, next);
});
//登陆
router.post('/login', function (req, res, next) {
    user_c.logIn(req, res, next);
});
router.post('/admin_login', function (req, res, next) {//总管理员 
    user_c.admin_login(req, res, next);
});



//总平台登录
router.post('/general_platform_login', function (req, res, next) {//总管理员 
    user_c.general_platform_login(req, res, next);
});
//学生登录
router.post('/student_login', function (req, res, next) {//总管理员 
    user_c.student_login(req, res, next);
});
//注销1
router.get('/logout', function (req, res, next) {
    user_c.logOut(req, res, next);//点击注销 url 链接到这里 
});
//注销2
router.get('/logout_platform', function (req, res, next) {
    user_c.logOut_platForm(req, res, next);//点击注销 url 链接到这里 
});
//管理员注销
router.get('/admin_logout', function (req, res, next) {
    user_c.admin_logOut(req, res, next);//点击注销 url 链接到这里 
});
//apk给文件命名
router.get('/Youtour.apk', function (req, res, next) {
    user_c.Apk(req, res, next);//点击注销 url 链接到这里 
});

router.get('/get_out_interface', function (req, res, next) {
    user_c.get_out_interface(req, res, next);//点击注销 url 链接到这里 
});


//登录界面
router.get('/login', function (req, res, next) {
    res.render('login', {});
});
router.get('/excel', function (req, res, next) {
    res.render('excel', {});
});
router.get('/edition_main_v', function (req, res, next) {
    if (session_c.User.isLogin(req)) {
        res.render('edition_main_v', {});
    } else {
        res.redirect('/login');
    }
});
//前端开发2017-2-22
router.get('/dialog_success', function (req, res, next) {
    res.render('dialog_success', {});
});
router.get('/bug', function (req, res, next) {
    res.render('bug', {});
});
//白板
router.get('/whiteboard', function (req, res, next) {
      if (session_c.User.isLogin(req)) {
       res.render('whiteboard', {});
    } else {
        res.redirect('/login');
    }
});
//手机测试
router.get('/mobile', function (req, res, next) {
    res.render('mobile', {});
});
//教师-学生-家长管理首页
router.get('/user_management_index', function (req, res, next) {
      if (session_c.User.isLogin(req)) {
       res.render('user_management_index', {});
    } else {
        res.redirect('/login');
    }
});
//学校部门
router.get('/department_list', function (req, res, next) {
    res.render('department_list', {});
});
//年级-学生-家长列表
router.get('/student_parent', function (req, res, next) {
    res.render('student_parent', {});
});
//全体升级
router.get('/whole_upgrade', function (req, res, next) {
    res.render('whole_upgrade', {});
});

//考勤信息
router.get('/test_info_list', function (req, res, next) {
    res.render('test_info_list', {});
});



//班班通home主页
router.get('/bbt_home', function (req, res, next) {
    res.render('bbt_home', {});
});
router.get('/test', function (req, res, next) {
    res.render('map/test_qian', {});
});

//地图-首页
router.get('/map_home', function (req, res, next) {
    res.render('map/map_home', {});
});
//地图-学校范围录入
router.get('/map_add_range', function (req, res, next) {
    res.render('map/map_add_range', {});
});

//地图-学校范围编辑
router.get('/map_edit_range', function (req, res, next) {
    res.render('map/map_edit_range', {});
});
//地图-学校管理
router.get('/map_school_administration', function (req, res, next) {
    res.render('map/map_school_administration', {});
});


//地图-学校管理
router.get('/map_school_administration', function (req, res, next) {
    res.render('map/map_school_administration', {});
});

//地图-学校人员信息首页
router.get('/map_school_info', function (req, res, next) {
    res.render('map/map_school_info', {});
});

//地图-学校人员列表
router.get('/map_department_list', function (req, res, next) {
    res.render('map/map_department_list', {});
});

//地图-家长-学生列表
router.get('/map_student_parent', function (req, res, next) {
    res.render('map/map_student_parent', {});
});

//地图-订购信息
router.get('/map_order_info', function (req, res, next) {
    res.render('map/map_order_info', {});
});

//地图-登录
router.get('/map_login', function (req, res, next) {
    res.render('map/map_login', {});
});
//微信绑定家长手机号
router.get('/binding_phone', function (req, res, next) {
    res.render('binding_phone', {});
});

//登录界面
router.get('/login_home', function (req, res, next) {
    res.render('login_home', {});
});

router.get('/login_student', function (req, res, next) {
    res.render('login_student', {});
});
router.get('/login_home_student', function (req, res, next) {//总管理员
    res.render('login_home_student', {});
});



//家长绑定家长手机号码+微信openid
router.get('/binding_v', function (req, res, next) {
    res.render('map/map_edit_range', {});
});
//显示经纬度信息+wechat
router.get('/get_long_latitude', function (req, res, next) {
    res.render('get_long_latitude', {});
});
//显示经纬度信息+wechat
router.get('/test_qian', function (req, res, next) {
    res.render('test', {});
});
//平安考勤
router.get('/check_work_attendance', function (req, res, next) {
    res.render('check_work_attendance', {});
});































//其他页面
module.exports = router;
