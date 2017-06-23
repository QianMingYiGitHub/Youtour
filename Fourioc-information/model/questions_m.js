
var questions_m_sql = require('./questions_m_sql');
//添加版本
module.exports.add_Edition = function(data,cb) {
     questions_m_sql.add_Edition(data,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//查询数据
module.exports.getEdition = function(cb) {
     questions_m_sql.getEdition(function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//查询老师自己的版本
module.exports.getEdition_Teacher = function(phone,cb) {
    var edition_m_id="";
    questions_m_sql.query_edition_id(phone,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,result)
            }else{
                result.map(function(element){
                    console.log(element);
                   edition_m_id=element.eidition_m_id;
                });
                console.log(edition_m_id);
                if(edition_m_id==""){
                     cb(null,"");
                }else{
                questions_m_sql.getEdition_In(phone,edition_m_id,function(err, result) {//回函数
                    if(err){
                        cb(err);
                    }else{
                        console.log(JSON.stringify(result));
                        cb(null,result);
                    }
                });
            }
           }
        }
    });
    
}
//编辑当前显示版本
module.exports.update_Edition = function(data,cb) {
   
     questions_m_sql.update_Edition(data.id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//编辑版本-删除
module.exports.updatedel_Edition = function(id,cb) {
     console.log(id);
     questions_m_sql.updatedel_Edition(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//版本筛选
module.exports.query_Edition = function(data,phone,cb) {
    var eidition_m_id="";
    var eidition_m_id_one=[];
    var eidition_m_id_two=[];
    var return_all={result:"",exsist:[],all_array:[]};
  
     questions_m_sql.query_edition_id(phone,function(err,result){
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){
                   eidition_m_id="";
                  
                    questions_m_sql.query_Edition(data,eidition_m_id,function(err, result) {//回函数
                        if(err){
                            cb(err);
                        }else{
                         result.map(function(elem){
                        eidition_m_id_two.push(elem.id)
                         })
                        return_all.result=result;
                        return_all.exsist=[];
                        return_all.all_array=eidition_m_id_two;
                         cb(null,return_all);
                        }
                    });
             }else{
                result.map(function(element){
                    eidition_m_id=element.eidition_m_id;
                });
         
            eidition_m_id_one=eidition_m_id.split(","); //字符分割 
          
            return_all.exsist=eidition_m_id_one
               questions_m_sql.query_Edition_all(data,eidition_m_id,function(err, result) {//回函数
                if(err){
                    cb(err);
                }else{
                    result.map(function(elem){
                        eidition_m_id_two.push(elem.id)
                    })
                
                    return_all.result=result;
                    return_all.all_array=eidition_m_id_two;
                    
                    cb(null,return_all);
                }
            });
         }
         }
     })
}
//
module.exports.query_Edition_Two = function(data,phone,cb) {
    var eidition_m_id="";
    var eidition_m_id_one=[];
    var eidition_m_id_two=[];
    var return_all={result:"",exsist:"",all_array:""};
    console.log("电话："+phone);
     questions_m_sql.query_edition_id(phone,function(err,result){
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){
                   eidition_m_id="";
                   console.log("字符串："+eidition_m_id);
                    questions_m_sql.query_Edition(data,eidition_m_id,function(err, result) {//回函数
                        if(err){
                            cb(err);
                        }else{
                        cb(null,result);
                        }
                    });
             }else{
                result.map(function(element){
                    eidition_m_id=element.eidition_m_id;
                });
            console.log("字符串："+eidition_m_id);
            eidition_m_id_one=eidition_m_id.split(","); //字符分割 
            console.log("存在的数组id："+eidition_m_id_one);
            return_all.exsist=eidition_m_id_one
               questions_m_sql.query_Edition_all(data,eidition_m_id,function(err, result) {//回函数
                if(err){
                    cb(err);
                }else{
                    result.map(function(elem){
                        eidition_m_id_two.push(elem.id)
                    })
                    console.log("所有版本id:"+eidition_m_id_two);
                    return_all.result=result;
                    return_all.all_array=eidition_m_id_two;
                    console.log(JSON.stringify(return_all));
                    cb(null,return_all);
                }
            });
         }
         }
     })
}
//添加章节
module.exports.add_Chapter = function(id,data,cb) {
     questions_m_sql.add_Chapter(id,data,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
} 
//查询章节
module.exports.query_Chapter = function(id,cb) {
     questions_m_sql.query_Chapter(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//添加课节
module.exports.add_Classhour = function(id,data,cb) {
     questions_m_sql.add_Classhour(id,data,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
 //查询课节
module.exports.query_Classhour = function(id,cb) {
     questions_m_sql.query_Classhour(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
 //根据课时id查询题库
module.exports.query_Questions = function(id,cb) {
     questions_m_sql.query_Questions(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
 //根据题库id查询题库
module.exports.check_Questions = function(id,cb) {
     questions_m_sql.check_Questions(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
 //添加课题
module.exports.add_Questions = function(id,data,post_phone,cb) {
     questions_m_sql.add_Questions(id,data,post_phone,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
 //删除课题
module.exports.delete_Questions = function(id,cb) {
     questions_m_sql.delete_Questions(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
 //修改课题
module.exports.modify_Questions = function(id,data,cb) {
     questions_m_sql.modify_Questions(id,data,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//查询版本下的章节和课时
module.exports.query_All = function(id,cb) {
    //查询出该版本下的章节id[]
     var chapter_classhour_all=[];
      var chapter_classhour={};
     questions_m_sql.query_ChapterAll(id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
            //查询出该所有章节id下的课时
           var index_b=result.length;
           var index_c=0;
            result.forEach(function(element) { //章节遍历
                var chapter_id=element.id;//章节id
                var chapter_content=element.chapter_content;//章节内容
                var chapter_index_c=element.index_c;//前台排序用
                questions_m_sql.query_ClasshourAll(chapter_id,function(err,classhour_result){//查询章节id下的所有课时
                if(err){
                     cb(err);
                }else{
                    var classhours=[];//课时数组
                    for(var i= 0,classhour_r;classhour_r=classhour_result[i++];){//遍历数组
                         var classhour={classhour_id:"",classhour_content:"",classhour:""};//位置不同有不同的效果 每次遍历新new 一个对象
                         classhour.classhour_id=classhour_r.id;
                         classhour.classhour_content=classhour_r.classhour_content;
                         classhours.push(classhour);
                    }
                          chapter_classhour={chapter_id:chapter_id,chapter_content:chapter_content,index_c:chapter_index_c,classhours:classhours};//此时返回的是一个章节下的所有章节和id
                          chapter_classhour_all.push(chapter_classhour);
                           index_c++;
                       
                          if(index_b==index_c){
                                chapter_classhour_all.sort(Sort('index_c'));//排序
                                cb(null,chapter_classhour_all);//循环执行完毕返回结果
                          }
                }
             })
            });
        }
     });
}
//排序
 function Sort(data){
    return function(a,b){
        var value1 = a[data];
        var value2 = b[data];
        return value1 - value2;
    }
}//正序 
 function Sort_desc(data){
    return function(a,b){
        var value1 = a[data];
        var value2 = b[data];
        return value2 - value1;
    }
}//倒序 
//console.log(arr.sort(compare('age')))

//批量导入一个本书
module.exports.insert_All = function(data,cb) {
        console.log(data); 
        var edition={subject:"",grade:"",semester:"",edition:"",status:"0"}
        var chapter=[];//章节数组
        var classhour=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    //有几章节就多长
     var index_all=0;
     var index_chapter=0;
     data.forEach(function(element){
         if(element.list=="0"){
             console.log("element.content.length:"+element.content.length);
             //人教版二年级语文上册  10
             //北大师版二年级语文上册  11
             //人教版高中语文上册 9 
             //人教版二年级信息技术上册 12
             //北大师版二年级信息技术上册 13
             if(element.content.length==10){
             var edition_all=element.content;
             edition.edition = edition_all.substr(0,3);
             edition.grade = edition_all.substr(3,2)+"级";
             edition.subject = edition_all.substr(6,2);
             edition.semester = edition_all.substr(8,1)+"学期";
             }else if(element.content.length==11){
                  var edition_all=element.content;
             edition.edition = edition_all.substr(0,4);
             edition.grade = edition_all.substr(4,2)+"级";
             edition.subject = edition_all.substr(7,2);
             edition.semester = edition_all.substr(9,1)+"学期";
             }else{
             var edition_all=element.content;
             edition.edition = edition_all.substr(0,3);
             edition.grade = edition_all.substr(3,2)+"级";
             edition.subject = edition_all.substr(6,4);
             edition.semester = edition_all.substr(8,1)+"学期";
             }   
         }else if(element.list=="1"){
             //章节id
             var chapter_all=element.content
             chapter.push(element.content);
             if(index_chapter!=0){
                  index_all++;//第一遍不执行
             }
              index_chapter++;
         }else if(element.list=="2"){
             //课时
              classhour[index_all].push(element.content);
              console.log(classhour);
         }

     })
    var data={edition:edition,chapter:chapter,classhour:classhour};
    console.log("cvs:test::"+JSON.stringify(data));
        var index_clashour=0; 
        var index_sort=0;//位置
        var index_hour_c=0;
    //插入版本
    questions_m_sql.add_Edition(data.edition,function(err,result_edition_id){
        if(err){
            cb(err);
        }else{
            //获取insert的版本id
            var edition_id=result_edition_id;
            var index_c=0;
            data.chapter.forEach(function(element){
                //循环插入章节 从第一个开始 此时是随便挑一个插入
                 index_c++;
                questions_m_sql.add_Chapter(edition_id,element,index_c,function(err,result_chapter_id){
                    if(err){
                         cb(err);
                    }else{
                         var sort_id=[];
                        questions_m_sql.query_Id(edition_id,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                               result.map(function(element){
                                   sort_id.push(element.id);
                               })
                                console.log("sort_id:"+sort_id);
                               var id=[];
                                var chapter_id=sort_id[index_sort];//此时的id获取的不是按顺序来的
                                data.classhour[index_clashour].forEach(function(element){
                                    
                                    questions_m_sql.add_Classhour(chapter_id,element,index_hour_c,function(err,result){
                                        if(err){
                                            cb(err);
                                        }else{
                                        console.log("sss"+index_clashour);
                                            cb(null,result);
                                        //批量导入课题太大了但是也可以实现
                                        }
                                    })
                                    index_hour_c++;
                                })
                                index_clashour++;
                                index_sort++;   
                            }
                        })
                    }
                })
                 cb(null,result_edition_id);//循环完毕返回结果
            })
        }

    })
      
}
//添加书签
module.exports.add_Bookmark = function(phone,question_id,cb) {
     questions_m_sql.add_Bookmark(phone,question_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//删除书签
module.exports.delete_Bookmark = function(bookmark_id,cb) {
     questions_m_sql.delete_Bookmark(bookmark_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//清空书签
module.exports.empty_Bookmark = function(phone,cb) {
     questions_m_sql.empty_Bookmark(phone,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}
//获取书签列表
module.exports.get_Bookmark_list = function(phone,cb) {
    var bookmarks_id=[];
    var questions_id=[];
    var questions_bookmark=[];
    var index=1;//当是1的时候已经开始执行了
    var book_mark_index=0;

     questions_m_sql.get_Bookmark_list(phone,function(err, result) {//
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){//没有书签的情况
                 cb(null,result);
             }else{
             result.map(function(element){
                 questions_id.push(element.questions_m_id);
                 bookmarks_id.push(element.id);
             });
             console.log(questions_id);
            // console.log(bookmarks_id[0]+"<>"+bookmarks_id[1]);
             questions_id.forEach(function(question_id){
                 var questions={bookmark_id:"",question_id:question_id,classhour_m_id:"",title_content:"",answer_ok:"",knowledge_point:"",facility_value:"",score_value:"",photo_url:"",answer_list:"",type:""};//每次开始一个新的数组
                 questions.bookmark_id=bookmarks_id[book_mark_index];//给数组赋值
                 questions_m_sql.query_Questions_Mark(question_id,function(err,result){//此时修改
                     if(err){
                         cb(err);
                     }else{
                         //遍历数组
                         result.map(function(element){//可以得到课时id
                             questions.title_content=element.title_content;
                             questions.answer_ok=element.answer_ok;
                             questions.knowledge_point=element.knowledge_point;
                             questions.facility_value=element.facility_value;
                             questions.score_value=element.score_value;
                             questions.photo_url=element.photo_url;
                             questions.answer_list=element.answer_list;
                             questions.type=element.type;
                             questions.classhour_m_id=element.classhour_m_id;
                         });
                         questions_bookmark.push(questions);
                         //console.log("单个数组："+JSON.stringify(questions_bookmark));
                         if(index==questions_id.length){
                             console.log("总数组："+JSON.stringify(questions_bookmark));
                             questions_bookmark.sort(Sort_desc('bookmark_id'));//排序
                             console.log("排序："+JSON.stringify(questions_bookmark));
                            // chapter_classhour_all.sort(Sort('index_c'));//排序
                             cb(null,questions_bookmark);
                         }else{
                             index++;
                         }
                     }
                 })
                  book_mark_index++;//注意位置
             })
             }
         }
     });
}
//根据id获取书签
module.exports.get_Bookmark = function(id,book_mark_id,cb) {
    var bookmarks_id=[];
    var questions_id=[];
    var questions_bookmark=[];
    var index=1;//当是1的时候已经开始执行了
    var book_mark_index=0;
     questions_m_sql.get_Bookmark(id,function(err, result) {//
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){//没有书签的情况
                 cb(null,result);
             }else{
             result.map(function(element){
                 questions_id.push(element.questions_m_id);
                 bookmarks_id.push(element.id);
             });
             console.log(questions_id);
            // console.log(bookmarks_id[0]+"<>"+bookmarks_id[1]);
             questions_id.forEach(function(question_id){
                 var questions={bookmark_id:"",question_id:question_id,title_content:"",answer_ok:"",knowledge_point:"",facility_value:"",score_value:"",photo_url:"",answer_list:"",type:"",current_location:"",end_start_up:0,end_start_down:0,all_questions_count:book_mark_id.length};//每次开始一个新的数组
                  questions.bookmark_id=bookmarks_id[book_mark_index];//给数组赋值
                  console.log("书签id;"+id);
                  var local=book_mark_id.indexOf(parseInt(id));
                  if(local==0&&book_mark_id.length==1){
                      questions.end_start_up=-1;
                      questions.end_start_down=-1;
                  }
                  else if(local==0){
                       questions.end_start_up=-1;
                  }else if(local==(book_mark_id.length-1)){
                       questions.end_start_down=-1;
                  }else{
                       questions.end_start=0;
                  }
                  questions.current_location=local;
                  console.log("id所在位置："+local);
                 questions_m_sql.query_Questions_Mark(question_id,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                         //遍历数组
                         result.map(function(element){
                             questions.title_content=element.title_content;
                             questions.answer_ok=element.answer_ok;
                             questions.knowledge_point=element.knowledge_point;
                             questions.facility_value=element.facility_value;
                             questions.score_value=element.score_value;
                             questions.photo_url=element.photo_url;
                             questions.answer_list=element.answer_list;
                             questions.type=element.type;
                         });
                         questions_bookmark.push(questions);
                         console.log("单个数组："+JSON.stringify(questions_bookmark));
                         if(index==questions_id.length){
                             console.log("总数组："+JSON.stringify(questions_bookmark));
                             cb(null,questions_bookmark);
                         }else{
                             index++;
                         }
                     }
                 })
                  book_mark_index++;//注意位置
             })
             }
         }
     });
}
//下一个书签上一个书签
module.exports.get_Bookmark_Next = function(book_mark_id,current,next,cb) {//现在所在的位置
    var bookmarks_id=[];
    var questions_id=[];
    var questions_bookmark=[];
    var index=1;//当是1的时候已经开始执行了
    var book_mark_index=0;
    console.log(current);
    console.log("book_mark_id.length"+book_mark_id.length);
    var current_location="";
    var end_start_up=0;
    var end_start_down=0;
    var local=0;
    if(next=="-1"){//上一题
         current_location= parseInt(current)-1;
         if(current_location==0){
            end_start_up=-1;
         }
        else if(current_location<0){
             local=current_location;
            end_start_up=-1;
        }else{
             local=current_location;
        }
    }else{//下一题
        current_location= parseInt(current)+1;
        if(current_location==(book_mark_id.length-1)){
             end_start_down=-1;
        }
        else if(current_location>book_mark_id.length-1){
              local=current_location;
             end_start_down=-1;
        }
        console.log("id所在位置："+local);
        local=current_location;//book_mark_id.indexOf(book_mark_id[current_location])
    }
    console.log("要查询的书签id："+book_mark_id[current_location]);
     questions_m_sql.get_Bookmark(book_mark_id[current_location],function(err, result) {//
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){//没有书签的情况
                 cb(null,result);
             }else{
             result.map(function(element){
                 questions_id.push(element.questions_m_id);
                 bookmarks_id.push(element.id);
             });
             console.log(questions_id);
            // console.log(bookmarks_id[0]+"<>"+bookmarks_id[1]);
             questions_id.forEach(function(question_id){//此时只有一条
                 var questions={bookmark_id:"",question_id:question_id,title_content:"",answer_ok:"",knowledge_point:"",facility_value:"",score_value:"",photo_url:"",answer_list:"",type:"",current_location:0,end_start_up:0,end_start_down:0};//每次开始一个新的数组
                 questions.bookmark_id=bookmarks_id[book_mark_index];//给数组赋值
                 questions.current_location=local;
                 questions.end_start_up=end_start_up;
                 questions.end_start_down=end_start_down;
                 questions_m_sql.query_Questions_Mark(question_id,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                         //遍历数组
                         result.map(function(element){
                             questions.title_content=element.title_content;
                             questions.answer_ok=element.answer_ok;
                             questions.knowledge_point=element.knowledge_point;
                             questions.facility_value=element.facility_value;
                             questions.score_value=element.score_value;
                             questions.photo_url=element.photo_url;
                             questions.answer_list=element.answer_list;
                             questions.type=element.type;
                         });
                         questions_bookmark.push(questions);
                         console.log("单个数组："+JSON.stringify(questions_bookmark));
                         if(index==questions_id.length){
                             console.log("总数组："+JSON.stringify(questions_bookmark));
                             cb(null,questions_bookmark);
                         }else{
                             index++;
                         }
                     }
                 })
                  book_mark_index++;//注意位置
             })
             }
         }
     });
}

//是根据课时id查询该课时下的所有题
module.exports.get_question_list = function(classhour_m_id,cb) {
     questions_m_sql.get_question_list(classhour_m_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
           cb(null,result);
         }
     });
}


//根据id获取答题所在的位置判断是否有下一个试题
module.exports.get_Questions_Book = function(id,questions_m_id,cb) {
               // var  questions_m_id=[16,18,19,31];
                var questions_bookmark=[];
                var book_mark_index=0;
                var questions={bookmark_id:"",question_id:"",title_content:"",answer_ok:"",knowledge_point:"",facility_value:"",score_value:"",photo_url:"",answer_list:"",type:"",current_location:"",end_start_up:0,end_start_down:0,all_questions_count:questions_m_id.length};//每次开始一个新的数组
                  questions.bookmark_id=questions_m_id[book_mark_index];//给数组赋值
                  console.log("书签id;"+id);
                  var local=questions_m_id.indexOf(parseInt(id));
                  if(local==0&&questions_m_id.length==1){
                      questions.end_start_up=-1;
                      questions.end_start_down=-1;
                  }
                  else if(local==0){
                       questions.end_start_up=-1;
                  }else if(local==(questions_m_id.length-1)){
                       questions.end_start_down=-1;
                  }else{
                       questions.end_start=0;
                  }
                  questions.current_location=local;
                  console.log("id所在位置："+local);
                 questions_m_sql.query_Questions_Mark(id,function(err,result){//根据答题id获取该题所在的位置和所有数据
                     if(err){
                         cb(err);
                     }else{
                         //遍历数组
                         result.map(function(element){
                             questions.title_content=element.title_content;
                             questions.answer_ok=element.answer_ok;
                             questions.knowledge_point=element.knowledge_point;
                             questions.facility_value=element.facility_value;
                             questions.score_value=element.score_value;
                             questions.photo_url=element.photo_url;
                             questions.answer_list=element.answer_list;
                             questions.type=element.type;
                         });
                         console.log(JSON.stringify(questions));
                             cb(null,questions);
                     }
             })
}

//下一个答题上一个答题
module.exports.get_Questions_Next = function(classhour_m_id,current,next,cb) {//现在所在的位置
                var bookmarks_id=[];
                var questions_id=[];
                var questions_bookmark=[];
                var index=1;//当是1的时候已经开始执行了
                var book_mark_index=0;
                console.log(current);
                console.log("classhour_m_id.length"+classhour_m_id.length);
                var current_location="";
                var end_start_up=0;
                var end_start_down=0;
                var local=0;
                if(next=="-1"){//上一题
                    current_location= parseInt(current)-1;
                    if(current_location==0){
                        end_start_up=-1;
                    }
                    else if(current_location<0){
                        local=current_location;
                        end_start_up=-1;
                    }else{
                        local=current_location;
                    }
                }else{//下一题
                    current_location= parseInt(current)+1;
                    if(current_location==(classhour_m_id.length-1)){
                        end_start_down=-1;
                    }
                    else if(current_location>classhour_m_id.length-1){
                        local=current_location;
                        end_start_down=-1;
                    }
                    console.log("id所在位置："+local);
                    local=current_location;//book_mark_id.indexOf(book_mark_id[current_location])
                }
                console.log("要查询的问题id："+classhour_m_id[current_location]);
                 var questions={bookmark_id:"",question_id:"",title_content:"",answer_ok:"",knowledge_point:"",facility_value:"",score_value:"",photo_url:"",answer_list:"",type:"",current_location:0,end_start_up:0,end_start_down:0};//每次开始一个新的数组
                 questions.bookmark_id=bookmarks_id[book_mark_index];//给数组赋值
                 questions.current_location=local;
                 questions.end_start_up=end_start_up;
                 questions.end_start_down=end_start_down;
                 questions_m_sql.query_Questions_Mark(classhour_m_id[current_location],function(err,result){
                     if(err){
                         cb(err);
                     }else{
                         //遍历数组
                         result.map(function(element){
                             questions.title_content=element.title_content;
                             questions.answer_ok=element.answer_ok;
                             questions.knowledge_point=element.knowledge_point;
                             questions.facility_value=element.facility_value;
                             questions.score_value=element.score_value;
                             questions.photo_url=element.photo_url;
                             questions.answer_list=element.answer_list;
                             questions.type=element.type;
                         });
                             cb(null,questions);
                     }
            })
}
 //添加书签——查询
module.exports.query_Bookmark_Exist = function(phone,question_id,cb) {
     questions_m_sql.query_Bookmark_Exist(phone,question_id,function(err,result){//查询原来是否添加过——并删除
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){//不存在
                    cb(null,result);
             }else{//存在 更新成0 
                  questions_m_sql.query_Bookmark_Exist1_update(phone,question_id,function(err,result_yes){
                     if(err){
                         cb(err);
                     }else{
                         cb(null,result_yes);
                     }
                 });
             }
         }
     })
}
//编辑版本——删除老师自己的版本_一个个删除
module.exports.update_Edition_delteacher = function(id,phone,cb) {
     var id=id;
     var last_edition_m_id="";
     var edition_m_id="";
     questions_m_sql.query_edition_id(phone,function(err,result){
         if(err){
             cb(err);
         }else{
               result.map(function(element){
                    console.log(element);
                   edition_m_id=element.eidition_m_id;
                });
            console.log("第几个："+edition_m_id.indexOf(id));
            console.log("长度："+edition_m_id.length);
            console.log("<<<："+edition_m_id.indexOf(","));
            
            if(edition_m_id.indexOf(id)==0&&edition_m_id.indexOf(",")>=0){//第一个
                 console.log(edition_m_id.replace(id+",",''));
                 last_edition_m_id=edition_m_id.replace(id+",",'')
            }else if((edition_m_id.indexOf(id)>edition_m_id.lastIndexOf(","))&&(edition_m_id.indexOf(",")>=0)){//最后一个
                 console.log(edition_m_id.replace(","+id,''));
                 last_edition_m_id=edition_m_id.replace(","+id,'');
            }else if(edition_m_id.indexOf(id)==0&&edition_m_id.indexOf(",")<0){//只有一个
                 console.log(edition_m_id.replace(id+''));
                 last_edition_m_id="";
            }else{
                 console.log(edition_m_id.replace(id+",",''));
                 last_edition_m_id=edition_m_id.replace(id+",",'')
            }
                console.log(last_edition_m_id);
                questions_m_sql.update_Edition_teacher(last_edition_m_id,phone,function(err, result) {//回函数
                if(err){
                    cb(err);
                }else{
                    cb(null,result);
                }
            });
         }
     })
}
//编辑版本——添加老师自己的版本
module.exports.update_Edition_addteacher = function(data,phone,cb) {
     var id=data.id;
     var last_edition_m_id="";
     questions_m_sql.query_edition_id(phone,function(err,result){
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){//插入一条信息
                 questions_m_sql.insert_teacher_phone(phone,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                            last_edition_m_id=id.join(",");
                            questions_m_sql.update_Edition_teacher(last_edition_m_id,phone,function(err, result_yes) {//回函数
                                if(err){
                                    cb(err);
                                }else{
                                    cb(null,result_yes);
                                }
                        });
                     }
                 });
             }else{//存在这个老师
                 result.map(function(element){
                     if(id.length>0){
                      if(element.eidition_m_id==""){ 
                                last_edition_m_id=id.join(",");//last_edition_m_id+id.join(",");
                        }else{
                                last_edition_m_id=element.eidition_m_id+","+id.join(",");
                        }
                     }else{
                         last_edition_m_id=element.eidition_m_id;
                     }
                 });
                questions_m_sql.update_Edition_teacher(deleteRepetion(last_edition_m_id),phone,function(err, result_yy) {//回函数
                    if(err){
                        cb(err);
                    }else{
                        cb(null,result_yy);
                    }
               });
             }
         }
     })
}

