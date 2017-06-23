var Promise = require('promise');
var questions_m_sql = require('./questions_m_sql');
/**
 * 表结构  
 */
//开始答题
module.exports.start_Question = function(wb_number,phone,cb) {
     questions_m_sql.query_wb_number(wb_number,phone,function(err,result){
         if(err){
             cb(err);
         }else{
             if(result==""||result==null){
                 questions_m_sql.insert_wb_number(wb_number,phone,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                         console.log("answer_mark_id:"+result.insertId);
                         cb(null,result.insertId);
                     }
                 });  
             }else{
                 questions_m_sql.update_answer_mark(wb_number,phone,function(err,result){
                     if(err){
                         cb(err);
                     }else{
                          questions_m_sql.insert_wb_number(wb_number,phone,function(err,result){
                            if(err){
                                cb(err);
                            }else{
                                console.log("answer_mark_id:"+result.insertId);
                                cb(null,result.insertId);
                            }
                        });  
                     }
                 })
             }
         }
     });
}
//结束答题
module.exports.end_Question = function(id,cb) {
    questions_m_sql.end_Question(id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    })
}
//app答题
module.exports.app_Answer = function(wb_number,student_phone,answer_ok,cb) {
    var student_name="";
    var class_id="";
    var student_id="";
    var answer_mark_m_id="";
    var answer_status="";
    questions_m_sql.query_student(student_phone,function(err,result){//查询学生的信息存不存在
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,"该学生不存在!");//不存在该学生
            }else{//存在
                result.map(function(element){
                     student_name=element.student_name;
                     class_id=element.class_id;
                     student_id=element.id
                });
                questions_m_sql.query_wb_number_status(wb_number,function(err,result){//查询此时的id,和status状态
                    if(err){
                        cb(err);
                    }else{
                       
                        result.map(function(element){
                            answer_status=element.answer_status;
                            answer_mark_m_id=element.id;
                        });
                        if((result==0||result=="")||answer_status!=0){//此时不能答题
                            cb(null,"此白板号还不能答题!");
                        }else{
                            questions_m_sql.query_record(answer_mark_m_id,student_name,student_phone,function(err,result){//查询该学生否提交过该id
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){//未添加 添加信息
                                         questions_m_sql.insert_student_answer(student_phone,student_name,answer_mark_m_id,answer_ok,class_id,student_id,function(err,result){
                                             if(err){
                                                 cb(err);
                                             }else{
                                                 cb(null,"success");//提交成功
                                             }
                                         });//插入数据
                                    }else{
                                        var answer_student_m_id="";
                                            result.map(function(element){
                                            answer_student_m_id=element.id;
                                        });
                                        questions_m_sql.update_student_answer(answer_student_m_id,answer_ok,function(element){
                                            if(err){
                                                cb(err);
                                            }else{
                                                cb(null,"您已经成功修改答案,请耐心等待结果!");//已经提交过此id的数据
                                            }
                                        })
                                        //cb(null,"您已经提交过该问题,请耐心等待结果!");//已经提交过此id的数据
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
//答题分析
module.exports.analys_Questions = function(id,type,ture_answer,cb) {//id为answer_mark_m_id;
    var class_id=[];
    var answer_ok=[];
    var class_person_count=[];
    var class_id_two=[];
    var allclass_person_count=0;//班级总人数
    var postclass_person_count=0;//作答人数
    var index=0;
    var index_count=0;
    var invalid_count_count=0;//无效作答个数
    var noanswer_person_count=0;
    var allclass_person_count=0;
    var answer_ture=0;              
    var answer_query={A:"0",B:"0",C:"0",D:"0",E:"0",F:"0",G:"0",H:"0",I:"0",no_result:""};
    var answer_judge={A:"",B:""};
    var T=0;
    var F=0;
    var answer_ture=0;
    var result_all={answer:"",invalid_count:"",noanswer_person_count:"",allclass_person_count:"",answer_ture:""}
    questions_m_sql.query_all_class_id(id,function(err,result){//查询所有参加答题的学生的class_id去重复
        if(err){
            cb(err);
        }else{
            if(result.length=="0"||result==""){
                cb(null,result);
            }else{
            result.forEach(function(element){
                console.log(element);
                class_id.push(element.class_id);
            });
            console.log("班级id："+JSON.stringify(class_id));
            class_id.forEach(function(class_id_foreach){
                questions_m_sql.all_class_person(class_id_foreach,function(err,result){
                if(err){
                    cb(err);
                }else{
                    result.forEach(function(element) {
                         class_person_count.push(element.class_person);//班级人数
                         allclass_person_count+=element.class_person;//总人数求和
                         class_id_two.push(element.class_id);//班级id
                    })
                    questions_m_sql.post_class_person(id,function(err,result){//查询作答人数
                        if(err){
                            cb(err);
                        }else{
                            if(type=="0"){
                                 result_all.answer=answer_query;
                            }else if(type=="2"){
                                 result_all.answer=answer_judge;
                            }else{
                                 result_all.answer=="";
                            }
                            result.forEach(function(element){
                            var answer_ok=element.answer_ok;
                            console.log("answer:"+answer_ok);
                             if(type=="0"){//多选还没判断
                                if(answer_ok=="A"){
                                     answer_query.A=element.post_person;
                                     if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="B"){
                                     answer_query.B=element.post_person;
                                    if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="C"){
                                     answer_query.C=element.post_person;
                                    if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="D"){
                                     answer_query.D=element.post_person;
                                     if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="E"){
                                     answer_query.E=element.post_person;
                                    if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="F"){
                                     answer_query.F=element.post_person;
                                    if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="G"){
                                     answer_query.G=element.post_person;
                                     if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="H"){
                                     answer_query.H=element.post_person;
                                    if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else if(answer_ok=="I"){
                                     answer_query.I=element.post_person;
                                     if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                }else{//无效作答
                                    invalid_count_count+=element.post_person;
                                }
                                 postclass_person_count+=element.post_person;//作答的总人数
                                 index_count++;
                                 console.log("变数"+index_count);
                                  console.log("变数2"+result.length);
                                  if(index_count==result.length){
                                      console.log("in："+postclass_person_count);
                                       result_all.invalid_count=invalid_count_count;
                                       result_all.noanswer_person_count=(allclass_person_count-postclass_person_count);//总人数-提交人数+走了两遍
                                       result_all.allclass_person_count=allclass_person_count;
                                       result_all.answer_ture=answer_ture;
                                      cb(null,result_all);
                                  }
                                }
                               else{
                                    if(answer_ok=="true"){
                                       answer_judge.A= element.post_person;
                                       if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                    }else if(answer_ok=="false"){
                                       answer_judge.B= element.post_person;
                                       if(answer_ok==ture_answer){
                                         answer_ture=element.post_person;
                                     }
                                    }else{
                                        invalid_count_count+=element.post_person;
                                    }
                                     postclass_person_count+=element.post_person;//作答的总人数
                                      index_count++;
                                    console.log("变数"+index_count);
                                    console.log("变数2"+result.length);
                                   if(index_count==result.length){
                                      console.log("in："+postclass_person_count);
                                       result_all.invalid_count=invalid_count_count;
                                       result_all.noanswer_person_count=(allclass_person_count-postclass_person_count);//总人数-提交人数+走了两遍
                                       result_all.allclass_person_count=allclass_person_count;
                                       result_all.answer_ture=answer_ture;
                                      cb(null,result_all);
                                  }
                                }
                            });
                        }
                    });
                }
             });//根据class_id算出所有班级人数type_grade应该是同一年级
            }) 
        }
      }
    });//根据id查询所有class_id
    
}
//查询答题情况
module.exports.query_Questions_Byclass = function(id,ture_answer,type,cb) {//只查询一条信息
    var class_id=[];
    var allclass_person_count=0;//班级总人数
    var postclass_person_count=0;//作答人数
    var only_once=[];//
    var all_once=[];
    var answer_ture=0;//正确个数
    var answer_false=0;//错误个数
    var answer_no=0;//无效作答
    var array=0;
    var post_man_id=[];//作答人数的id
    var all_person=0;//班级人数
    var index_once=0;
    var return_alldata={ture_person:"",false_person:"",vilidate_person:"",no_person:"",all_person:"",all_once:"",class_id:"",current_location:'',class_count:''};//返回页面的总参数
   // var return_add_alldata=[];
    questions_m_sql.query_all_class_id(id,function(err,result){//查询所有同学所在的class_id
        if(err){
            cb(err);
        }else{
            if(result.length=="0"){
                cb(null,result);
            }else{
                if(result.length=="1"){
                    return_alldata.class_count="onlyone"
                } 
             result.forEach(function(element){
                class_id.push(element.class_id);
            });
            console.log("班级id数组："+class_id);
           // class_id.forEach(function(element_class_id){//根据班级id查询出这个班级下的post情况
                //console.log("循环class_id:"+element_class_id);
                var local=class_id.indexOf(class_id[0])
                return_alldata.class_id=class_id;
                return_alldata.current_location=local;
                console.log("id所在位置："+local);
                questions_m_sql.query_name_ok(class_id[0],id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                         result.forEach(function(element){
                             console.log("查询出学生的人数长度："+result.length);
                                var student_single_answer={name:"",state:""};
                                if(element.answer_ok==ture_answer){
                                    student_single_answer.name=element.student_name;
                                    student_single_answer.state="1"//答对
                                    only_once.push(student_single_answer);
                                    post_man_id.push(element.student_id);
                                    answer_ture++;
                                }else if (element.answer_ok!=ture_answer){//无效+答错
                                    var answer_ok=element.answer_ok;
                                     if(type=="0"){//多选还没判断
                                        if(answer_ok=="A"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if (answer_ok=="B"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="C"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="D"){
                                              student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="E"){
                                              student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="F"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="G"){
                                              student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="H"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="I"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else{//无效作答+人名
                                            student_single_answer.name=element.student_name;
                                            student_single_answer.state="3"//答错
                                            only_once.push(student_single_answer);
                                            post_man_id.push(element.student_id);
                                            answer_no++;
                                        }
                                           // postclass_person_count+=element.post_person;//作答的总人数
                                        }
                                        else if (type=="1"){
                                            if(answer_ok.indexOf("A")>=0){//判断是不是合法的
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }else if(answer_ok.indexOf("B")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("C")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("D")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("E")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("F")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("G")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("H")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("I")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }else{//无效做答
                                            student_single_answer.name=element.student_name;
                                            student_single_answer.state="3"//无效作答
                                            only_once.push(student_single_answer);
                                            post_man_id.push(element.student_id);
                                            answer_no++;
                                            }
                                        }
                                         else{
                                            if(answer_ok=="ture"){
                                                 student_single_answer.name=element.student_name;
                                                 student_single_answer.state="2"//答错
                                                 only_once.push(student_single_answer);
                                                  post_man_id.push(element.student_id);
                                                 answer_false++;
                                            }else if(answer_ok=="false"){
                                                 student_single_answer.name=element.student_name;
                                                 student_single_answer.state="2"//答错
                                                 only_once.push(student_single_answer);
                                                  post_man_id.push(element.student_id);
                                                 answer_false++;
                                            }else{
                                                student_single_answer.name=element.student_name;
                                                student_single_answer.state="3"//答错
                                                only_once.push(student_single_answer);
                                                post_man_id.push(element.student_id);
                                                answer_no++;
                                            }
                                            //postclass_person_count+=element.post_person;//作答的总人数
                                     }
                                }
                                index_once++;
                                if(index_once==result.length){
                                    //这里做处理
                                        questions_m_sql.query_all_class_person(class_id[0],function(err,result_all){
                                            if(err){
                                                cb(err);
                                            }else{
                                                //console.log(element_class_id+"班级人数"+all_person);
                                                questions_m_sql.query_once_person(class_id[0],post_man_id,function(err,result){//查询未作答人名字
                                                if(err){
                                                    cb(err);
                                                }else{
                                                    if(result==""||result==null){//如果没有未作答的人
                                                         result_all.map(function(element){
                                                            all_person=element.all_person;
                                                        });
                                                    return_alldata.ture_person=answer_ture;
                                                    return_alldata.false_person=answer_false;
                                                    return_alldata.all_person=all_person;
                                                    return_alldata.no_person=(all_person-(answer_ture+answer_false+answer_no));
                                                    return_alldata.vilidate_person=answer_no;
                                                    return_alldata.all_once=only_once;
                                                    cb(null,return_alldata);
                        
                                                    }else{
                                                    if(result!=""&&result!=null){
                                                     result_all.map(function(element){
                                                            all_person=element.all_person;
                                                        });
                                                    var index=0;
                                                    result.forEach(function(element){//查出来的算作未作答
                                                        var student_single_answer={name:"",state:"4"};
                                                        student_single_answer.name=element.student_name;
                                                        only_once.push(student_single_answer);
                                                        index++;
                                                    }); 
                                                    return_alldata.ture_person=answer_ture;
                                                    return_alldata.false_person=answer_false;
                                                    return_alldata.all_person=all_person;
                                                    return_alldata.no_person=(all_person-(answer_ture+answer_false+answer_no));
                                                    return_alldata.vilidate_person=answer_no;
                                                    return_alldata.all_once=only_once;
                                                   // return_add_alldata.push(return_alldata);
                                                    console.log("GGG："+JSON.stringify(return_alldata));
                                                    console.log("post_man_id:post_man_id:"+post_man_id);
                                                    console.log("所在班级id:"+class_id[0]);
                                                    // array++;
                                                    if(index==result.length){
                                                    console.log("班级总人数："+all_person);
                                                    console.log("正确人数："+answer_ture);
                                                    console.log("错误人数："+answer_false);
                                                    console.log("无效作答人数："+answer_no);
                                                    console.log("未作答人数："+(all_person-(answer_ture+answer_false+answer_no)));
                                                    cb(null,return_alldata);
                                                     }
                                                  }
                                                 }
                                                }
                                            });
                                        }
                                    }) 
                                }
                            })
                            
                     }
                });
            //});
        }
        }
    })
}

//下一个班级
module.exports.query_Questions_Byclass_next = function(id,ture_answer,type,current,cb) {//只查询一条信息//当前所在位置
    var class_id=[];
    var allclass_person_count=0;//班级总人数
    var postclass_person_count=0;//作答人数
    var only_once=[];//
    var all_once=[];
    var answer_ture=0;//正确个数
    var answer_false=0;//错误个数
    var answer_no=0;//无效作答
    var array=0;
    var post_man_id=[];//作答人数的id
    var all_person=0;//班级人数
    var index_once=0;
    var return_alldata={ture_person:"",false_person:"",vilidate_person:"",no_person:"",all_person:"",all_once:"",class_id:"",current_location:''};//返回页面的总参数
   // var return_add_alldata=[];
    questions_m_sql.query_all_class_id(id,function(err,result){//查询所有同学所在的class_id
        if(err){
            cb(err);
        }else{
            if(result.length=="0"){
                cb(null,result);
            }else{
             result.forEach(function(element){
                class_id.push(element.class_id);
            });
            console.log("班级id数组："+class_id);
           // class_id.forEach(function(element_class_id){//根据班级id查询出这个班级下的post情况
                //console.log("循环class_id:"+element_class_id);
                console.log(current);
              
                console.log("class_id.length"+class_id.length);
                var current_location= parseInt(current)+1;
                if(current_location>class_id.length-1){
                    current_location=0;
                }
                 console.log(current_location);
                var local=class_id.indexOf(class_id[current_location])
                return_alldata.class_id=class_id;
                return_alldata.current_location=local;
                console.log("id所在位置："+local);
                 console.log("id值："+class_id[current_location]);
                questions_m_sql.query_name_ok(class_id[current_location],id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                         result.forEach(function(element){
                                var student_single_answer={name:"",state:""};
                                if(element.answer_ok==ture_answer){
                                    student_single_answer.name=element.student_name;
                                    student_single_answer.state="1"//答对
                                    only_once.push(student_single_answer);
                                    post_man_id.push(element.student_id);
                                    answer_ture++;
                                }else if (element.answer_ok!=ture_answer){//无效+答错
                                    var answer_ok=element.answer_ok;
                                     if(type=="0"){//多选还没判断
                                        if(answer_ok=="A"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if (answer_ok=="B"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="C"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="D"){
                                              student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="E"){
                                              student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="F"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="G"){
                                              student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="H"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else if(answer_ok=="I"){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                              post_man_id.push(element.student_id);
                                             answer_false++;
                                        }else{//无效作答+人名
                                            student_single_answer.name=element.student_name;
                                            student_single_answer.state="3"//答错
                                            only_once.push(student_single_answer);
                                            post_man_id.push(element.student_id);
                                            answer_no++;
                                        }
                                           // postclass_person_count+=element.post_person;//作答的总人数
                                        }
                                         else if (type=="1"){
                                            if(answer_ok.indexOf("A")>=0){//判断是不是合法的
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }else if(answer_ok.indexOf("B")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("C")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("D")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("E")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("F")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("G")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("H")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }
                                            else if(answer_ok.indexOf("I")>=0){
                                             student_single_answer.name=element.student_name;
                                             student_single_answer.state="2"//答错
                                             only_once.push(student_single_answer);
                                             post_man_id.push(element.student_id);
                                             answer_false++;
                                            }else{//无效做答
                                            student_single_answer.name=element.student_name;
                                            student_single_answer.state="3"//无效作答
                                            only_once.push(student_single_answer);
                                            post_man_id.push(element.student_id);
                                            answer_no++;
                                            }
                                        }
                                        else{
                                            if(answer_ok=="ture"){
                                                 student_single_answer.name=element.student_name;
                                                 student_single_answer.state="2"//答错
                                                 only_once.push(student_single_answer);
                                                  post_man_id.push(element.student_id);
                                                 answer_false++;
                                            }else if(answer_ok=="false"){
                                                 student_single_answer.name=element.student_name;
                                                 student_single_answer.state="2"//答错
                                                 only_once.push(student_single_answer);
                                                  post_man_id.push(element.student_id);
                                                 answer_false++;
                                            }else{
                                                student_single_answer.name=element.student_name;
                                                student_single_answer.state="3"//答错
                                                only_once.push(student_single_answer);
                                                post_man_id.push(element.student_id);
                                                answer_no++;
                                            }
                                            //postclass_person_count+=element.post_person;//作答的总人数
                                     }
                                }
                                index_once++;
                                if(index_once==result.length){
                                    //这里做处理
                                        questions_m_sql.query_all_class_person(class_id[current_location],function(err,result_all){
                                            if(err){
                                                cb(err);
                                            }else{
                                                //console.log(element_class_id+"班级人数"+all_person);
                                                questions_m_sql.query_once_person(class_id[current_location],post_man_id,function(err,result){//查询未作答人名字
                                                if(err){
                                                    cb(err);
                                                }else{
                                                    if(result!=""&&result!=null){
                                                     result_all.map(function(element){
                                                            all_person=element.all_person;
                                                        });
                                                    var index=0;
                                                    result.forEach(function(element){//查出来的算作未作答
                                                        var student_single_answer={name:"",state:"4"};
                                                        student_single_answer.name=element.student_name;
                                                        only_once.push(student_single_answer);
                                                        index++;
                                                    }); 
                                                    return_alldata.ture_person=answer_ture;
                                                    return_alldata.false_person=answer_false;
                                                    return_alldata.all_person=all_person;
                                                    return_alldata.no_person=(all_person-(answer_ture+answer_false+answer_no));
                                                    return_alldata.vilidate_person=answer_no;
                                                    return_alldata.all_once=only_once;
                                                   // return_add_alldata.push(return_alldata);
                                                    console.log("GGG："+JSON.stringify(return_alldata));
                                                    console.log("post_man_id:post_man_id:"+post_man_id);
                                                    console.log("所在班级id:"+class_id[current_location]);
                                                    // array++;
                                                    if(index==result.length){
                                                    console.log("班级总人数："+all_person);
                                                    console.log("正确人数："+answer_ture);
                                                    console.log("错误人数："+answer_false);
                                                    console.log("无效作答人数："+answer_no);
                                                    console.log("未作答人数："+(all_person-(answer_ture+answer_false+answer_no)));
                                                    cb(null,return_alldata);
                                                     }
                                                  }
                                                }
                                            });
                                        }
                                    }) 
                                }
                            })
                            
                     }
                });
            //});
        }
        }
    })
}
//答题分析+多选
module.exports.analys_Questions_Two = function(id,type,ture_answer,cb) {//id为answer_mark_m_id;
    var class_id=[];
    var answer_ok=[];
    var class_person_count=[];
    var class_id_two=[];
    var allclass_person_count=0;//班级总人数
    var postclass_person_count=0;//作答人数
    var index=0;
    var invalid_count_count=0;//无效作答个数
    var answer_query={A:"0",B:"0",C:"0",D:"0",E:"0",F:"0",G:"0",H:"0",I:"0",no_result:""};
    var answer_ture=0;
    var result_all={answer:"",invalid_count:"",noanswer_person_count:"",allclass_person_count:"",answer_ture:""}
    var A=0;
    var B=0;
    var C=0;
    var D=0;
    var E=0;
    var F=0;
    var G=0;
    var H=0;
    var I=0;
    var V=0;
    questions_m_sql.query_all_class_id(id,function(err,result){//查询所有参加答题的学生的class_id去重复
        if(err){
            cb(err);
        }else{
             if(result.length=="0"||result==""){
                cb(null,result);
            }else{
            result.forEach(function(element){
                class_id.push(element.class_id);
            });
            class_id.forEach(function(class_id_each){
                 questions_m_sql.all_class_person(class_id_each,function(err,result){
                if(err){
                    cb(err);
                }else{
                    result.forEach(function(element) {
                         class_person_count.push(element.class_person);//班级人数
                         allclass_person_count+=element.class_person;//总人数求和
                         class_id_two.push(element.class_id);//班级id
                    })
                    questions_m_sql.post_class_person_tt(id,function(err,result){
                        if(err){
                            cb(err);
                        }else{
                            result.map(function(element){
                                postclass_person_count=element.post_person;//作答的总人数
                                console.log("作答总人数："+postclass_person_count);
                            })
                                questions_m_sql.post_class_person_two(id,function(err,result){//查询作答人数
                                    if(err){
                                        cb(err);
                                    }else{
                                    result.forEach(function(element){
                                        var answer_ok=element.answer_ok;
                                        console.log("answer:"+answer_ok);
                                          if(ture_answer==answer_ok){//此时这里写包含
                                                answer_ture++;
                                             }
                                            if(answer_ok.indexOf("A")>=0){
                                                A++;
                                            }if(answer_ok.indexOf("B")>=0){
                                                B++;
                                            } if(answer_ok.indexOf("C")>=0){
                                                C++;
                                            } if(answer_ok.indexOf("D")>=0){
                                                D++;
                                            } if(answer_ok.indexOf("E")>=0){
                                                E++;
                                            } if(answer_ok.indexOf("F")>=0){
                                                F++;
                                            } if(answer_ok.indexOf("G")>=0){
                                                G++;
                                            } if(answer_ok.indexOf("H")>=0){
                                                H++;
                                            } if(answer_ok.indexOf("I")>=0){
                                                I++;
                                            }
                                             if(answer_ok.indexOf("A")>=0){//if与if else的区别
                                                V++;
                                            }else if(answer_ok.indexOf("B")>=0){
                                                V++;
                                            } else if(answer_ok.indexOf("C")>=0){
                                                V++;
                                            } else if(answer_ok.indexOf("D")>=0){
                                                V++;
                                            } else if(answer_ok.indexOf("E")>=0){
                                                V++;
                                            } else if(answer_ok.indexOf("F")>=0){
                                                V++;
                                            } else if(answer_ok.indexOf("G")>=0){
                                                V++;
                                            } else if(answer_ok.indexOf("H")>=0){
                                                V++;
                                            } else if(answer_ok.indexOf("I")>=0){
                                                V++;
                                            }
                                            else{//无效作答
                                                invalid_count_count=postclass_person_count-V;
                                            }
                                        })
                                          index++;
                                             if(class_id.length==index){
                                                answer_query.A=A/(class_id.length);
                                                answer_query.B=B/(class_id.length);
                                                answer_query.C=C/(class_id.length);
                                                answer_query.D=D/(class_id.length);
                                                answer_query.E=E/(class_id.length);
                                                answer_query.F=F/(class_id.length);
                                                answer_query.G=G/(class_id.length);
                                                answer_query.H=H/(class_id.length);
                                                answer_query.I=I/(class_id.length);                                                                          
                                                result_all.answer=answer_query;
                                                result_all.invalid_count=invalid_count_count;
                                                result_all.noanswer_person_count=allclass_person_count-postclass_person_count;//总人数-提交人数
                                                result_all.allclass_person_count=allclass_person_count;
                                                result_all.answer_ture=answer_ture/(class_id.length);
                                                console.log("返回测试："+JSON.stringify(result_all));
                                                cb(null,result_all);
                                             }
                                         
                            }
                        });
                            
                        }
                    })
                    
                }
            });//根据class_id算出所有班级人数type_grade应该是同一年级
            });
        }
        }
    });//根据id查询所有class_id

}
//字母排序测试
function analys_Questions_Test_Two(cb){
    var arr = [];
    for(var i=0;i<5;i++){
        console.log(m);
        arr[i] = (function(num){                    //自我执行，并传参(将匿名函数形成一个表达式)(传递一个参数)
            return num;                            //这里的num写什么都可以                    
        })(i);                                     //这时候这个括号里面的i和上面arr[i]的值是一样的都是取自for循环里面的i                            
    }   
     console.log(JSON.stringify(arr));                                        
     cb(null,arr);
}
//字母排序测试
module.exports.analys_Questions_Test_One=function(cb){
    var result=analys_Questions_Test_Two();
    cb(null,result);
}
//撤销答题
module.exports.app_Answer_Revoke = function(wb_number,student_phone,cb) {
    //撤销答案的时候做的处理
    var student_name="";
    var class_id="";
    var student_id="";
    var answer_mark_m_id="";
    var answer_status="";
    questions_m_sql.query_student(student_phone,function(err,result){//查询学生的信息存不存在
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){
                cb(null,"该学生不存在!");//不存在该学生
            }else{//存在
                result.map(function(element){
                     student_name=element.student_name;
                     class_id=element.class_id;
                     student_id=element.id
                });
                questions_m_sql.query_wb_number_status(wb_number,function(err,result){//查询此时的id,和status状态
                    if(err){
                        cb(err);
                    }else{
                        result.map(function(element){
                            answer_status=element.answer_status;
                            answer_mark_m_id=element.id;
                        });
                        if((result==0||result=="")||answer_status!=0){//不能撤销
                            cb(null,"此白板号结束答题,不能撤销!");
                        }else{
                            questions_m_sql.query_record(answer_mark_m_id,student_name,student_phone,function(err,result){//查询该学生否提交过该id
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){//未答题 不能撤销 
                                        cb(null,"您还未提交过问题,请及时提交答案!");
                                    }else{
                                         questions_m_sql.delete_student_answer(student_phone,student_name,answer_mark_m_id,function(err,result){
                                             if(err){
                                                 cb(err);
                                             }else{
                                                 cb(null,result);//撤销成功
                                             }
                                         });//插入数据
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
//app获取同班级学生数据+班主任
module.exports.app_getPhone = function(student_phone,cb) {
    var student_name="";
    var class_id="";
    var student_id="";
   // var student_phone="";
    var name_phone_all=[];
    // student_phone="13604014172";//测试用
    var index=0;
    var headermaster_id="";
    var school_id="";
    questions_m_sql.query_student_phone(student_phone,function(err,result_all_student){//查询该学生的同班同学信息
        if(err){
            cb(err);
        }else{
            if(result_all_student==""||result_all_student==null){
                console.log(1);
                cb(null, result_all_student);//不存在该学生
            }else{//存在
                console.log(2);
                result_all_student.map(function(element){
                     class_id=element.class_id;
                });
                result_all_student.forEach(function(element){
                            var name_phone_one={name:"",phone:"",status:"1"};
                            name_phone_one.name=element.student_name;
                            name_phone_one.phone=element.student_phone;
                            name_phone_all.push(name_phone_one);
                        })
                //根据class_id查询班主任
                 console.log(name_phone_all);
                    questions_m_sql.query_type_grade(class_id,function(err,result_type){
                        if(err){
                            cb(err);
                        }else{
                            result_type.map(function(element){
                                var type_grade=element.type_grade;
                                var class_m=element.class;
                                headermaster_id=type_grade+","+class_m;
                                school_id=element.school_id;
                            });
                            console.log(headermaster_id);
                            questions_m_sql.get_headermaster_phone(headermaster_id,school_id,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    if(result==""||result==null){
                                        var name_phone_one={name:"",phone:"",status:"0"};
                                        name_phone_one.name="班主任";
                                        name_phone_one.phone="无";
                                        name_phone_all.push(name_phone_one);
                                        questions_m_sql.get_relative_phone(student_phone,function(err,result_relative){
                                            if(err){
                                                cb(err);
                                            }else{
                                                if(result_relative==""||result_relative==null){
                                                    var name_phone_one={name:"",phone:"",status:"2"};
                                                    name_phone_one.name="亲戚";
                                                    name_phone_one.phone="无";
                                                    name_phone_all.push(name_phone_one);
                                                    }else{
                                                result_relative.map(function(element){
                                                    var name_phone_one={name:"",phone:"",status:"2"};
                                                    name_phone_one.name=element.relative_name;
                                                    name_phone_one.phone=element.phone;
                                                    name_phone_all.push(name_phone_one);
                                                });
                                            }
                                                console.log(JSON.stringify(name_phone_all.sort(Sort('status'))));
                                                cb(null,name_phone_all);
                                            }
                                        })
                                    }else{
                                    result.map(function(element){
                                        var name_phone_one={name:"",phone:"",status:"0"};
                                        name_phone_one.name=element.teacher_name;
                                        name_phone_one.phone=element.phone;
                                        name_phone_all.push(name_phone_one);
                                    });
                                    questions_m_sql.get_relative_phone(student_phone,function(err,result_relative){
                                        if(err){
                                            cb(err);
                                        }else{
                                            if(result_relative==""||result_relative==null){
                                                var name_phone_one={name:"",phone:"",status:"2"};
                                                name_phone_one.name="亲戚";
                                                name_phone_one.phone="无";
                                                name_phone_all.push(name_phone_one);
                                                }else{
                                            result_relative.map(function(element){
                                                var name_phone_one={name:"",phone:"",status:"2"};
                                                name_phone_one.name=element.relative_name;
                                                name_phone_one.phone=element.phone;
                                                name_phone_all.push(name_phone_one);
                                            });
                                        }
                                            console.log(JSON.stringify(name_phone_all.sort(Sort('status'))));
                                            cb(null,name_phone_all);
                                        }
                                    })
                                }   
                            }
                        });
                        }
                    });

            }
        }
    });
}
//app_点击进入课堂
module.exports.app_Mac = function(wb_number,cb) {
    questions_m_sql.app_Mac(wb_number,function(err,result){
        if(err){
            cb(err);
        }else{
             if(result==""||result==null){
                 cb(null,'0');
             }else{
                 cb(null,'1');
             }
        }
    })
}
function Sort(data){//
    return function(a,b){
        var value1=a[data];
        var value2=b[data];
        return value1-value2;
    }
}
//添加亲戚+不能存在相同的数据
module.exports.app_AddPhone = function(student_phone,relative_name,phone,cb) {
     var student_relative_m_id="";
    questions_m_sql.query_relativephone(student_phone,phone,function(err,result){//当添加亲戚的时候查看一千是否添加过该亲戚
        if(err){
            cb(err);
        }else{
            if(result.length==0||result==""){//不存在
                 questions_m_sql.app_AddPhone(student_phone,relative_name,phone,function(err,result){
                    if(err){
                       cb(err);
                    }else{
                       cb(null,result);
                    }
                })
            }else{//存在
                result.map(function(element){
                    student_relative_m_id=element.id;
                });
                questions_m_sql.update_relative(student_relative_m_id,relative_name,function(err,result){
                    if(err){
                        cb(err)
                    }else{
                        cb(null,result);
                    }
                })
            }
        }
    })
   
}
//删除亲戚
module.exports.app_DeletePhone = function(student_phone,phone,cb) {
    questions_m_sql.app_DeletePhone(student_phone,phone,function(err,result){
        if(err){
         cb(err);
        }else{
         cb(null,result);
        }
    })
}
//经度纬度数据格式测试
module.exports.app_Phone_Longi_Latitude= function(cb) {
    var all_tude=[{longitude:111,latitude:11.1},{longitude:222,latitude:22.2},{longitude:333,latitude:33.3},{longitude:444,latitude:44.4}]
    var string_ll="";
    var index=1;
    var split_ll=[];
    var split_one=[];
    all_tude.forEach(function(every_array){
        if(index==all_tude.length){
              string_ll+=every_array.longitude+","+every_array.latitude
        }else{
             string_ll+=every_array.longitude+","+every_array.latitude+"||"
        }
       index++;
    });
    console.log(string_ll);
    split_ll=string_ll.split("||")
    console.log(split_ll);
    split_ll.forEach(function(elem){
        var array={longitude:"",latitude:""};
        array.longitude=elem.split(",")[0];
        array.latitude=elem.split(",")[1];
        split_one.push(array);
    })
  console.log(split_one);

}
//获取学校经纬度
module.exports.get_Long_Latitude_Range = function(student_phone,cb) {
    var class_id="";
    var school_id="";
    var split_one=[];
    var string_longlat="";
    var split_longlat=[];
    var index=1;
    questions_m_sql.get_student_classid(student_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){//没查询到该学生的classid  不存在 该学生
                cb(null,"0");
            }else{
                result.map(function(element){
                    class_id=element.class_id;
                });
                console.log("class_id:"+class_id);
                questions_m_sql.get_schoolid(class_id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"1");//此种情况一般不成立
                        }else{
                            result.map(function(element){
                                school_id=element.school_id;
                            });
                            questions_m_sql.get_school_longlattude_range(school_id,function(err,result){//根据学校id查询经纬度range
                                if(err){
                                    cb(err);
                                }else{  
                                    if(result==""||result==null){
                                        cb(null,"2");
                                    }else{
                                        result.map(function(element){
                                            string_longlat=element.long_latitude_range;
                                            if(string_longlat==""){
                                                cb(null,"3");
                                            }else{
                                            split_longlat=string_longlat.split("||")
                                            split_longlat.forEach(function(elem){
                                                var array={longitude:"",latitude:"",school_id:school_id,class_id:class_id};
                                                array.longitude=elem.split(",")[0];
                                                array.latitude=elem.split(",")[1];
                                                split_one.push(array);
                                                if(index==split_longlat.length){
                                                    console.log("数据库经纬度测试："+JSON.stringify(split_one));
                                                    cb(null,split_one);
                                                }
                                                index++;
                                             }) 
                                            }
                                        })
                                  }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
//学生打卡签到
module.exports.puch_Student = function(student_phone,in_out,temporary,cb) {
    var class_id="";
    var school_id="";
    var split_one=[];
    var string_longlat="";
    var split_longlat=[];
    var index=1;
    var parent_phone="";
    var list_student={parent_phone:"",student_name:""}
    questions_m_sql.get_student_classid(student_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){//没查询到该学生的classid  不存在 该学生
                cb(null,"0");
            }else{
                result.map(function(element){
                    class_id=element.class_id;
                    list_student.parent_phone=element.parent_phone;
                    list_student.student_name=element.student_name;
                });
                console.log("class_id:"+class_id);
                questions_m_sql.get_schoolid(class_id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"1");//此种情况一般不成立
                        }else{
                            result.map(function(element){
                                school_id=element.school_id;
                            });
                            console.log("school_idschool_idschool_idschool_id:"+school_id);
                            questions_m_sql.puch_Student(student_phone,class_id,school_id,in_out,temporary,list_student.student_name,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    cb(null,list_student);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
//报告学生经纬度接口
module.exports.student_count = function(student_phone,dely_time,cb) {
    var class_id="";
    var school_id="";
    var parent_phone="";
    questions_m_sql.get_student_classid(student_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){//没查询到该学生的classid  不存在 该学生
                cb(null,"0");
            }else{
                result.map(function(element){
                    class_id=element.class_id;
                    parent_phone=element.parent_phone;
                });
                console.log("class_id:"+class_id);
                questions_m_sql.get_schoolid(class_id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"1");//此种情况一般不成立
                        }else{
                            result.map(function(element){
                                school_id=element.school_id;
                            });
                              //先查询出这个学校 + 3分钟内的家长提交的学生id 以及人数
                             //var interval_time=20;//目前控制的时间+注意这个是int类型 +这个时间是自动控制的
                             //目前可以根据数据库的并发量访问量来做调整
                             var delay_time=time_date(dely_time);
                             //var now_time=time_date_now();
                             console.log("1:::"+delay_time);
                             questions_m_sql.get_requestmount_two(delay_time,school_id,parent_phone,function(err,result){
                                 if(err){
                                     cb(err);
                                 }else{
                                     console.log(JSON.stringify(result));
                                     cb(null,result);
                                 }
                             })
                        }
                    }
                });
            }
        }
    });
}
//查询时间测试
function time_date(interval_time){
    var oDate = new Date(); //实例一个时间对象；
    var year= oDate.getFullYear();   //获取系统的年；
    var month= oDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
    var day=oDate.getDate(); // 获取系统日，
    var hour= oDate.getHours(); //获取系统时，
    var min= (oDate.getMinutes()-interval_time); //分
    var sec=oDate.getSeconds(); //秒
    if(month<10){
        month="0"+(oDate.getMonth()+1); 
    }
    if(day<10){
        day="0"+oDate.getDate();
    }
    if(hour<10){
        hour="0"+oDate.getHours();
    }
    if(min<10){ 
        min="0"+(oDate.getMinutes()-interval_time);
    }
    if(sec<10){ 
        sec="0"+oDate.getSeconds();  
    }
    var three_min=year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec
        console.log(three_min);
        return three_min
}
function time_date_now(){
    var oDate = new Date(); //实例一个时间对象；
    var year= oDate.getFullYear();   //获取系统的年；
    var month= oDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
    var day=oDate.getDate(); // 获取系统日，
    var hour= oDate.getHours(); //获取系统时，
    var min= oDate.getMinutes(); //分
    var sec=oDate.getSeconds(); //秒
    if(month<10){
        month="0"+(oDate.getMonth()+1); 
    }
    if(day<10){
        day="0"+oDate.getDate();
    }
    if(hour<10){
        hour="0"+oDate.getHours();
    }
    if(min<10){ 
        min="0"+oDate.getMinutes();
    }
    if(sec<10){ 
        sec="0"+oDate.getSeconds();  
    }
   var three_min=year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec
        return three_min
}
//根据数据的压力查询所有学校的压力测试+此学生所在学校
module.exports.get_allschool_count = function(interval_time,student_phone,cb) {
    var class_id="";
    var school_id="";
    questions_m_sql.get_student_classid(student_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){//没查询到该学生的classid  不存在 该学生
                cb(null,"0");
            }else{
                result.map(function(element){
                    class_id=element.class_id;
                });
                console.log("class_id:"+class_id);
                questions_m_sql.get_schoolid(class_id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"1");//此种情况一般不成立
                        }else{
                            result.map(function(element){
                                school_id=element.school_id;
                            });
                            var delay_time=time_date(interval_time)
                             var count={one_count:"",all_count:"",school_count:""};//返回数据十分钟内
                            questions_m_sql.get_allschool_count(delay_time,function(err,result){ //查询所有学校的并发量
                                if(err){
                                    cb(err);
                                }else{
                                     result.map(function(all_elem){
                                         count.all_count=all_elem.all_count;
                                     });
                                    //查询某个学校的
                                     questions_m_sql.get_requestmount(delay_time,school_id,function(err,result){
                                        if(err){
                                            cb(err);
                                        }else{
                                            result.map(function(element){
                                                count.one_count=element.one_count;
                                            });
                                            questions_m_sql.school_count(function(err,result){//查询有多少个服务学校
                                                if(err){
                                                    cb(err);
                                                }else{
                                                result.map(function(elem_school){
                                                    count.school_count=elem_school.school_count;
                                                });
                                                cb(null,count);
                                                }
                                            }) 
                                        }
                                    })
                                }
                            })   
                        }
                    }
                });
            }
        }
    });
}
module.exports.student_Long_Lat = function(student_phone,longitude,latitude,cb) {
    var class_id="";
    var school_id="";
    questions_m_sql.get_student_classid(student_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){//没查询到该学生的classid  不存在 该学生
                cb(null,"0");
            }else{
                result.map(function(element){
                    class_id=element.class_id;
                });
                console.log("class_id:"+class_id);
                questions_m_sql.get_schoolid(class_id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"1");//此种情况一般不成立
                        }else{
                            result.map(function(element){
                                school_id=element.school_id;
                            });
                            //插入经纬度
                            questions_m_sql.get_student_Long_Lat(student_phone,function(err,result){
                                if(err){
                                    cb(err);
                                }else{
                                    var new_longitude="";
                                    var new_latitude="";
                                    var studentposition_m_id="";
                                    result.map(function(element){
                                        new_longitude=element.longitude;
                                        new_latitude=element.latitude;
                                        studentposition_m_id=element.id;
                                    });
                                    if(new_longitude==longitude&&new_latitude==latitude){//没有变化
                                       questions_m_sql.update_student_Long_Lat(studentposition_m_id,function(err,result){
                                           if(err){
                                               cb(err);
                                           }else{
                                                cb(null,result);
                                           }
                                       });
                                    }else{
                                         questions_m_sql.student_Long_Lat(student_phone,longitude,latitude,function(err,result){
                                            if(err){
                                                cb(err);
                                                }else{
                                                cb(null,result);
                                                }
                                        })
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    });
}
//报告学生经纬度接口+临时
module.exports.student_tempary = function(student_phone,longitude,latitude,cb) {
    var class_id="";
    var school_id="";
    questions_m_sql.get_student_classid(student_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            if(result==""||result==null){//没查询到该学生的classid  不存在 该学生
                cb(null,"0");//
            }else{
                result.map(function(element){
                    class_id=element.class_id;
                });
                console.log("class_id:"+class_id);
                questions_m_sql.get_schoolid(class_id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                        if(result==""||result==null){
                            cb(null,"1");//班级删除
                        }else{
                            result.map(function(element){
                                school_id=element.school_id;
                            });
                            //更新经纬度
                            questions_m_sql.get_student_Long_Lat_tem(student_phone,school_id,function(err,result){//查询这个经纬度是否存在
                                if(err){
                                    cb(err);
                                }else{
                                    var id="";
                                    result.map(function(element){
                                        id=element.id;
                                    });
                                    if(id==""||id==null){//
                                       questions_m_sql.insert_tempary(student_phone,longitude,latitude,school_id,function(err,result){
                                           if(err){
                                               cb(err);
                                           }else{
                                                cb(null,result);
                                           }
                                       });
                                    }else{
                                         questions_m_sql.update_tempary(id,longitude,latitude,function(err,result){
                                            if(err){
                                                cb(err);
                                                }else{
                                                 cb(null,result);
                                                }
                                        })
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    });

}
//学生安全配置文件
module.exports.getbase_config = function(student_phone,cb) {
    questions_m_sql.get_student_classid(student_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            var class_m=[];
            if(result==""||result==null){
                cb(null,result);
            }else{
                result.forEach(function(elem){
                    class_m.push(elem.class_id)
                })
                console.log("666:"+JSON.stringify(class_m));
                 questions_m_sql.get_schoolid(class_m,function(err,result_two){
                     if(err){
                         cb(err);
                     }else{
                         if(result_two==""||result_two==null){
                             cb(null,result);
                         }else{
                             var school_id="";
                             result_two.map(function(elem){
                                 school_id=elem.school_id;
                             })
                             questions_m_sql.getbase_config(school_id,function(err,result){
                                 if(err){
                                     cb(err);
                                 }else{
                                     console.log(JSON.stringify(result));
                                     cb(null,result);
                                 }
                             })
                         }
                     }
                 })
            }
        }
    })    
}
//教师配置安全文件
module.exports.getbase_config_teacher = function(teacher_phone,cb) {
    questions_m_sql.get_teacher(teacher_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            var school_id="";
            if(result==""||result==null){
                cb(null,result);
            }else{
                result.forEach(function(elem){
                    school_id=elem.school_id;
                })
                questions_m_sql.getbase_config(school_id,function(err,result){
                    if(err){
                        cb(err);
                    }else{
                        console.log(JSON.stringify(result));
                        cb(null,result);
                    }
                })
            }
        }
    })    
}
//家长安全配置文件
module.exports.getbase_config_parent = function(parent_phone,cb) {
    questions_m_sql.get_parent_classid(parent_phone,function(err,result){
        if(err){
            cb(err);
        }else{
            var class_m=[];
            if(result==""||result==null){
                cb(null,result);
            }else{
                result.forEach(function(elem){
                    class_m.push(elem.class_id)
                })
                console.log("666:"+JSON.stringify(class_m));
                 questions_m_sql.get_schoolid(class_m,function(err,result_two){
                     if(err){
                         cb(err);
                     }else{
                         if(result_two==""||result_two==null){
                             cb(null,result);
                         }else{
                             var school_id="";
                             result_two.map(function(elem){
                                 school_id=elem.school_id;
                             })
                             questions_m_sql.getbase_config(school_id,function(err,result){
                                 if(err){
                                     cb(err);
                                 }else{
                                     console.log(JSON.stringify(result));
                                     cb(null,result);
                                 }
                             })
                         }
                     }
                 })
            }
        }
    })    
}
// 根据学校id查询配置信息
module.exports.getbase_config_schoolid = function(school_id,cb) {
     questions_m_sql.getbase_config(school_id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
     })
}
module.exports.app_getName = function(student_phone,cb) {
     questions_m_sql.query_student_name(student_phone,function(err,result){
         if(err){
             cb(err);
         }else{
             cb(null,result);
         }
     })
}
//app_点击进入课堂
module.exports.getposition = function(id,cb) {
    questions_m_sql.getposition(id,function(err,result){
        if(err){
            cb(err);
        }else{
            cb(null,result);
        }
    })
}