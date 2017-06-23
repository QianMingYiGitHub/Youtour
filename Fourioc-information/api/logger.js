/**
 * Created by Think on 2016/10/12.
 */
var fs = require('fs');
var log4js = require('log4js');
var path = require('path');

function configureLogger(filename, category) {
    log4js.configure({
        appenders:[
            {type: 'console'},
            {type: 'file', filename:filename, category: category}
        ]
    });
}
try {
    fs.mkdirSync(path.join(__dirname,'../logs'));
    configureLogger(path.join(__dirname,'../logs/cheese.log'),'cheese');
} catch (error) {
    if(error.code === 'EEXIST'){//如果目录存在
        configureLogger(path.join(__dirname,'../logs/cheese.log'),'cheese');
    }else{//其他错误？
        configureLogger(path.join(__dirname,'../cheese.log'),'cheese');
    }
}
exports.logger = log4js.getLogger('cheese');
