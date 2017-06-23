var express = require('express');
var router = express.Router();
var homework = require('../wxqyh/homework');
var classmng = require('../wxqyh/class');
var rate = require('../wxqyh/rate');
var activity = require('../wxqyh/activity');
var school = require('../wxqyh/school');
var questionnair = require('../wxqyh/questionnair');
var reply = require('../wxqyh/reply');

router.use('/homework', homework);
router.use('/class', classmng);
router.use('/rate', rate);
router.use('/activity',activity);
router.use('/school',school);
router.use('/questionnair',questionnair);
router.use('/reply', reply);
router.get('/',function(req, res, next){
    console.error('/wxqyh/ do not support');
    res.render("/wxqyh/ do not support");
});
module.exports = router;