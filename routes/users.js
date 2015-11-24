var express = require('express');
var router = express.Router();
var conn = require('../utils/mysql');
var md5 = require('md5');

/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.send('respond with a resource');
});

router.get('/login',function(req,res,next){
	res.render('login');
});

router.get('/register',function(req,res,next){
	res.render('register');
});

router.post('/doLogin', function (req, res, next) {
  // 判断用户名密码是否正确
  conn.query('select * from t_users where username=? and password=?',[req.body.username,md5(req.body.password)],function(error, results, fields) {
	  var sess = req.session;
	  if(error) {
	  	console.log(error);
	  }else {
	  	if(results == "") {
	  		res.render('login',{'error':'用户名或密码错误'});
	  	}else {
	  		sess.user = results[0];
	  		console.log(sess.user);
	  		res.render('index',{user:sess.user});
	  	}	
	  }
  });
});

router.post('/doRegister', function (req, res, next) {
  // 判断用户名密码是否正确
  var username = req.body.username;
	conn.query ('select * from t_users where username=?',[username],function(error, results, fields) {
		  if(error) {
		  	console.log(error);
		  } else if(results == '') {
			conn.query('insert into t_users(username,password) value(?,?)',[username,md5(req.body.password)],function(error, results, fields) {
			  if(error) {
			  	console.log(error);
			  } else {
			  	res.render('login');
			  }
			});
		  } else {
		  	res.render('register',{'error':'该用户已经注册'});
		  }
	});
});

router.get('/personal', function (req, res, next) {
	res.render('person');
});

module.exports = router;
