var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var util = require('util');
var Promise = require('promise');
var questions_m = require('../model/questions_m');
var csv = require('node-csv').createParser();
 var session_c=require('../controller/session_c');

var Questions = (function(){
    //获取当前版本status=0的
    function getEdition(req, res, next) {
        questions_m.getEdition(function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Editions:result.map(function(elem){
                            var subject_re="";
                            var grade_re="";
                            if(elem.subject==0){
                                subject_re="艺术"
                            } else if(elem.subject==1){
                                subject_re="语文"
                            } else if(elem.subject==2){
                                subject_re="数学" 
                            } else if(elem.subject==3){
                                subject_re="英语"
                            }else if(elem.subject==4){
                                subject_re="物理"
                            } else if(elem.subject==5){
                                subject_re="化学"
                            } else if(elem.subject==6){
                                subject_re="音乐"
                            } else if(elem.subject==7){
                                subject_re="美术"
                            } else if(elem.subject==8){
                                subject_re="科学"
                            } else if(elem.subject==9){
                                subject_re="品德"
                            } else if(elem.subject==10){
                                subject_re="生物"
                            } else if(elem.subject==11){
                                subject_re="地理"
                            } else if(elem.subject==12){
                                subject_re="政治"
                            } else if(elem.subject==13){
                                subject_re="历史"
                            } else if(elem.subject==14){
                                subject_re="信息技术"
                            }else{
                                 subject_re="通用技术"
                            }
                             if(elem.grade==0){
                                grade_re="一年级";
                            } else if(elem.grade==1){
                                grade_re="二年级";
                            } else if(elem.grade==2){
                                grade_re="三年级";
                            } else if(elem.grade==3){
                                grade_re="四年级";
                            }else if(elem.grade==4){
                                grade_re="五年级";
                            } else if(elem.grade==5){
                                grade_re="六年级";
                            } else if(elem.grade==6){
                                grade_re="七年级";
                            } else if(elem.grade==7){
                                grade_re="八年级";
                            } else if(elem.grade==8){
                                grade_re="九年级";
                            } else{
                                 grade_re="高中";
                            }
                            return {
                                id:elem.id,
                                subject:subject_re,
                                grade:grade_re,
                                semester:elem.semester,
                                edition:elem.edition
                            };
                        })
                    }
                });
            }
        });
    } 
