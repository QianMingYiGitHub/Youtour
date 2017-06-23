var express = require('express');
var router = express.Router();
var phones_c = require('../../controller/phones_c');
var socket_c = require('../../controller/socket_c');
var message = require('../../api/media/message');
//根据phone_app查询数据
//开始答题
router.get('/:wb_number/start_question', function (req, res, next) {
    phones_c.start_Question(req, res, next);
});
//结束答题
router.get('/:answer_mark_m_id/end_question', function (req, res, next) {
    phones_c.end_Question(req, res, next);
});

//查询白板号是否存在
router.post('/app_mac', function (req, res, next) {
    phones_c.app_Mac(req, res, next);
});
//手机端_提交答题
router.post('/app_answer', function (req, res, next) {
    phones_c.app_Answer(req, res, next);
});
//撤销答题
router.post('/app_answer_revoke', function (req, res, next) {
    phones_c.app_Answer_Revoke(req, res, next);
});
//根据学生phone查询同班级学生+班主任
router.post('/app_getphone', function (req, res, next) {
    phones_c.app_getPhone(req, res, next);
});
//根据学生phone获取name
router.post('/app_getname', function (req, res, next) {
    phones_c.app_getName(req, res, next);
});
//添加联系人
router.post('/app_addphone', function (req, res, next) {
    phones_c.app_AddPhone(req, res, next);
});
//删除联系人
router.post('/app_deletephone', function (req, res, next) {
    phones_c.app_DeletePhone(req, res, next);
});
//手机获取经纬度
router.post('/puchschool/getlong_lat_itude', function (req, res, next) {
    phones_c.get_Long_Latitude_Range(req, res, next);
});
//学生打卡(签到)接口+出校门+进校门用
router.post('/puchschool/puch_student', function (req, res, next) {
    phones_c.puch_Student(req, res, next);
});
//报告学生经纬度接口
router.post('/puchschool/student_long_lat', function (req, res, next) {
    phones_c.student_Long_Lat(req, res, next);
});
//报告学生经纬度接口临时
router.post('/puchschool/student_Long_Lat_temporary', function (req, res, next) {
    phones_c.student_Long_Lat_temporary(req, res, next);
});
//结束答题
router.get('/:answer_mark_m_id/end_question', function (req, res, next) {
    phones_c.end_Question(req, res, next);
});
//添加通讯录
router.get('/puchschool/puch_adduser', function (req, res, next) {
    phones_c.puch_adduser(req, res, next);
});
//答题分析
router.post('/:answer_mark_m_id/analys_questions', function (req, res, next) {
    phones_c.analys_Questions(req, res, next);
});
//查询答题情况+
router.post('/:answer_mark_m_id/query_questions', function (req, res, next) {
    phones_c.query_Questions(req, res, next);
});
//查询答题情况下一个班级
router.post('/:answer_mark_m_id/query_questions_next', function (req, res, next) {
    phones_c.query_Questions_Next(req, res, next);
});
//
router.post('/getposition', function (req, res, next) {
    phones_c.getposition(req, res, next);
});


module.exports = router;