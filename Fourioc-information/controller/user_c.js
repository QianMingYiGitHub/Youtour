var util = require('util');
var Promise = require('promise');
var session_c = require('../controller/session_c');
var user_m = require('../model/user_m');
var phones_m = require('../model/phones_m');

var message = require('./../api/media/message');
var corpid_config=require('./../api/corp/corpid_config');
//外部接口
var md5=require('md5');
var process = require('child_process');
var crypto = require('crypto');

var User = (function () {
    //用户登录请求
    function logIn(req, res, next) {

     var login_role=req.body.login_role;//login_role="0"代表老师; 1代表 班主任； 2代表学校的admin;
     console.log("参数的个数："+arguments.length);
     console.log(""+req.sessionID);
    //  if (session_c.User.isLogin(req)) {
    //         res.redirect('/');//session拦截处理
    //     } else {
            //从这里判断登录的角色login_role 0 1 2
            if(login_role=="0"){//互动课堂
            var mac=req.body.mac;
            console.log("login:mac:"+req.body.mac);
            user_m.getUser(req.body.phone, function (err, result) {//把密码校验去掉
                if (err) {
                    res.redirect('/login');
                } else {
                    //if (req.body.password === result.password) {//三个等号与两个等号的区别 去掉密码验证
                        //创建mac地址+查询
                        session_c.User.logIn(req, req.body.phone,mac,login_role);//
                        console.log("session+"+req.session.user);
                        result.roles.forEach(function (role) {
                            //对数组roles进行遍历
                            console.log("result.roles:"+result.roles);
                            session_c.User.saveRole(req, role);
                        });
                        console.log("比对成功");
                        res.redirect('/');
                    // } else {
                    //     res.redirect('/login');
                    // }
                }
            });
        }else if(login_role=="1"){//班主任
            //先查询是否是班主任
            var headmaster_class_id="";
            var school_id="";
            var class_id="";
            var type_name_all="";
            var headmaster_class="";
            user_m.query_headmaster(req.body.phone,function(err,result){
                if(err){
                    res.json({
                            success:-1,
                            desc:"fail" 
                        });
                }else{
                    if(result==""||result==null){
                        //res.redirect('/');//不是班主任
                        res.json({
                            success:1,
                            desc:"不存在该老师" 
                        });
                    }else{
                        result.map(function(elem){
                            headmaster_class_id=elem.headmaster_class_id;
                            school_id=elem.school_id;
                            class_id=elem.id;
                        });
                        if(headmaster_class_id==""||headmaster_class_id==null){
                            res.json({
                                success:2,
                                desc:"还未担任班主任" 
                            });
                        }else{
                        var type_grade=headmaster_class_id.split(",")[0];
                        if(type_grade==0){
                            type_name_all="一年级"
                        }else if(type_grade==1){  
                            type_name_all="二年级"
                        }else if(type_grade==2){  
                            type_name_all="三年级"
                        }else if(type_grade==3){  
                            type_name_all="四年级"
                        }else if(type_grade==4){  
                            type_name_all="五年级"
                        }else if(type_grade==5){  
                            type_name_all="六年级"
                        }else if(type_grade==6){  
                            type_name_all="七年级"
                        }else if(type_grade==7){  
                            type_name_all="八年级"
                        }else if(type_grade==8){  
                            type_name_all="九年级"
                        }else if(type_grade==9){  
                            type_name_all="高一"
                        }else if(type_grade==10){  
                            type_name_all="高二"
                        }else if(type_grade==11){  
                            type_name_all="高三"
                        }else{
                            type_name_all="补充"
                        }
                        var iclass=headmaster_class_id.split(",")[1];
                        headmaster_class=type_name_all+iclass;
                        user_m.getclass_id(headmaster_class_id,school_id,function(err,result){
                            if(err){
                             res.json({
                                success:-1,
                                desc:"fail" 
                            });
                        }else{
                            if(result=="1"){
                                res.json({
                                    success:3,
                                    desc:"学校已经停止服务"
                                });
                            }else if(result=="2"){
                                res.json({
                                    success:4,
                                    desc:"教师所担任的班级学校管理员还未录入,请耐心等待!"
                                });
                            }else{
                             result.map(function(elem){
                                 class_id=elem.id;
                              });
                            user_m.getUser(req.body.phone, function (err, result) {
                                    if (err) {
                                        res.redirect('/login');
                                    } else {
                                        //if (req.body.password === result.password) {//三个等号与两个等号的区别
                                            session_c.User.logIn(req, req.body.phone,"班主任",login_role);//
                                            session_c.User.saveHeadmaster(req,headmaster_class,school_id,class_id,type_name_all);
                                            result.roles.forEach(function (role) {
                                                session_c.User.saveRole(req, role);
                                            });
                                            console.log("比对成功");
                                            res.redirect('/');
                                        // } else {
                                        //     res.redirect('/login');
                                        // }
                                    }
                                });
                             }
                            }
                         });
                        }
                    }
                }
            })
        }else if(login_role=="2"){//学校管理员
            var username=req.body.phone;
            user_m.getUser_schooladmin(username, function (err, result) {
                if (err) {
                    res.redirect('/login');
                } else {
                    //if (req.body.password === result.password) {//三个等号与两个等号的区别
                        session_c.User.logIn(req, username,"学校管理员",login_role);//
                        console.log("session+"+req.session.user);
                        
                        result.roles.forEach(function (role) {
                            //对数组roles进行遍历
                            console.log("result.roles:"+result.roles);
                            session_c.User.saveRole(req, role);
                        });
                        console.log("比对成功");
                        res.redirect('/');
                    // } else {
                    //     res.redirect('/login');
                    // }
                }
            });
            }
       // }
    }
function admin_login(req, res, next) {
          var login_role=req.session.login_role;
           var username=req.body.username;
            user_m.get_all_admin(username, function (err, result) {
                if (err) {
                    res.redirect('/admin_login');//总管理平台界面
                } else {
                    var oldpassword="";
                    result.map(function(elem){
                        oldpassword=elem.password;
                    });
                    if (req.body.password === oldpassword) {//三个等号与两个等号的区别
                        session_c.User.logIn(req, username,"总平台管理员",login_role);//
                        console.log("session+"+req.session.user);
                        res.redirect('/admin_root');
                    } else {
                        res.redirect('/admin_login');
                    }
                }
            });
      }
    //总平台登录
    function general_platform_login(req, res, next) {
            var username=req.body.phone;
            var teacher=false;
            var headmaster=false;
            var admin=false;
            user_m.getUser(username, function (err, result_user_teacher) {//查询是不是老师||是不是学校管理员||是不是班主任||是不是学生
                if (err) {
                    res.redirect('/login_home');//总管理平台界面
                } else {
                    if(result_user_teacher=="1"){//不是老师
                    user_m.getUser_schooladmin(username, function (err, result) {//查询是不是学校管理员
                            if (err) {
                                res.redirect('/');
                            } else {
                                if(result=="1"){//也不是学校管理员
                                    res.json({
                                        success:1,
                                        desc:"您输入的用户不存在"
                                    })
                                }else{//是学校管理员
                                if (req.body.password === result.password) {
                                    admin=true;
                                    session_c.User.platform_Login(req,teacher,headmaster,admin,username);
                                    res.redirect('/general_platform_root');
                                } else {
                                    res.json({
                                        success:2,
                                        desc:"密码错误!"//学校管理员密码错误
                                    })
                                }
                            }
                        }
                        });
                    }else{//是老师+查询是否是班主任
                        var teacher_password=result_user_teacher.password;
                        teacher=true;
                        var headmaster_class_id="";
                        // var school_id="";
                        // var class_id="";
                        user_m.query_headmaster(req.body.phone,function(err,result_teacher){
                            if(err){
                                res.json({
                                        success:-1,
                                        desc:"fail" 
                                    });
                            }else{
                                    result_teacher.map(function(elem){
                                        headmaster_class_id=elem.headmaster_class_id;
                                        // school_id=elem.school_id;
                                        // class_id=elem.id;
                                    });
                                    if(headmaster_class_id==""||headmaster_class_id==null){//不是班主任
                                    user_m.getUser_schooladmin(username, function (err, result) {//查询是不是学校管理员
                                            if (err) {
                                                res.redirect('/');
                                            } else {
                                                if(result=="1"){//不是学校管理员
                                                    if(teacher_password==req.body.password){
                                                        session_c.User.platform_Login(req,teacher,headmaster,admin,username);
                                                        res.redirect('/general_platform_root');
                                                    }else{
                                                        res.json({
                                                        success:2,
                                                        desc:"密码错误!"//教师密码错误
                                                        })
                                                    }
                                                }else{//是学校管理员+可以在更爱学校管理员的时候查看 
                                                    admin=true;
                                                if (req.body.password === result.password||teacher_password==req.body.password) {//此时对比的是谁的密码+在是老师也是管理员的情况下对比谁的密码
                                                    session_c.User.platform_Login(req,teacher,headmaster,admin,username);
                                                    res.redirect('/general_platform_root');
                                                } else {
                                                    res.json({
                                                        success:2,
                                                        desc:"密码错误!"//学校管理员密码错误
                                                    })
                                                }
                                            }
                                        }
                                        });
                                    }else{//是班主任
                                        headmaster=true;
                                        user_m.getUser_schooladmin(username, function (err, result) {//查询是不是学校管理员
                                            if (err) {
                                                res.redirect('/');
                                            } else {
                                                if(result=="1"){//不是学校管理员
                                                    if(teacher_password==req.body.password){
                                                        session_c.User.platform_Login(req,teacher,headmaster,admin,username);
                                                        res.redirect('/general_platform_root');
                                                    }else{
                                                        res.json({
                                                            success:2,
                                                            desc:"密码错误!"//教师密码错误
                                                        })
                                                    }
                                                }else{//是学校管理员
                                                    admin=true;
                                                if (req.body.password === result.password||teacher_password==req.body.password) {//此时对比的是谁的密码+在是老师也是管理员的情况下对比谁的密码
                                                    session_c.User.platform_Login(req,teacher,headmaster,admin,username);
                                                    res.redirect('/general_platform_root');
                                                } else {
                                                    res.json({
                                                        success:2,
                                                        desc:"密码错误!!"
                                                    })
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                    })
                }
                }
            });
      }
    //获取用户权限+该机器的白板号
    function Root(req, res, next) {
        console.log(""+req.sessionID);
        var phone = req.session.user;
        var mac=req.session.mac;
        var login_role=req.session.login_role;
        var username=req.session.user;
        console.log("phone:"+phone);
        console.log("本机_mac："+mac);
        console.log("登录角色："+login_role);
          var info = {
                phone: '',
                school_admin:'',
                school_id:'',
                name:'',
                is_headmaster:false,
                is_teacher: false,
                is_admin: false,
                wb_number:'',
                username:username,
                class_id:""
            };
        if (session_c.User.isLogin(req) === false) {
            res.redirect('/login');//session拦截处理
        } else {
            if(login_role=="0"){//教师备课
            if(mac==""||mac==null){
                res.redirect('/login');//session拦截处理
            }else{
            user_m.create_query_Wbnumber(mac,function(err,result){
                if(err){
                     res.redirect('/login');
                }else{
                    if(result.length>0){
                         if(result[0].wb_number<10){
                        info.wb_number="000"+result[0].wb_number;
                    }else if(result[0].wb_number>=10&&result[0].wb_number<100){
                        info.wb_number="00"+result[0].wb_number;
                    }else if(result[0].wb_number>=100&&result[0].wb_number<1000){
                        info.wb_number="0"+result[0].wb_number;
                    }
                    }
                    console.log("result.wb_number:"+info.wb_number);
                    //做用户权限绑定
                    user_m.getUser(phone, function (err, result) {
                        if (err) {
                            //做处理
                        res.redirect('/login');
                        } else {//遍历查询到的roles
                                info.name=result.name;
                                info.phone=result.phone;
                                console.log("name++"+result.name);
                            //如果查询的数据为空
                            result.roles.forEach(function (elem) {
                                switch (elem) {
                                case 'teacher':
                                    info.is_teacher = true;
                                    break;
                                // case 'headteacher':
                                //     info.is_student = true;
                                //     break;
                                case 'admin':
                                    info.is_admin =  true;
                                    break;
                                }
                                //查询mac下的wb_number
                                res.json({
                                        success: 0,
                                        desc: 'success',
                                        data: {
                                            Info:info
                                        }
                                    });
                            console.log('info:' + JSON.stringify(info));
                            console.log('info_wb_number:' + info.wb_number);
                            });
                        }

                    });
                }
            });
           }  // res.render('edition_main_v', info);
        }else if(login_role=="1"){//录入班级+班主任
           var headmaster={username:"",name:"",school_id:"",class_id:"",headmaster_class:"",type_grade:""};
           var class_id=req.session.class_id; 
           var school_id=req.session.school_id; 
           var headmaster_class=req.session.headmaster_class_id;
           var type_grade=req.session.type_grade; 
            console.log(class_id+"class_id"); 
           user_m.getUser(phone, function (err, result) {
                        if (err) {
                            //做处理
                        res.redirect('/login');
                        } else {//遍历查询到的roles
                                headmaster.name=result.name;
                                headmaster.username=result.phone;
                                headmaster.school_id=school_id;
                                headmaster.class_id=class_id;
                                headmaster.headmaster_class=headmaster_class;
                                headmaster.type_grade=type_grade;
                                console.log("name++"+result.name);
                                   res.json({
                                        success: 0,
                                        desc: 'success',
                                        data: {
                                            Info:headmaster
                                        }
                                });
                        }
                    });
        }else if(login_role=="2"){//schooladmin
          console.log("root测试："+2);
          var username = req.session.user;
          user_m.getUser_schooladmin(username, function (err, result) {
                        if (err) {
                        res.redirect('/login');
                        } else {//遍历查询到的roles
                                 info.name=result.name;
                                 info.school_admin=result.username;
                                 info.school_id=result.school_id;
                                 req.session.school_id=result.school_id;//后添加
                                console.log("name++"+result.name);
                            //如果查询的数据为空
                            result.roles.forEach(function (elem) {
                                switch (elem) {
                                case 'teacher':
                                    info.is_teacher = false;
                                    break;
                                case 'admin':
                                    info.is_admin =  true;
                                    break;
                                }
                                res.json({
                                        success: 0,
                                        desc: 'success',
                                        data: {
                                            Info:info
                                        }
                                    });
                            console.log('root：info:' + JSON.stringify(info));
                            console.log('root：info_wb_number:' + info.wb_number);
                            });
                    }

                  });
          
        }
    }
}
function admin_Root(req, res, next) {
        var phone = req.session.user;
        var username=req.session.user;
        var info = {name:'',username:username};
        if (session_c.User.isLogin(req) === false) {
            res.redirect('/admin_login');//session拦截处理
        } else {
        user_m.get_all_admin(username, function (err, result) {
                    if (err) {
                    res.redirect('/admin_login');
                    } else {
                        info.name=result.name;
                        info.school_admin=result.username;
                        res.json({
                                    success: 0,
                                    desc: 'success',
                                    data: {
                                        Info:info
                                    }
                                });
                    }
                });
        }
}
//平台
function general_Platform_Root(req, res, next) {
        var username=req.session.user;
        var teacher=req.session.teacher;
        var headmaster=req.session.headmaster;
        var admin=req.session.admin;
        var info = {username:username,teacher:teacher,headmaster:headmaster,admin:admin};
        if (session_c.User.isLogin(req) === false) {
            res.redirect('/login_home');//session拦截处理
        } else {
            console.log(1111);
            res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            Info:info
                        }
                    });
        }
}
function  Student_Root(req, res, next) {
        var studnet=req.session.student;
        var info = {studnet:studnet};
        res.json({success: 0,desc: 'success',data: { Info:info }});
}
    //用户注销请求
    function logOut(req, res, next) {
        session_c.User.logOut(req);
        res.redirect('/login');
    }
      //用户注销请求
    function logOut_platForm(req, res, next) {
        //session_c.User.logOut(req);
        res.redirect('/login_home');
    }
    function admin_logOut(req, res, next) {
        session_c.User.logOut(req);
        res.redirect('/map_login');
    }
    //修改密码
    function changePassword(req, res, next) {
        //查询用户密码username与老密码比对
        var login_role= req.session.login_role;//可以放在 session里面

        var teacher_yes=req.session.teacher;//查看登录角色
        var headmaster_yes=req.session.headmaster;
        var admin_yes=req.session.admin;
        console.log("teacher_yes:"+teacher_yes+","+"headmaster_yes:"+headmaster_yes+","+"admin_yes:"+admin_yes);
        var data=req.body;
        console.log(JSON.stringify(data));
        console.log("登录类型："+login_role);
        if(login_role=="0"||login_role=="1"){//普通老师修改密码和班主任修改密码
            user_m.getUser(req.params.user, function (err, result) {
            if (err) {
                res.json({
                    success: -1,
                    desc: err.message,
                    data: {}
                });
            } else {
                if (result.password == req.body.old_password) {//比对密码成功
                    user_m.updatePassword(req.params.user, req.body.new_password, function (err, result) {
                        if (err) {
                            res.json({
                                success: -1,
                                desc: err.message,
                                data: {}
                            });
                        } else {
                             //删除session
                            if(admin_yes){//如果是学校管理员
                                user_m.updatePassword_schooladmin(req.params.user,req.body.new_password,function(err,result){
                                 if(err){
                                     res.json({success:-1,desc:"fail"})
                                 }else{
                                      session_c.User.logOut(req);//清除该用户的session 没有用户的roles
                                      res.json({success:0,desc:"改密成功"})
                                      //res.redirect('/login');
                                 }
                              });
                             }else{
                                  session_c.User.logOut(req);//清除该用户的session 没有用户的roles
                                  res.json({success:0,desc:"改密成功"})
                                  //res.redirect('/login');
                             }
                        }
                    });

                } else {//比对密码失败
                    res.json({
                        success: 1,
                        desc: 'success',
                        data: {}
                    });
                }
            }
        });
        }
        if(login_role=="2"){//学校管理员修改密码
            user_m.getUser_schooladmin(req.params.user, function (err, result) {
            if (err) {
                res.json({
                    success: -1,
                    desc: err.message,
                    data: {}
                });
            } else {
                if (result.password == req.body.old_password) {//比对密码成功
                    user_m.updatePassword_schooladmin(req.params.user, req.body.new_password, function (err, result) {
                        if (err) {
                            res.json({
                                success: -1,
                                desc: err.message,
                                data: {}
                            });
                        } else {
                             //删除session
                             //去查询这个用户数是否是老师 是的话去修改  不是 
                             if(teacher_yes||headmaster_yes){//如果是老师+修改老师密码
                                user_m.updatePassword(req.params.user,req.body.new_password,function(err,result){
                                 if(err){
                                     res.json({success:-1,desc:"fail"})
                                 }else{
                                      session_c.User.logOut(req);//清除该用户的session 没有用户的roles
                                       res.json({success:0,desc:"改密成功"})
                                 }
                              });
                             }else{
                                  session_c.User.logOut(req);//清除该用户的session 没有用户的roles
                                  res.json({success:0,desc:"改密成功"})
                             }
                        }
                    });

                } else {//比对密码失败
                    res.json({
                        success: 1,
                        desc: 'success',
                        data: {}
                    });
                }
            }
        });
        }   
    }
     //查询部门
   function queryDepartment(req,res,next){
       var school_id=req.params.school_id;
       user_m.queryDepartment(school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            Department_Count:result.map(function(elem){
                                return{
                                    id:elem.id,
                                    department_name:elem.department_name
                                }
                            })
                        }
                    });
                 }
       })
       
   }
    //添加部门
   function addDepartment(req,res,next){
       var school_id=req.body.school_id;
       user_m.addDepartment(req.body.departmentName,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result=="1"){
                    res.json({
                        success: 1,
                        desc: '部门存在',
                    });
               }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {}
                    });
           }
           }
       })
   }
    //修改部门
   function modifyDepartment(req,res,next){
       user_m.modifyDepartment(req.params.id,req.body.department_name,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {}
                    });
           }
       })  
   }
   //删除部门
    function deleteDepartment(req,res,next){
        var department_name=req.body.department_name;
         var school_id=req.body.school_id;
       user_m.deleteDepartment(req.params.id,department_name,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               console.log("删除部门ok");
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {}
                    });
           }
       })  
   }
   //获取部门下的教师列表
    function queryDepartment_teacher(req,res,next){
       user_m.queryDepartment_teacher(req.params.id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                            Department_teacher:result.map(function(elem){
                                return{
                                    id:elem.id,
                                    teacher_name:elem.teacher_name,
                                    teacher_phone:elem.teacher_phone
                                }
                            })
                        }
                    });
           }

       })
       
   }
   //查询全体教师
    function queryAllteacher(req,res,next){
        var school_id=req.body.school_id;
        var now_map=[];
        var all_index=1;
        var all_teacher=[];
        //var now_index=0;//bug出现在这里
       user_m.queryAllteacher(school_id,function(err,result_A){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result_A=="1"){
                   res.json({
                        success: 1,
                        desc: 'success',
                        data: {}
                    });
               }else{ 
                    result_A.forEach(function(elem){
                            var teacheringclass="";
                            var all_teacher_one={
                                id:elem.id,
                                teacher_name:elem.teacher_name,
                                class_name:elem.headmaster_class_name,
                                headmaster_status:elem.headmaster_status,
                                department_list:elem.department_list,
                                teacheringclass_list:now_map,
                                phone:elem.phone,
                                type_grade:elem.type_grade,
                                class:elem.class,
                                display:elem.display,
                                school_id:elem.school_id,
                                class_id:elem.class_id,
                                class_name_teachering:""
                            };
                            if(elem.teacheringclass_list=="||"||elem.teacheringclass_list==null||elem.teacheringclass_list==""){
                                 all_teacher_one.teacheringclass_list=[];
                                 all_teacher.push(all_teacher_one);
                                if(all_index==result_A.length){
                                    res.json({
                                        success:"0",
                                        desc:"success",
                                        data:{
                                            Allteacher:all_teacher
                                        }
                                    });
                                }
                                all_index++;
                            }else{
                                var now_array=elem.teacheringclass_list.split("||");
                                var now_index=1;//位置不同会报错//bug出现在这里
                                console.log("数组："+now_array);
                                var class_name_teachering="";
                                console.log("last:::::::::::::::"+JSON.stringify(all_teacher));
                                now_array.forEach(function(elem){
                                        var one_array={type_grade_word:"",type_grade_number:"",class:"",status:""}//一条信息
                                                    one_array.type_grade_word=class_change(elem.split(",")[0]);
                                                    one_array.type_grade_number=elem.split(",")[0];
                                                    one_array.class=elem.split(",")[1];
                                                    now_map.push(one_array);
                                                    if(now_index==now_array.length){
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1];
                                                    }else{
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1]+",";
                                                    }
                                                    if(now_index==now_array.length){
                                                        all_teacher_one.teacheringclass_list=now_map;
                                                        all_teacher_one.class_name_teachering=class_name_teachering;
                                                        all_teacher.push(all_teacher_one);
                                                        now_map=[];
                                                        now_index=0;
                                                        if(result_A.length==all_index){
                                                             res.json({
                                                                success:"0",
                                                                desc:"success",
                                                                data:{
                                                                    Allteacher:all_teacher
                                                                }
                                                            });
                                                        }
                                                        all_index++;
                                                    }
                                                    now_index++;
                                    
                                });
                             
                            }
                    })
               }
           }
       })  
   }
   //查询某个部门下的教师
    function querydeparTeacher(req,res,next){
        var school_id=req.body.school_id;
        var now_map=[];
        var all_index=1;
        var all_teacher=[];
        //var now_index=0;//bug出现在这里
       user_m.querydeparTeacher(req.body.department_name,school_id,function(err,result_A){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result_A=="1"){
                   res.json({
                        success: 1,
                        desc: 'success',
                        data: {}
                    });
               }else{ 
                    result_A.forEach(function(elem){
                            var teacheringclass="";
                            var all_teacher_one={
                                id:elem.id,
                                teacher_name:elem.teacher_name,
                                class_name:elem.headmaster_class_name,
                                headmaster_status:elem.headmaster_status,
                                department_list:elem.department_list,
                                teacheringclass_list:now_map,
                                phone:elem.phone,
                                type_grade:elem.type_grade,
                                class:elem.class,
                                display:elem.display,
                                school_id:elem.school_id,
                                class_id:elem.class_id,
                                class_name_teachering:""
                            };
                            if(elem.teacheringclass_list=="||"||elem.teacheringclass_list==null||elem.teacheringclass_list==""){
                                 all_teacher_one.teacheringclass_list=[];
                                 all_teacher.push(all_teacher_one);
                                if(all_index==result_A.length){
                                    res.json({
                                        success:"0",
                                        desc:"success",
                                        data:{
                                            Allteacher:all_teacher
                                        }
                                    });
                                }
                                all_index++;
                            }else{
                                var now_array=elem.teacheringclass_list.split("||");
                                var now_index=1;//位置不同会报错//bug出现在这里
                                console.log("数组："+now_array);
                                console.log("last:::::::::::::::"+JSON.stringify(all_teacher));
                                var class_name_teachering="";
                                now_array.forEach(function(elem){
                                        var one_array={type_grade_word:"",type_grade_number:"",class:"",status:""}
                                                    one_array.type_grade_word=class_change(elem.split(",")[0]);
                                                    one_array.type_grade_number=elem.split(",")[0];
                                                    one_array.class=elem.split(",")[1];
                                                    now_map.push(one_array);
                                                     if(now_index==now_array.length){
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1];
                                                    }else{
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1]+",";
                                                    }
                                                    if(now_index==now_array.length){
                                                        all_teacher_one.teacheringclass_list=now_map;
                                                        all_teacher_one.class_name_teachering=class_name_teachering;
                                                        all_teacher.push(all_teacher_one);
                                                        now_map=[];
                                                        now_index=0;
                                                        if(result_A.length==all_index){
                                                             res.json({
                                                                success:"0",
                                                                desc:"success",
                                                                data:{
                                                                    Allteacher:all_teacher
                                                                }
                                                            });
                                                        }
                                                        all_index++;
                                                    }
                                                    now_index++;
                                        // user_m.get_class_status(elem.split(",")[0],elem.split(",")[1],school_id,function(err,result_get){
                                        //     if(err){
                                        //          res.json({
                                        //             success: -1,
                                        //             desc: 'fail',
                                        //             data: {}
                                        //         });
                                        //     }else{
                                        //         if(result_get==""||result_get==null){//班级没有录入
                                        //             one_array.status=1;
                                        //             one_array.type_grade_number=elem.split(",")[0];
                                        //             one_array.class=elem.split(",")[1];
                                        //             one_array.type_grade_word=class_change(elem.split(",")[0]);
                                        //             console.log("one_array:::::::::::::"+JSON.stringify(one_array));
                                        //             now_map.push(one_array);
                                        //             now_index++;
                                        //             if(now_index==now_array.length){//结束一个老师的任课班级录制
                                        //                 all_teacher_one.teacheringclass_list=now_map;
                                        //                 teacheringclass=one_array;
                                        //                 all_teacher.push(all_teacher_one);
                                        //                 now_map=[];
                                        //                 now_index=0;
                                        //                  if(all_index==result_A.length){
                                        //                     res.json({
                                        //                         success:"0",
                                        //                         desc:"success",
                                        //                         data:{
                                        //                             Allteacher:all_teacher
                                        //                         }
                                        //                     });
                                        //                 }
                                        //                   all_index++;
                                        //             }
                                        //         }else{
                                        //             console.log("now_index的值："+now_index);
                                        //             one_array.status=0;
                                        //             one_array.type_grade_number=elem.split(",")[0];
                                        //             one_array.class=elem.split(",")[1];
                                        //             one_array.type_grade_word=class_change(elem.split(",")[0]);
                                        //             now_map.push(one_array);
                                        //             now_index++;
                                        //             if(now_index==now_array.length){//此时
                                        //                 all_teacher_one.teacheringclass_list=now_map;
                                        //                 teacheringclass=one_array;
                                        //                 all_teacher.push(all_teacher_one);
                                        //                 now_index=0;
                                        //                 now_map=[];
                                        //              if(all_index==result_A.length){
                                        //                     res.json({
                                        //                         success:"0",
                                        //                         desc:"success",
                                        //                         data:{
                                        //                             Allteacher:all_teacher
                                        //                         }
                                        //                     });
                                        //                 }
                                        //                  all_index++;
                                        //             }
                                        //         }
                                        //     }
                                        // });
                                    
                                });
                             
                            }
                    })
               }
           }
       })   
   }
   //添加全体教师
    function addTeacher_all(req,res,next){
        var school_id=req.body.school_id;
        var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
        phones_m.getbase_config_schoolid(school_id,function(err,result){
            if(err){
                res.json({success:-1,desc:err.message,data:{}})
            }else{
                if(result==""||result==null){
                    res.json({success:-1,desc:"对不起没有查询到你所在学校的信息，请联系学校管理员",data:{}})  
                }else{
                    result.map(function(elem){
                        base_config.token=elem.token;
                        base_config.encodingAESKey=elem.encodingAESKey;
                        base_config.corpId=elem.corpId;
                        base_config.agentid=elem.teacherdep_id;
                        base_config.secret=elem.secret;
                    })
                user_m.addTeacher_all(req.body,school_id,function(err,result){
                    if(err){
                        res.json({
                                    success: -1,
                                    desc: 'fail',
                                    data: {}
                                });
                    }else{
                        var teacher_name=req.body.teacher_name;
                        var phone=req.body.phone;
                        message.get_user(phone,base_config,function(err,result){
                            if(err){
                                 if(err.code=="60111"){
                                    message.add_user(phone,teacher_name,base_config,function(err,result){
                                        if(err){
                                            res.json({
                                                success:-1,
                                                desc:err.code
                                            })
                                        }else{
                                            if(result.errcode=="0"){
                                                res.json({
                                                    success: 0,
                                                    desc: 'success',
                                                    data: {
                                                    }
                                                });
                                            }else{
                                                res.json({
                                                    success: -1,
                                                    desc: result.errcode
                                                });
                                            }
                                        }
                                    });
                                 }else{
                                     res.json({
                                            success: 0,
                                            desc: '企业用户存在',
                                            data: {}
                                            });
                                 }
                            }
                        })
                    }
                })  
                }
            }
        });
   
   }
   //添加部门老师
    function addTeacher(req,res,next){
       var school_id=req.body.school_id;
        //addTeacher
       user_m.addTeacher_all(req.body,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                    });
           }
       })  
   }
    //删除老师
    function deleteTeacher_depart(req,res,next){
        //
       user_m.deleteTeacher_depart(req.params.id,req.body.department_name,function(err,result){
           if(err){
               console.log("err11111111111111111"+err);
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
                console.log("err11111111111111111"+66666);
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {}
                    });
           }
       })  
   }
   //编辑老师
   function modifyTeacher_all(req,res,next){
        var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
        var school_id=req.session.school_id;
        phones_m.getbase_config_schoolid(school_id,function(err,result){
            if(err){
                res.json({success:-1,desc:err.message,data:{}})
            }else{
                if(result==""||result==null){
                    console.log("对不起没有查询到你所在学校的信息，请联系学校管理员");
                    res.json({success:-1,desc:"对不起没有查询到你所在学校的信息，请联系学校管理员",data:{}})  
                }else{
                    result.map(function(elem){
                        base_config.token=elem.token;
                        base_config.encodingAESKey=elem.encodingAESKey;
                        base_config.corpId=elem.corpId;
                        base_config.agentid=elem.teacherdep_id;
                        base_config.secret=elem.secret;
                        
                    })
                           var modifyphone_status="";//0//req.body.modifyphone_status;//老师电话0未修改 1修改
                            var modifyname_status ="";// 1//req.body.modifyname_status;//老师名字
                            if(req.body.old_phone==req.body.phone){
                                modifyphone_status=0;
                            }else{
                                modifyphone_status=1;
                            }
                            if(req.body.old_name==req.body.teacher_name){
                                modifyname_status=0;
                            }else{
                                modifyname_status=1;
                            }
                            user_m.modifyTeacher_all(req.params.id,req.body,function(err,result){
                                if(err){
                                    res.json({
                                                success: -1,
                                                desc: 'fail',
                                                data: {}
                                            });
                                }else{
                                    //根据是否变化更新phone判断
                                        if(modifyphone_status=="1"){//老师的电话修改了 
                                            message.add_user(req.body.phone,req.body.teacher_name,base_config,function(err,result){
                                                if(err){
                                                        res.json({
                                                            success:-1,
                                                            desc:err.code
                                                        });
                                                    }else{
                                                        if(result.errcode=="0"){
                                                            //添加成功  删除老用户
                                                            message.delete_user(req.body.old_phone,base_config,function(err,result_add){
                                                                if(err){
                                                                    res.json({
                                                                        success:-1,
                                                                        desc:err.code
                                                                    })
                                                                }else{
                                                                    if(result_add.errcode=="0"){//删除成功
                                                                        res.json({
                                                                            success:0,
                                                                            desc:"删除成功"
                                                                        })
                                                                    }else{
                                                                        res.json({
                                                                            success:-1,
                                                                            desc:result_add.errcode
                                                                        })
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                })
                                            }else if(modifyname_status=="1" && modifyphone_status=="0"){//只修改了名字
                                                message.modify_user(req.body.old_phone,req.body.teacher_name,base_config,function(err,result){
                                                    if(err){
                                                        res.json({
                                                            success:-1,
                                                            desc:err.code
                                                        })
                                                    }else{
                                                        res.json({
                                                            success: 0,
                                                            desc: 'success'
                                                        });
                                                    }
                                                });//修改userid下的name
                                            }else{//都未做修改
                                                res.json({
                                                    success: 0,
                                                    desc: 'success', 
                                                });
                                        }
                                }
                            }) 
                }
            }
        }) 
   }
     //删除教师全体-删除用户
    function deleteTeacher(req,res,next){
         var base_config={token: '',encodingAESKey: '',corpId: '',agentid:'',secret:''}
         var school_id=req.session.school_id;
        phones_m.getbase_config_schoolid(school_id,function(err,result){
            if(err){
                res.json({success:-1,desc:err.message,data:{}})
            }else{
                if(result==""||result==null){
                    res.json({success:-1,desc:"对不起没有查询到你所在学校的信息，请联系学校管理员",data:{}})  
                }else{
                    result.map(function(elem){
                        base_config.token=elem.token;
                        base_config.encodingAESKey=elem.encodingAESKey;
                        base_config.corpId=elem.corpId;
                        base_config.agentid=elem.teacherdep_id;
                        base_config.secret=elem.secret;
                    })
                    user_m.get_teacher_phone(req.params.id,function(err,result){
                        if(err){
                            res.json({
                                success:-1,
                                desc:err
                            })
                        }else{
                            var teacher_phone="";
                            result.map(function(elem){
                                teacher_phone=elem.phone;
                            });
                            user_m.deleteTeacher(req.params.id,function(err,result){
                                    if(err){
                                        res.json({
                                                success: -1,
                                                desc: 'fail',
                                            });
                                    }else{
                                        message.delete_user(teacher_phone,base_config,function(err,result){
                                            if(err){
                                                res.json({
                                                    success:-1,
                                                    desc:err.code
                                                })
                                            }else{
                                                if(result.errcode=="0"){
                                                    console.log("企业号删除成功");
                                                    res.json({
                                                        success: 0,
                                                        desc:"删除成功"
                                                    })
                                                }else{
                                                    res.json({
                                                        success:-1,
                                                        desc:result.errcode
                                                    })
                                                }
                                            }
                                        });
                                    }
                                })  
                        }
                    });
                    
                }
            }
        })
   }
//条件查询教师
function query_Teacher(req,res,next){
        // var school_id=req.body.school_id;
         var school_id=req.body.school_id;
        var now_map=[];
        var all_index=1;
        var all_teacher=[];
        //var now_index=0;//bug出现在这里
       user_m.query_Teacher(req.body,function(err,result_A){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result_A=="1"){
                   res.json({
                        success: 1,
                        desc: 'success',
                        data: {}
                    });
               }else{ 
                    result_A.forEach(function(elem){
                            var teacheringclass="";
                            var all_teacher_one={
                                id:elem.id,
                                teacher_name:elem.teacher_name,
                                class_name:elem.headmaster_class_name,
                                headmaster_status:elem.headmaster_status,
                                department_list:elem.department_list,
                                teacheringclass_list:now_map,
                                phone:elem.phone,
                                type_grade:elem.type_grade,
                                class:elem.class,
                                display:elem.display,
                                school_id:elem.school_id,
                                class_id:elem.class_id,
                                class_name_teachering:""
                            };
                            if(elem.teacheringclass_list=="||"||elem.teacheringclass_list==null||elem.teacheringclass_list==""){
                                 all_teacher_one.teacheringclass_list=[];
                                 all_teacher.push(all_teacher_one);
                                if(all_index==result_A.length){
                                    res.json({
                                        success:"0",
                                        desc:"success",
                                        data:{
                                            Allteacher:all_teacher
                                        }
                                    });
                                }
                                all_index++;
                            }else{
                                var now_array=elem.teacheringclass_list.split("||");
                                var now_index=1;//位置不同会报错//bug出现在这里
                                console.log("数组："+now_array);
                                var class_name_teachering="";
                                console.log("last:::::::::::::::"+JSON.stringify(all_teacher));
                                now_array.forEach(function(elem){
                                        var one_array={type_grade_word:"",type_grade_number:"",class:"",status:""}//一条信息
                                                    one_array.type_grade_word=class_change(elem.split(",")[0]);
                                                    one_array.type_grade_number=elem.split(",")[0];
                                                    one_array.class=elem.split(",")[1];
                                                    now_map.push(one_array);
                                                    if(now_index==now_array.length){
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1];
                                                    }else{
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1]+",";
                                                    }
                                                    if(now_index==now_array.length){
                                                        all_teacher_one.teacheringclass_list=now_map;
                                                        all_teacher_one.class_name_teachering=class_name_teachering;
                                                        all_teacher.push(all_teacher_one);
                                                        now_map=[];
                                                        now_index=0;
                                                        if(result_A.length==all_index){
                                                             res.json({
                                                                success:"0",
                                                                desc:"success",
                                                                data:{
                                                                    Allteacher:all_teacher
                                                                }
                                                            });
                                                        }
                                                        all_index++;
                                                    }
                                                    now_index++;
                                        // user_m.get_class_status(elem.split(",")[0],elem.split(",")[1],school_id,function(err,result_get){
                                        //     if(err){
                                        //          res.json({
                                        //             success: -1,
                                        //             desc: 'fail',
                                        //             data: {}
                                        //         });
                                        //     }else{
                                        //         if(result_get==""||result_get==null){//班级没有录入
                                        //             one_array.status=1;
                                        //             one_array.type_grade_number=elem.split(",")[0];
                                        //             one_array.class=elem.split(",")[1];
                                        //             one_array.type_grade_word=class_change(elem.split(",")[0]);
                                        //             console.log("one_array:::::::::::::"+JSON.stringify(one_array));
                                        //             now_map.push(one_array);
                                        //             now_index++;
                                        //             if(now_index==now_array.length){//结束一个老师的任课班级录制
                                        //                 all_teacher_one.teacheringclass_list=now_map;
                                        //                 teacheringclass=one_array;
                                        //                 all_teacher.push(all_teacher_one);
                                        //                 now_map=[];
                                        //                 now_index=0;
                                        //                  if(all_index==result_A.length){
                                        //                     res.json({
                                        //                         success:"0",
                                        //                         desc:"success",
                                        //                         data:{
                                        //                             Allteacher:all_teacher
                                        //                         }
                                        //                     });
                                        //                 }
                                        //                   all_index++;
                                        //             }
                                        //         }else{
                                        //             console.log("now_index的值："+now_index);
                                        //             one_array.status=0;
                                        //             one_array.type_grade_number=elem.split(",")[0];
                                        //             one_array.class=elem.split(",")[1];
                                        //             one_array.type_grade_word=class_change(elem.split(",")[0]);
                                        //             now_map.push(one_array);
                                        //             now_index++;
                                        //             if(now_index==now_array.length){//此时
                                        //                 all_teacher_one.teacheringclass_list=now_map;
                                        //                 teacheringclass=one_array;
                                        //                 all_teacher.push(all_teacher_one);
                                        //                 now_index=0;
                                        //                 now_map=[];
                                        //              if(all_index==result_A.length){
                                        //                     res.json({
                                        //                         success:"0",
                                        //                         desc:"success",
                                        //                         data:{
                                        //                             Allteacher:all_teacher
                                        //                         }
                                        //                     });
                                        //                 }
                                        //                  all_index++;
                                        //             }
                                        //         }
                                        //     }
                                        // });
                                    
                                });
                             
                            }
                    })
               }
           }
       })   
   }
   //条件查询教师+部门
function query_Teacher_depart(req,res,next){
    //        // var school_id=req.body.school_id;
        var school_id=req.body.school_id;
        var now_map=[];
        var all_index=1;
        var all_teacher=[];
        //var now_index=0;//bug出现在这里
       user_m.querydeparTeacher_condition(req.body.department_name,req.body.school_id,req.body,function(err,result_A){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result_A=="1"){
                   res.json({
                        success: 1,
                        desc: 'success',
                        data: {}
                    });
               }else{ 
                    result_A.forEach(function(elem){
                            var teacheringclass="";
                            var all_teacher_one={
                                id:elem.id,
                                teacher_name:elem.teacher_name,
                                class_name:elem.headmaster_class_name,
                                headmaster_status:elem.headmaster_status,
                                department_list:elem.department_list,
                                teacheringclass_list:now_map,
                                phone:elem.phone,
                                type_grade:elem.type_grade,
                                class:elem.class,
                                display:elem.display,
                                school_id:elem.school_id,
                                class_id:elem.class_id,
                                class_name_teachering:""
                            };
                            if(elem.teacheringclass_list=="||"||elem.teacheringclass_list==null||elem.teacheringclass_list==""){
                                 all_teacher_one.teacheringclass_list=[];
                                 all_teacher.push(all_teacher_one);
                                if(all_index==result_A.length){
                                    res.json({
                                        success:"0",
                                        desc:"success",
                                        data:{
                                            Allteacher:all_teacher
                                        }
                                    });
                                }
                                all_index++;
                            }else{
                                var now_array=elem.teacheringclass_list.split("||");
                                var now_index=1;//位置不同会报错//bug出现在这里
                                console.log("数组："+now_array);
                                var class_name_teachering="";
                                console.log("last:::::::::::::::"+JSON.stringify(all_teacher));
                                now_array.forEach(function(elem){
                                        var one_array={type_grade_word:"",type_grade_number:"",class:"",status:""}//一条信息
                                                    one_array.type_grade_word=class_change(elem.split(",")[0]);
                                                    one_array.type_grade_number=elem.split(",")[0];
                                                    one_array.class=elem.split(",")[1];
                                                    now_map.push(one_array);
                                                    if(now_index==now_array.length){
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1];
                                                    }else{
                                                         class_name_teachering+=class_change(elem.split(",")[0])+elem.split(",")[1]+",";
                                                    }
                                                    if(now_index==now_array.length){
                                                        all_teacher_one.teacheringclass_list=now_map;
                                                        all_teacher_one.class_name_teachering=class_name_teachering;
                                                        all_teacher.push(all_teacher_one);
                                                        now_map=[];
                                                        now_index=0;
                                                        if(result_A.length==all_index){
                                                             res.json({
                                                                success:"0",
                                                                desc:"success",
                                                                data:{
                                                                    Allteacher:all_teacher
                                                                }
                                                            });
                                                        }
                                                        all_index++;
                                                    }
                                                    now_index++;
                               
                                    
                                });
                             
                            }
                    })
               }
           }
       })    
   }
