var express = require('express');
var router = express.Router();
var questions_c = require('../../controller/questions_c');
var session_c = require('../../controller/session_c');
//控制层
//添加版本
router.post('/add_edition', function(req, res, next) {
  questions_c.add_Edition(req, res, next);
});
//获得版本
router.get('/', function(req, res, next) {
  questions_c.getEdition_Teacher(req, res, next);
});
//获得老师下的版本
router.get('/getedition_teacher', function(req, res, next) {
  questions_c.getEdition_Teacher(req, res, next);
});
//版本编辑
router.post('/update_edition', function(req, res, next) {
  questions_c.update_Edition(req, res, next);
});
//版本编辑-删除
router.post('/updatedel_edition', function(req, res, next) {
  questions_c.updatedel_Edition(req, res, next);
});
//版本筛选
router.post('/query_edition', function(req, res, next) {
  questions_c.query_Edition(req, res, next);
});
//添加章节
router.post('/:id/add_chapter', function(req, res, next) {
  questions_c.add_Chapter(req, res, next);
});
//查询章节
router.post('/:id/query_chapter', function(req, res, next) {
  questions_c.query_Chapter(req, res, next);
});
//添加课节
router.post('/:id/add_classhour', function(req, res, next) {
  questions_c.add_Classhour(req, res, next);
});
//查询课节
router.post('/:id/query_classhour', function(req, res, next) {
  questions_c.query_Classhour(req, res, next);
});
//根据课时id查询试题
router.get('/:id/query_questions', function(req, res, next) {
  //修改一部分
  questions_c.query_Questions(req, res, next);
});
//添加试题
router.post('/:id/add_questions', function(req, res, next) {
   if (session_c.User.isLogin(req)) {
        questions_c.add_Questions(req, res, next);
    } else {
        res.redirect('/login');
    }
});
//查看试题
router.get('/:id/check_questions', function(req, res, next) {
  questions_c.check_Questions(req, res, next);
});
//删除试题
router.delete('/:id/delete_questions', function(req, res, next) {
  questions_c.delete_Questions(req, res, next);
});
//编辑试题
router.post('/:id/modify_questions', function(req, res, next) {
  questions_c.modify_Questions(req, res, next);
});
//查询版本下的章节和课时
router.get('/:id/query_all', function(req, res, next) {
  questions_c.query_All(req, res, next);
});
 //上传photo
router.post('/uploadphoto', function(req, res, next) {
   questions_c.uploadPhoto(req, res, next);
});
//上传csv
router.post('/uploadcsv', function(req, res, next) {
   questions_c.uploadCsv(req, res, next);
});

//书签模块
//标记书签+可以批量添加书签
router.post('/add_bookmark', function(req, res, next) {
   questions_c.add_Bookmark(req, res, next);
});
//删除书签
router.delete('/delete_bookmark', function(req, res, next) {
   questions_c.delete_Bookmark(req, res, next);
});
//清空书签
router.delete('/empty_bookmark', function(req, res, next) {
   questions_c.empty_Bookmark(req, res, next);
});
//查询书签列表
router.get('/get_bookmark_list', function(req, res, next) {
   questions_c.get_Bookmark_list(req, res, next);
});
//根据标签id查询数据
router.get('/:id/get_Bookmark', function(req, res, next) {
   questions_c.get_Bookmark(req, res, next);
});
//上一个书签下一个书签
router.post('/get_bookmark_next', function(req, res, next) {
   questions_c.get_Bookmark_Next(req, res, next);
});
//根据答题id查询数据+题库
router.post('/:id/get_questions', function(req, res, next) {
   questions_c.get_Questions(req, res, next);
});
//上一个答题下一个答题
router.post('/get_questions_next', function(req, res, next) {
   questions_c.get_Questions_Next(req, res, next);
});
//视图层
//主界面
router.get('/edition_main_v', function(req, res, next) {
   res.render('edition_main_v', {});
});
//版本编辑页面
router.get('/edit_edition_v', function(req, res, next) {
  res.render('edit_edition_v', { title: ' ' });
});
//添加试题页面
router.get('/add_question_v', function(req, res, next) {
  res.render('add_question_v', { title: ' ' });
});
//编辑课题页面
router.get('/modify_question_v', function(req, res, next) {
  res.render('modify_question_v', { title: ' ' });
});
//查看课题页面 
router.get('/query_question_v', function(req, res, next) {
  res.render('query_question_v', { title: ' ' });
});
module.exports = router;
