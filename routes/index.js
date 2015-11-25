var express = require('express');
var router = express.Router();
var session = require('express-session');
var conn = require('../utils/mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/publish', function(req, res, next) {
	conn.query('select schoolName from t_school',function(err,results){
		if(err) {
			console.log('err');
		}else {
			console.log(eval(results));
			res.render('publish',{schoolName:eval(results)});
		}
	});
});

module.exports = router;