function deleteRepetion(arr){//数组去重
     var arr = arr.split(",")
    var arrTable = {},arrData = [];
    for (var i = 0; i < arr.length; i++) {
        if( !arrTable[ arr[i] ]){
            arrTable[ arr[i] ] = true;
            arrData.push(arr[i])
        }
    }
    console.log("999999999999999999999999999999:"+JSON.stringify(arrData));
    return arrData;
}
//清空书签
module.exports.get_chapter = function(data,cb) {
    var index=1;
    var questions_bookmark=[];
    data.forEach(function(elem){ 
    var questions={bookmark_id:elem.bookmark_id,question_id:elem.question_id,classhour_m_id:"",title_content:elem.title_content,answer_ok:elem.answer_ok,knowledge_point:elem.knowledge_point,facility_value:elem.facility_value,score_value:elem.score_value,photo_url:elem.photo_url,answer_list:elem.answer_list,type:elem.type};//每次开始一个新的数组
    var chapter_id="";
    var classhour_name="";
     questions_m_sql.get_chapter(elem.classhour_m_id,function(err, result) {//回函数
         if(err){
             cb(err);
         }else{
             result.map(function(element){
                 chapter_id=element.chapter_m_id;
                 classhour_name=element.classhour_content;
             })
             var edition_id="";
             var chapter_name="";
             questions_m_sql.get_edition(chapter_id,function(err,result_one){
                 if(err){
                     cb(err);
                 }else{
                      result_one.map(function(element){
                        edition_id=element.edition_m_id;
                        chapter_name=element.chapter_content;
                    })
                     var edition_name="";
                    questions_m_sql.get_edition_last(edition_id,function(err,result_two){
                        if(err){
                            cb(err);
                        }else{
                            result_two.map(function(element){
                                edition_name=element.edition;
                            })
                            questions.classhour_m_id=classhour_name+"("+edition_name+")";
                            questions_bookmark.push(questions);
                            if(index==data.length){
                                cb(null,questions_bookmark);
                            }
                            index++;
                        }
                    });
                 }
             });
         }
      });
    })
} 