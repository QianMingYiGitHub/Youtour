var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var serviceStore = {};
  console.log(1);
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(1);
    res.render('index', { title: 'Express' });
});

// router.use('/:service', function(req, res, next) {
//     if(util.isNullOrUndefined(serviceStore[req.params.service])) {
//         try {
//             console.log(req.params.service+'.path = ' + path.join(__dirname, req.params.service));
//             serviceStore[req.params.service] = require(path.join(__dirname, req.params.service));
//         } catch (error) {
//             console.log('error.message = ' + error.message);
//             return res.json({
//                 success: -1,
//                 desc:'service is invalid!',
//                 data:{}
//             });
//         }
//     }
//     serviceStore[req.params.service](req, res, next);
// });

module.exports = router;