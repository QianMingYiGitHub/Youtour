var express = require('express');
var router = express.Router();
var classes_c = require('../../controller/classes_c');

//根据年级查询班级
router.post('/querytype_Class', function (req, res, next) {
    classes_c.queryType_Class(req, res, next);
});
//添加班级
router.post('/addclass', function (req, res, next) {
    classes_c.addClass(req, res, next);
});
//删除班级
router.delete('/:id/deleteclass', function (req, res, next) {
    classes_c.deleteClass(req, res, next);
});
//删除年级
router.delete('/:type_grade/deletegrade', function (req, res, next) {
    classes_c.delete_Grade(req, res, next);
});
//添加学生 班级id
router.post('/:id/addstudent', function (req, res, next) {//后期加上
    if(req.session.school_id==""||req.session.school_id==null){
         res.json({success:3,desc:"用户信息过期(session)"});
    }else{
         classes_c.addStudent(req, res, next);
    }
});
//修改学生 学生id
router.post('/:id/modifystudent', function (req, res, next) {
    classes_c.modifyStudent(req, res, next);
});
//删除学生 学生id
router.delete('/:id/deletestudent', function (req, res, next) {
    classes_c.deleteStudent(req, res, next);
});
//学生转班
router.post('/modify_class', function (req, res, next) {
    classes_c.modify_Class(req, res, next);
});
//查询班级下的学生 班级id
router.post('/:id/querystudent', function (req, res, next) {
    classes_c.queryStudent(req, res, next);
});
//全体升级
router.post('/all_upgrade', function (req, res, next) {
    classes_c.all_Upgrade(req, res, next);
});
//页面加载班级
router.get('/:school_id/queryclass', function (req, res, next) {
    classes_c.queryClass(req, res, next);
});
//条件查询学生
router.post('/:id/query_student',function(req,res,next){
  classes_c.query_Student(req,res,next);
});

//删除年级
router.delete('/:id/deleteclassall', function (req, res, next) {
    classes_c.deleteClassAll(req, res, next);
});

//添加学生+校验
router.post('/addstudent_check', function (req, res, next) {
    classes_c.addStudent_check(req, res, next);
});

//根据学校id 查询未担任班主任的班级
router.post('/check_headmaster_yes', function (req, res, next) {
    classes_c.check_headmaster_yes(req, res, next);
});
//学生手机号 家长手机号不重复
router.get('/check_student_parent_phone', function (req, res, next) {
    classes_c.check_student_parent_phone(req, res, next);
});

//视图层
module.exports = router;
