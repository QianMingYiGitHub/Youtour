var express = require('express');
var router = express.Router();
var school_c = require('../../controller/school_c');
var classes_c = require('../../controller/classes_c');
//web端添加学校经纬度
router.post('/add_school', function (req, res, next) {
    school_c.add_School(req,res,next);
});
//修改学校
 router.post('/:id/modify_school', function (req, res, next) {
    school_c.modify_School(req,res,next);
});
//修改学校+经纬度
 router.post('/:id/modify_school_Long_latitude', function (req, res, next) {
    school_c.modify_school_Long_latitude(req,res,next);
});
//删除学校
 router.delete('/:id/delete_school', function (req, res, next) {
    school_c.delete_School(req,res,next);
});
//获取所有学校列表
 router.get('/get_schoollist', function (req, res, next) {
    school_c.get_Schoollist(req,res,next);
});
//条件查询学校
 router.post('/query_schoollist', function (req, res, next) {
    school_c.query_Schoollist(req,res,next);
});

//根据学校id查询学校的经纬度
 router.get('/:id/get_school_Long_latitude', function (req, res, next) {
    school_c.get_school_Long_latitude(req,res,next);
});
//小程序测试
 router.get('/get_schoollist_small', function (req, res, next) {
    school_c.get_Schoollist_small(req,res,next);
});




//学校考勤信息
router.post('/get_school_puch', function(req, res, next) {
    classes_c.get_School_Puch(req, res, next);
});
//班级考勤信息
router.post('/get_class_puch', function(req, res, next) {
    classes_c.get_Class_Puch(req, res, next);
});
//根据学校id条件查询考勤信息
router.post('/query_school_student', function(req, res, next) {
    classes_c.query_School_Student(req, res, next);
});
//根据学校id条件查询班级学生考勤信息
router.post('/query_class_student', function(req, res, next) {
    classes_c.query_Class_Student(req, res, next);
});

//学生安全信息
//根据家长的手机号查询学生的位置信息;
router.post('/get_student_position', function(req, res, next) {
    classes_c.get_Student_Position(req, res, next);
});
//根据家长的手机号查询学生今日考勤信息;
router.post('/get_student_position_puch', function(req, res, next) {
    classes_c.get_Student_Position_Puch(req, res, next);
});
//根据家长的手机号查询学生历史考勤信息
router.post('/get_student_position_allpuch', function(req, res, next) {
    classes_c.get_student_position_Allpuch(req, res, next);
});

//学校订购信息+移动提供的数据


//视图层

module.exports = router;
