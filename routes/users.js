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
	  if(error) {
	  	console.log(error);
	  }else {
	  	if(results == "") {
	  		res.render('login',{'error':'用户名或密码错误'});
	  	}else {
	  		console.log('this is '+results+'!!!');
	  		res.redirect('/');
	  	}	
	  }
  });
});

module.exports = router;
