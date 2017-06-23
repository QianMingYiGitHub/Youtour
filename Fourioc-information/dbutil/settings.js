(function() {
    var settings;

    settings = {
        db_l: {
            host: '123.56.178.45',     //本地数据库
            port: '3306',
            user: 'admin',          //数据库用户名
            password: 'smart_lnzsks',          //数据库密码
            database: 'Fourioc_test'  //数据库名称
        },
        db_p:{
            host: '123.56.178.45',     //外网测试用
            port: '3306',
            user: 'admin',          //数据库用户名
            password: 'smart_lnzsks',          //数据库密码
            database: 'Fourioc_public'  //数据库名称
        },
        status: 0 //0代表本地 1 代表外网
    };
    module.exports = settings;

}).call(this);
 