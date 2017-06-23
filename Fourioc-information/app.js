var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var index = require('./routes/admin/index');
var users = require('./routes/admin/users');
var questions = require('./routes/admin/questions');
var classes = require('./routes/admin/classes');
var phones = require('./routes/admin/phones');
var school = require('./routes/admin/school');
var binding = require('./routes/admin/binding');
var msg = require('./routes/edu/edumsg');
var msgHandler = require('./api/msg');
var session_c = require('./controller/session_c');
var app = express();
var DBM = require('./model/DB');
var Wechat = require('./api/wechat');
var util = require('util');
var wxallrequest_class= require('./routes/wxallrequest/class');
var wxallrequest_questionnair= require('./routes/wxallrequest/questionnair');
var api = require('./routes/api/index');
var wxqyh = require('./routes/admin/wxqyh');
var test = require('./routes/api/v1/personal_info/index');
var whgx = require('./routes/admin/whgx');
var subscriber = require('./routes/admin/subscriber');
var wxedu = require('./routes/edu/edumsg');
DBM.dbInit().then(function(corps){//初始化文件
     console.log("初始化文件："+JSON.stringify(corps));
      if(util.isArray(corps)) {
            corps.forEach(function (corp) {
                var wechat = Wechat.createCorpManager(corp);
                msgHandler.makeMsgHandler(wechat);
            });
    }}).then(function(){//自动加载corpid})
})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    name: 'HDKT',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1000*60*60*24},  //10分钟失效
    resave: false,
    saveUninitialized: true
}))
app.use(function(req, res, next){
  req.session._garbage = Date();
  req.session.touch();
  next();
});//session触发延时
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit : "10000kb"}));

app.use('/', index);
app.use('/users', users);
app.use('/questions', questions);
app.use('/phones', phones);
app.use('/classes', classes);
app.use('/school', school);
app.use('/binding', binding)
app.use('/edu/one', msg)
app.use('/wxallrequest_class', wxallrequest_class)

app.use('/api', api);
app.use('/wxqyh', wxqyh);
app.use('/api/v1/personal_info', test);
app.use('/wxallrequest_questionnair', wxallrequest_questionnair)
app.use('/whgx', whgx);
app.use('/subscriber', subscriber);
app.use('/wxedu', wxedu);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




//自动加载 数据库corpid
 
module.exports = app;
