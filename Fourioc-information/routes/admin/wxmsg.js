var express = require('express');
var router = express.Router();
var wechat_c = require('../../controller/wechat_c');

var handler = wechat_c.wxMsgHandler();
router.all('/', function(req, res, next) {
    handler(req, res, next);
});

router.get('/menu', function (req, res, next) {
    wechat_c.createMenu({
        button:[
            {	
                name:'menu1',
                sub_button:[
                    {
                        type:'view',
                        name:'test_add',
                        key:'zsks_ksbm_yjsks'
                        //url:"http://xcxt.youtour.com.cn/security_case/add_case_main",
                    },
                    {
                        type:'click',
                        name:'menu1-2',
                        key:'zsks_ksbm_yjsks'
                    }
                ]
            },
            {	
                type:'view',
                name:'报件系统',
                //url:"http://xcxt.youtour.com.cn/security_case/add_case_main",
                url:wechat_c.getUrl('/binding/binding_phone')
            },
            {
                name:'menu3',
                sub_button:[
                    {
                        type:'click',
                        name:'menu3-1',
                       // url:wechat_c.getUrl('/security_case/add_case')
                        key:'zsks_fwcx_gdks'
                    },
                    {
                        type:'click',
                        name:'menu3-2',
                        key:'zsks_fwcx_gdks'
                    }
                ]
            }
            
            ]
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.render('error', {message: err.message, error:{}});
        } else {
            res.json(result);
        }
    });
});

module.exports = router;