//获取老师下自己的版本
function getEdition_Teacher(req, res, next) {
        var phone=req.session.user;
        questions_m.getEdition_Teacher(phone,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                if(result==""){
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                      });
                }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Editions:result.map(function(elem){
                            var subject_re="";
                            var grade_re="";
                            if(elem.subject==0){
                                subject_re="艺术"
                            } else if(elem.subject==1){
                                subject_re="语文"
                            } else if(elem.subject==2){
                                subject_re="数学" 
                            } else if(elem.subject==3){
                                subject_re="英语"
                            }else if(elem.subject==4){
                                subject_re="物理"
                            } else if(elem.subject==5){
                                subject_re="化学"
                            } else if(elem.subject==6){
                                subject_re="音乐"
                            } else if(elem.subject==7){
                                subject_re="美术"
                            } else if(elem.subject==8){
                                subject_re="科学"
                            } else if(elem.subject==9){
                                subject_re="品德"
                            } else if(elem.subject==10){
                                subject_re="生物"
                            } else if(elem.subject==11){
                                subject_re="地理"
                            } else if(elem.subject==12){
                                subject_re="政治"
                            } else if(elem.subject==13){
                                subject_re="历史"
                            } else if(elem.subject==14){
                                subject_re="信息技术"
                            }else if(elem.subject==15){
                                 subject_re="通用技术"
                            }
                             if(elem.grade==0){
                                grade_re="一年级";
                            } else if(elem.grade==1){
                                grade_re="二年级";
                            } else if(elem.grade==2){
                                grade_re="三年级";
                            } else if(elem.grade==3){
                                grade_re="四年级";
                            }else if(elem.grade==4){
                                grade_re="五年级";
                            } else if(elem.grade==5){
                                grade_re="六年级";
                            } else if(elem.grade==6){
                                grade_re="七年级";
                            } else if(elem.grade==7){
                                grade_re="八年级";
                            } else if(elem.grade==8){
                                grade_re="九年级";
                            } else if(elem.grade==9){
                                 grade_re="高中";
                            }
                            return {
                                id:elem.id,
                                subject:subject_re,
                                grade:grade_re,
                                semester:elem.semester,
                                edition:elem.edition
                            };
                        })
                    }
                });
                }
            }
        });
    }   

     //编辑当前显示版本
    function update_Edition(req, res, next) {
        //此时的id是一个数组
        var phone=req.session.user;
        questions_m.update_Edition_addteacher(req.body,phone,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
    //编辑del-当前版本
    function updatedel_Edition(req, res, next) {
        //此时的id是一个数组
        var phone=req.session.user;
        questions_m.update_Edition_delteacher(req.body.id,phone,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
     //添加版本
    function add_Edition(req, res, next) {
        // 
        questions_m.add_Edition(req.body,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
    //版本筛选
    function query_Edition(req, res, next) {
        //三个值传进来
        var phone=req.session.user;
        questions_m.query_Edition(req.body,phone,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                console.log("controller:处理："+JSON.stringify(result));
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Editions:result.result.map(function(elem){
                            var subject_re="";
                            var grade_re="";
                            var status="";
                            if(elem.subject==0){
                                subject_re="艺术"
                            } else if(elem.subject==1){
                                subject_re="语文"
                            } else if(elem.subject==2){
                                subject_re="数学" 
                            } else if(elem.subject==3){
                                subject_re="英语"
                            }else if(elem.subject==4){
                                subject_re="物理"
                            } else if(elem.subject==5){
                                subject_re="化学"
                            } else if(elem.subject==6){
                                subject_re="音乐"
                            } else if(elem.subject==7){
                                subject_re="美术"
                            } else if(elem.subject==8){
                                subject_re="科学"
                            } else if(elem.subject==9){
                                subject_re="品德"
                            } else if(elem.subject==10){
                                subject_re="生物"
                            } else if(elem.subject==11){
                                subject_re="地理"
                            } else if(elem.subject==12){
                                subject_re="政治"
                            } else if(elem.subject==13){
                                subject_re="历史"
                            } else if(elem.subject==14){
                                subject_re="信息技术"
                            }else{
                                 subject_re="通用技术"
                            }
                             if(elem.grade==0){
                                grade_re="一年级";
                            } else if(elem.grade==1){
                                grade_re="二年级";
                            } else if(elem.grade==2){
                                grade_re="三年级";
                            } else if(elem.grade==3){
                                grade_re="四年级";
                            }else if(elem.grade==4){
                                grade_re="五年级";
                            } else if(elem.grade==5){
                                grade_re="六年级";
                            } else if(elem.grade==6){
                                grade_re="七年级";
                            } else if(elem.grade==7){
                                grade_re="八年级";
                            } else if(elem.grade==8){
                                grade_re="九年级";
                            } else{
                                 grade_re="高中";
                            }
                            return {
                                id:elem.id,
                                subject:subject_re,
                                grade:grade_re,
                                semester:elem.semester,
                                edition:elem.edition,
                                status:elem.status
                            };
                        }),
                        exsist:result.exsist,
                        
                        all_array:result.all_array
                    }
                });
            }
        });
    }
    //添加章节
    function add_Chapter(req, res, next) {
        //
        questions_m.add_Chapter(req.params.id,req.body,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
    //查询章节
    function query_Chapter(req, res, next) {
        // req.params.id为版本id
        questions_m.query_Chapter(req.params.id,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Chapter:result.map(function(elem){
                            return {
                                id:elem.id,
                                edition_m_id:elem.edition_m_id,
                                grade:elem.chapter_content,
                                edition:elem.index
                            };
                        })
                    }
                });
            }
        });
    }
    //添加课节
    function add_Classhour(req, res, next) {
        // 
        questions_m.add_Classhour(req.params.id,req.body,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
    //查询课节
    function query_Classhour(req, res, next) {
        // req.params.id为版本id
        questions_m.query_Classhour(req.params.id,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Classhour:result.map(function(elem){
                            return {
                                id:elem.id,
                                edition_m_id:elem.chapter_m_id,
                                grade:elem.classhour_content,
                                edition:elem.index
                            };
                        })     
                    }
                });
            }
        });
    }
    //根据课时id查询题库
    function query_Questions(req, res, next) {
        questions_m.query_Questions(req.params.id,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Questions:result.map(function(elem){
                             var type="";
                            if(elem.type=="0"){
                                type="单项选择题";
                            }else if(elem.type=="1"){
                                type="多项选择题";
                            }else{
                                type="判断题";
                            }
                            return {
                                id:elem.id,
                                classhour_m_id:elem.classhour_m_id,
                                title_content:elem.title_content,
                                type:type,
                                answer_ok:elem.answer_ok,
                                analysis:elem.analysis,
                                knowledge_point:elem.knowledge_point,
                                answer_list:elem.answer_list,
                                facility_value:elem.facility_value,
                                score_value:elem.score_value,
                                photo_url:elem.photo_url,
                                post_phone:elem.post_phone
                            };
                        })     
                    }
                });
            
            }
        });
    }
    //根据题库id查询题库
    function check_Questions(req, res, next) {
        // req.params.id为题库id
        questions_m.check_Questions(req.params.id,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{
                        Questions:result.map(function(elem){
                            return {
                                id:elem.id,
                                classhour_m_id:elem.classhour_m_id,
                                title_content:elem.title_content,
                                type:elem.type,
                                answer_ok:elem.answer_ok,
                                analysis:elem.analysis,
                                knowledge_point:elem.knowledge_point,
                                answer_list:elem.answer_list,
                                facility_value:elem.facility_value,
                                score_value:elem.score_value
                            };
                        })     
                    }
                });
            }
        });
    }
    //添加课题
    function add_Questions(req, res, next) {
        var post_phone=req.session.user;
        if(post_phone=="13088880001"||post_phone=="13088880002"||post_phone=="13088880003"||post_phone=="13088880004"||post_phone=="13088880005"||post_phone=="13088880006"||post_phone=="13088880007"||post_phone=="13088880008"||post_phone=="13088880009"||post_phone=="13088880010"){
            post_phone="0";
        }else{
            post_phone="1";
        }
        questions_m.add_Questions(req.params.id,req.body,post_phone,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
     //删除课题
    function delete_Questions(req, res, next) {
        // 
        questions_m.delete_Questions(req.params.id,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
    //修改课题
    function modify_Questions(req, res, next) {
        // 
        questions_m.modify_Questions(req.params.id,req.body,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{}
                });
            }
        });
    }
    //查询版本下的章节和课时
    function query_All(req, res, next) {
        // req.params.id为版本id
        questions_m.query_All(req.params.id,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'fail',
                    data:{}
                });
            }else{
                res.json({
                    success:0,
                    desc:'success',
                    data:{ 
                       chapter_classhour:result.map(function(elem){
                           
                            return {
                                chapter_m_id:elem.chapter_id,
                                classhour_content:elem.chapter_content,
                                index_c:elem.index_c,
                                classhour:elem.classhours
                            };
                       }),
                       First_id:result.map(function(elem){
                           if(elem.classhours.length>0){//判断如果第一章下空课时
                           return{
                               First_id:elem.classhours[0].classhour_id
                           }
                           }
                       })  
                    }
                });
            }
        });
    }
    //上传photo
 function uploadPhoto(req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir:path.join(__dirname, '..', 'public', 'images-questions')
    });
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
     if (err) {
            res.json({
                success: -1,
                desc:'fail',
                data:{}
            });
        } else {
            var inputFile = files.media[0];
            var uploadedPath = inputFile.path;
            var image_url = '/images-questions/' + path.parse(uploadedPath).base;
            var url_name=path.parse(uploadedPath).base;
            console.log(image_url+"试题图片路径");
             res.json({
                success: 0,
                desc:'success',
                data:{
                    image_url:image_url
                }
            });    
        }
    });
};
  //上传一个版本csv
 function uploadCsv(req, res, next) {
    var filepath = 'd:/cvs/11.csv';//csv路径
   //var filepath=req.body.path;//绝对路径
    csv.mapFile(filepath,function(err, data) {
       
      //Outputs: [ { id: '1', user: 'foo', pass: 'bar' } ]
       questions_m.insert_All(data,function(err,result){
           if(err){
            // res.json({
            //     success: -1,
            //     desc:'fail',
            //     data:{}
            // });
              
           }else{
            //  res.json({
            //     success: 0,
            //     desc:'success',
            //     data:{}
            // }); 
           }
             
       })
      //Outputs: [ { id: '1', user: 'foo', pass: 'bar' } ]
      // var edition={subject:"数学",grade:"小学三年级",semester:"上学期",edition:"批量插入测试一版本",status:"0"}//先不管
      //   var chapter=["3.1 测试一章节","3.2 测试二章节"];//章节数组
      //   var classhour=[["3.11 测试一章节的课时","3.12 测试一章节的第二课时","3.13 测试一章节的第三课时"],["3.21 测试二章节的课时","3.22 测试二章节的第二课时"]]; 
      //   var data={edition:edition,chapter:chapter,classhour:classhour};   
    });
};
//添加标签
    function add_Bookmark(req, res, next) {
       var phone=req.session.user;//不可重复
       //或者查询一下当前phone下的用户名把phone进去
       var questions_id=req.body.id;//题库id数组
       var index=1;
       var index_one=1;
         if (phone==""||phone==null) {
            res.redirect('/');//session拦截处理
        } else {
            console.log(JSON.stringify(questions_id));
     //  questions_id.forEach(function(question_id){
           //add之前先进性查询  == 0的 当前老师的书签
           questions_m.query_Bookmark_Exist(phone,questions_id[0],function(err,result){
               if(err){
                   res.json({
                       success:-1,
                       desc:'fail',
                       data:{}
                   })
               }else{
                   //如果不存在添加 存在 不添加
                   if(result==""||result==null){
                         console.log("新添加");
                         questions_m.add_Bookmark(phone,questions_id[0],function(err,result){
                            if(err){
                                res.json({
                                    success:-1,
                                    desc:'fail',
                                    data:{}
                                });
                            }else{
                               // if(index_one==questions_id.length){
                                    res.json({
                                    success:0,
                                    desc:'success',
                                    data:{
                                    }
                                });
                            // }else{
                            //     index_one++;
                            //  }  
                            }
                        });
                   }else{//存在 不添加
                //    if(index_one==questions_id.length){
                //     console.log("更新");
                     res.json({
                       success:1,
                       desc:'fail:文件存在',
                       data:{}
                    })
                //    }else{
                //      index_one++;                       
                //    }
                   }
               }
           });
       //});
    }
    }
    //删除标签
    function delete_Bookmark(req, res, next) {
       var phone=req.session.user;//不可重复
       var bookmarks_id=req.body.id;//书签id数组
         if (phone==""||phone==null) {
            res.redirect('/');//session拦截处理
        } else {
           questions_m.delete_Bookmark(bookmarks_id,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'fail',
                    data:{}
                });
            }else{
              
                    res.json({
                    success:0,
                    desc:'success',
                    data:{
                    }
                }); 
            }
       });
    }
    }
