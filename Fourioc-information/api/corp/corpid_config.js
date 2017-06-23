var config_one=require('../config');
exports.getCorpManager = function(corpId){
     var config={
        token: 'vdb7w44H4nEMPpt9',
        encodingAESKey: '5zmGYZVoOi7qgMjRDJVy84T4HvbBo7uX0dEHWy9Xmqr',
        corpId: corpId,
        secret: config_one.getCorpSecret(corpId),
        agentid:"",//19//这个是appid,
        department:""
     }
    if(corpId=="wx89c411811fef7bc6"){//配置文件

        return MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1
    }
}
//根据企业号获取部门的id
exports.getDepartmentId = function getDepartmentId(corpId,departmentName){
    if(corpId=="wx89c411811fef7bc6"){//配置企业号corpID
         if(departmentName=="家长"){
             return 13
         }else if("老师"){
             return 14
         }
    }else if(corpId=="wx89c411811fef7bc7"){
        return MvicjDUCKrn4rKOzSCH-vcjD1PPzKsG1zcDnsvE1V9NaaKi-2-IIxxifWyl78Cp1
    }else if(corpId=="wx89c411811fef7bc7"){

    }
}