function  Apk(req,res,next){
    var http_path='c:/Apk/app_one.apk';
    var fs=require('fs');
     console.log("路径："+http_path);
        fs.readFile(http_path,'binary',function(err, file) {
            if (err) {
            console.log(err);
            }else{
                res.writeHead(200, {'Content-Type': 'application/vnd.android.package-archive'});//响应形式
                res.write(file,'binary');
                res.end();          
              }
            });
        } 
function class_change(type_grade){
         var class_name="";
        if(type_grade==0){
            class_name="一年级" 
        }else if(type_grade==1){
            class_name="二年级" 
        }else if(type_grade==2){
            class_name="三年级" 
        }else if(type_grade==3){
            class_name="四年级" 
        }else if(type_grade==4){
            class_name="五年级" 
        }else if(type_grade==5){
            class_name="六年级" 
        }else if(type_grade==6){
            class_name="七年级" 
        }else if(type_grade==7){
            class_name="八年级" 
        }else if(type_grade==8){
            class_name="九年级" 
        }else if(type_grade==9){
            class_name="高一" 
        }else if(type_grade==10){
            class_name="高二" 
        }else if(type_grade==11){
            class_name="高三" 
        }else{
            class_name="大学" 
        }
        return class_name;
    }
         //添加老师+cheeck
    function addTeacher_check(req,res,next){
        //班级id
        var check_phone=req.body.check_phone;
        var school_id=req.body.school_id;
       user_m.addTeacher_check(check_phone,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               
               if(result==""||result==null){
                   console.log("返回的结果1"+JSON.stringify(result));
                   res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
               }else{
            console.log("返回的结果2"+JSON.stringify(result));
                res.json({
                        success: 1,
                        desc: '教师已经存在',
                        data: {
                        }
                 });
               }
           }
       })  
   }  //更改老师校验
       function updateTeacher_check(req,res,next){
        //班级id
        var check_phone=req.body.check_phone;
        var school_id=req.body.school_id;
       user_m.updateTeacher_check(check_phone,school_id,function(err,result){
           if(err){
               res.json({
                        success: -1,
                        desc: 'fail',
                        data: {}
                    });
           }else{
               if(result[0].count_m>=2){
                   console.log("返回的结果1"+JSON.stringify(result));
                   res.json({
                        success: 1,
                        desc: '教师已经存在',
                        data: {
                        }
                 });
               }else{
            console.log("返回的结果2::::::::"+JSON.stringify(result[0].count_m));
                res.json({
                        success: 0,
                        desc: 'success',
                        data: {
                        }
                 });
               }
           }
       })  
   }
   //学生登录
   function student_login(req,res,next){
            var student=false;
            var username=req.body.phone;
            user_m.getUser(username,function(err,result){//查询是否是学生
                if(err){
                    res.json({success:-1,desc:"fail"})
                }else{
                    if(result=="1"){//也不是学校管理员
                        res.json({
                            success:1,
                            desc:"您输入的用户不存在"
                        })
                    }else if(result.roles.length>0){
                        var role="";
                        result.roles.forEach(function(role_){
                            role=role_;
                        })
                        if(role=="student"){
                            if (req.body.password === result.password) {
                                    student=true;
                                    session_c.User.student_Login(req,student);
                                    res.redirect('/student_root');
                                } else {
                                    res.json({
                                        success:2,
                                        desc:"密码错误!"//学校管理员密码错误
                                    })
                                }
                        }else{//不是学生
                            res.json({success:1,desc:"不是学生!"})
                     }
                  }
                }
            });
   }
   function  get_out_interface(req,res,next){
        var apiURL="";
        var type=req.query.type;
        if(type=="1"){//物理
            apiURL='http://open.nobook.com/wuli/openapi'
        }else if(type=="2"){//化学
            apiURL='http://open.nobook.com/huaxue/openapi'
        }else if(type=="3"){//生物
            apiURL='http://open.nobook.com/shengwu/openapi'
        }else if(type=="4"){//初中生物
            apiURL='http://open.nobook.com/shengwu_gz/openapi'
        }
        var appid = '1626773250';
        var appkey = 'jyJ5Bs6YucwZdvT9';
        var time = Math.floor(new Date().getTime() / 1000);
        var code = md5(appid + time + appkey);
        // 跳转地址
        var newURL = apiURL + "?appid=" + appid + "&code=" + code + "&time=" + time;
        res.json({success:0,url:newURL});
        //res.redirect(newURL)
        }
    return {
        logIn: logIn,
        logOut: logOut,
        Root: Root,
        changePassword: changePassword,
        addDepartment:addDepartment,
        queryDepartment:queryDepartment,
        modifyDepartment:modifyDepartment,
        deleteDepartment:deleteDepartment,
        queryDepartment_teacher:queryDepartment_teacher,
        queryAllteacher:queryAllteacher,
        addTeacher_all:addTeacher_all,
        querydeparTeacher:querydeparTeacher,
        deleteTeacher_depart:deleteTeacher_depart,
        deleteTeacher:deleteTeacher,
        addTeacher:addTeacher,
        modifyTeacher_all:modifyTeacher_all,
        query_Teacher:query_Teacher,
        Apk:Apk,
        admin_login:admin_login,
        admin_Root:admin_Root,
        admin_logOut:admin_logOut,
        query_Teacher_depart:query_Teacher_depart,
        general_platform_login:general_platform_login,
        general_Platform_Root:general_Platform_Root,
        class_change:class_change,
        addTeacher_check:addTeacher_check,
        get_out_interface:get_out_interface,
        updateTeacher_check:updateTeacher_check,
        logOut_platForm:logOut_platForm,
        student_login:student_login,
        Student_Root:Student_Root
    };
     
})();

module.exports = exports = User;