//清空书签
    function empty_Bookmark(req, res, next) {
       var phone=req.session.user;//不可重复
         if (phone==""||phone==null) {
            res.redirect('/');//session拦截处理
        } else {
           questions_m.empty_Bookmark(phone,function(err,result){
            if(err){
                res.json({
                    success:-1,
                    desc:'fail',
                    data:{}
                });
            }else{
                    res.json({
                    success:0,
                    desc:'success',
                    data:{
                    }
                }); 
            }
       });
    }
    }
    //获取书签列表
    function get_Bookmark_list(req, res, next) {
        var phone=req.session.user;//不可重复
          if (phone==""||phone==null) {
            res.redirect('/');//session拦截处理
        } else {
        questions_m.get_Bookmark_list(phone,function(err,result){//根据phone获取questions_m_id
            if(err){
                res.json({
                    success:-1,
                    desc:'失败',
                    data:{}
                });
            }else{
                //根据课时id查询章节id查询版本id
                console.log("版本课时查询：："+JSON.stringify(result));
                    questions_m.get_chapter(result,function(err,result){
                        if(err){
                            res.json({success:-1,desc:"err"})
                        }else{
                             res.json({
                                success: 0,
                                desc:'success',
                                data:{
                                    Book_mark:result.map(function(elem){
                                        var type="";
                                        if(elem.type=="0"){
                                            type="单项选择题";
                                        }else if(elem.type=="1"){
                                            type="多项选择题";
                                        }else{
                                            type="判断题";
                                        }
                                        console.log(elem.classhour_m_id)
                                        return{
                                            id:elem.bookmark_id,
                                            question_id:elem.question_id,
                                            title_content:elem.title_content,
                                            answer_ok:elem.answer_ok,
                                            knowledge_point:elem.knowledge_point,
                                            facility_value:elem.facility_value,
                                            score_value:elem.score_value,
                                            photo_url:elem.photo_url,
                                            answer_list:elem.answer_list,
                                            type:type,
                                            node_name:elem.classhour_m_id
                                        }
                                    })
                                } 
                            });
                        }
                    });
                }
        });
    }
}
//获取书签列表
    function get_Bookmark(req, res, next) {
         var id=req.params.id;//此时不对
         var phone=req.session.user;//不可重复
         var book_mark_id=[];
            if (phone==""||phone==null) {
                res.redirect('/');//session拦截处理
            } else {
            questions_m.get_Bookmark_list(phone,function(err,result){//根据phone获取questions_m_id
                if(err){
                    res.json({
                        success:-1,
                        desc:'失败',
                        data:{}
                    });
                }else{
                    result.forEach(function(elem){
                        book_mark_id.push(elem.bookmark_id);
                    });
                     console.log("书签遍历"+book_mark_id);
                     console.log("书签id"+id);
                     questions_m.get_Bookmark(id,book_mark_id,function(err,result){//根据phone获取questions_m_id
                        if(err){
                            res.json({
                                success:-1,
                                desc:'失败',
                                data:{}
                            });
                        }else{
                            res.json({
                                success: 0,
                                desc:'success',
                                data:{
                                    Book_mark:result.map(function(elem){
                                        return{
                                            id:elem.bookmark_id,
                                            question_id:elem.question_id,
                                            title_content:elem.title_content,
                                            answer_ok:elem.answer_ok,
                                            knowledge_point:elem.knowledge_point,
                                            facility_value:elem.facility_value,
                                            score_value:elem.score_value,
                                            photo_url:elem.photo_url,
                                            answer_list:elem.answer_list,
                                            type:elem.type,
                                            current_location:elem.current_location,
                                            end_start_up:elem.end_start_up,
                                            end_start_down:elem.end_start_down,
                                            book_mark_id:elem.all_questions_count
                                        }
                                    })
                                } 
                            });
                        }
                    });
                }
            });
        }
    }
    //上一个书签下一个书签
        function get_Bookmark_Next(req, res, next) {
         var next=req.body.next;//上一个-1  下一个1
         var phone=req.session.user;//不可重复
         var current=req.body.current_location;
         var book_mark_id=[];
            if (phone==""||phone==null) {
                res.redirect('/');//session拦截处理
            } else {
            questions_m.get_Bookmark_list(phone,function(err,result){//根据phone获取questions_m_id
                if(err){
                    res.json({
                        success:-1,
                        desc:'失败',
                        data:{}
                    });
                }else{
                    result.forEach(function(elem){
                        book_mark_id.push(elem.bookmark_id);
                    });
                     console.log("书签遍历"+book_mark_id);
                     questions_m.get_Bookmark_Next(book_mark_id,current,next,function(err,result){//根据phone获取questions_m_id
                        if(err){
                            res.json({
                                success:-1,
                                desc:'失败',
                                data:{}
                            });
                        }else{
                            res.json({
                                success: 0,
                                desc:'success',
                                data:{
                                    Book_mark:result.map(function(elem){
                                        return{
                                            id:elem.bookmark_id,
                                            question_id:elem.question_id,
                                            title_content:elem.title_content,
                                            answer_ok:elem.answer_ok,
                                            knowledge_point:elem.knowledge_point,
                                            facility_value:elem.facility_value,
                                            score_value:elem.score_value,
                                            photo_url:elem.photo_url,
                                            answer_list:elem.answer_list,
                                            type:elem.type,
                                            current_location:elem.current_location,
                                            end_start_up:elem.end_start_up,
                                            end_start_down:elem.end_start_down
                                        }
                                    })
                                } 
                            });
                        }
                    });
                }
            });
        }
    }
    //获取
    function get_Questions(req, res, next) {
         var phone=req.session.user;
         var id=req.params.id;
         var classhour_m_id=req.body.classhour_m_id;
         var questions_m_id=[];
            if (phone==""||phone==null) {
                res.redirect('/');//session拦截处理
            } else {
            questions_m.get_question_list(classhour_m_id,function(err,result){//根据课时id获取当前课时下的所有答题
                if(err){
                    res.json({
                        success:-1,
                        desc:'失败',
                        data:{}
                    });
                }else{
                    result.forEach(function(elem){
                        questions_m_id.push(elem.id);
                    });
                     console.log("答题遍历数组:"+questions_m_id);
                     console.log("答题id:"+id);
                     questions_m.get_Questions_Book(id,questions_m_id,function(err,elem){//根据phone获取questions_m_id
                        if(err){
                            res.json({
                                success:-1,
                                desc:'失败',
                                data:{}
                            });
                        }else{
                            res.json({
                                success: 0,
                                desc:'success',
                                data:{
                                            id:elem.bookmark_id,
                                            question_id:elem.question_id,
                                            title_content:elem.title_content,
                                            answer_ok:elem.answer_ok,
                                            knowledge_point:elem.knowledge_point,
                                            facility_value:elem.facility_value,
                                            score_value:elem.score_value,
                                            photo_url:elem.photo_url,
                                            answer_list:elem.answer_list,
                                            type:elem.type,
                                            current_location:elem.current_location,
                                            end_start_up:elem.end_start_up,
                                            end_start_down:elem.end_start_down,
                                            all_questions_count:elem.all_questions_count
                                } 
                            });
                        }
                    });
                }
            });
        }
    }
     //上一个答题下一个答题
        function get_Questions_Next(req, res, next) {
         var phone=req.session.user;
         var next=req.body.next;//上一个-1  下一个1
         var current=req.body.current_location;
         var classhour_m_id=[];
            if (phone==""||phone==null) {
                res.redirect('/');//session拦截处理
            } else {
            questions_m.get_question_list(req.body.classhour_m_id,function(err,result){//根据课时id获取当前课时下的所有答题
                if(err){
                    res.json({
                        success:-1,
                        desc:'失败',
                        data:{}
                    });
                }else{
                    result.forEach(function(elem){
                        classhour_m_id.push(elem.id);
                    });
                     console.log("上一题下一题："+classhour_m_id);
                     questions_m.get_Questions_Next(classhour_m_id,current,next,function(err,elem){//根据phone获取questions_m_id
                        if(err){
                            res.json({
                                success:-1,
                                desc:'失败',
                                data:{}
                            });
                        }else{
                            console.log("上一题下一题：："+JSON.stringify(elem));
                            res.json({
                                success: 0,
                                desc:'success',
                                data:{
                                            id:elem.bookmark_id,
                                            question_id:elem.question_id,
                                            title_content:elem.title_content,
                                            answer_ok:elem.answer_ok,
                                            knowledge_point:elem.knowledge_point,
                                            facility_value:elem.facility_value,
                                            score_value:elem.score_value,
                                            photo_url:elem.photo_url,
                                            answer_list:elem.answer_list,
                                            type:elem.type,
                                            current_location:elem.current_location,
                                            end_start_up:elem.end_start_up,
                                            end_start_down:elem.end_start_down
                                } 
                            });
                        }
                    });
                }
            });
        }
    }
    return {
        getEdition:getEdition,
        update_Edition:update_Edition,
        add_Edition:add_Edition,
        query_Edition:query_Edition,
        add_Chapter:add_Chapter,
        add_Classhour:add_Classhour,
        query_Chapter:query_Chapter,
        query_Classhour:query_Classhour,
        query_Questions:query_Questions,
        check_Questions:check_Questions,
        add_Questions:add_Questions,
        delete_Questions:delete_Questions,
        modify_Questions:modify_Questions,
        //查询莫版本下的章节和课时
        query_All:query_All,
        uploadPhoto:uploadPhoto,
        updatedel_Edition:updatedel_Edition,
        uploadCsv:uploadCsv,
        //书签
        add_Bookmark:add_Bookmark,
        delete_Bookmark:delete_Bookmark,
        empty_Bookmark:empty_Bookmark,
        get_Bookmark_list:get_Bookmark_list,
        get_Bookmark:get_Bookmark,
        get_Bookmark_Next:get_Bookmark_Next,
        //答题白板
        get_Questions:get_Questions,
        get_Questions_Next:get_Questions_Next,
        //获取老师自己的版本
        getEdition_Teacher:getEdition_Teacher

    };
})();

module.exports = exports = Questions;