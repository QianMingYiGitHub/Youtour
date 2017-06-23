var express = require('express');
var router = express.Router();
var user_c = require('../../controller/user_c');
var session_c = require('../../controller/session_c');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//修改密码
router.post('/:user/password', function (req, res, next) {
    if (session_c.User.isLogin(req)) {
        user_c.changePassword(req, res, next);
    } else {
        res.redirect('/login');
    }
});
//添加部门
router.post('/adddepartment',function(req,res,next){
  user_c.addDepartment(req,res,next);
});
//查询部门
router.get('/:school_id/querydepartment',function(req,res,next){
  user_c.queryDepartment(req,res,next);
});
//修改部门
router.post('/:id/modifydepartment',function(req,res,next){
  user_c.modifyDepartment(req,res,next);
});
//删除部门
router.delete('/:id/deletedepartment',function(req,res,next){
  user_c.deleteDepartment(req,res,next);
});
//查询全体教师+get
router.post('/queryallteacher',function(req,res,next){
  user_c.queryAllteacher(req,res,next);
});
//条件查询老师+全体的
router.post('/query_teacher',function(req,res,next){
  user_c.query_Teacher(req,res,next);
});
//查询某个部门下的教师
router.post('/querydeparteacher',function(req,res,next){
  user_c.querydeparTeacher(req,res,next);
});
//条件查询老师+部门的
router.post('/query_teacher_depart',function(req,res,next){
  user_c.query_Teacher_depart(req,res,next);
});
//添加教师---全体教师+企业号+测试成功
router.post('/addteacher_all',function(req,res,next){
  user_c.addTeacher_all(req,res,next);
});
//删除部门下的教师-是否删除用户 教师id
router.post('/:id/deleteteacher_depart',function(req,res,next){
  user_c.deleteTeacher_depart(req,res,next);
});
//删除教师全体-删除用户+企业号+测试成功
router.delete('/:id/deleteteacher',function(req,res,next){
  user_c.deleteTeacher(req,res,next);
});
//增加部门下的老师
router.post('/:department_name/addteacher',function(req,res,next){
  user_c.addTeacher(req,res,next);
});
//更新老师+企业号+未测试
router.post('/:id/modifyteacher_all',function(req,res,next){
  user_c.modifyTeacher_all(req,res,next);
}); 

//添加老师增加校验
router.post('/addteacher_check',function(req,res,next){
  user_c.addTeacher_check(req,res,next);
}); 
//更改老师增加校验
router.post('/updateteacher_check',function(req,res,next){
  user_c.updateTeacher_check(req,res,next);
}); 


//视图层
module.exports = router;
