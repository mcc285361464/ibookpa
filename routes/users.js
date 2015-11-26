var express = require('express');
var router = express.Router();
var conn = require('../utils/mysql');
var md5 = require('md5');
var session = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.send('respond with a resource');
});
/*跳到登陆页*/
router.get('/login',function(req,res,next){
	res.render('login');
});
/*跳到注册页*/
router.get('/register',function(req,res,next){
	res.render('register');
});
/*进行登陆验证*/
router.post('/users/doLogin', function (req, res, next) {
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
	  		res.render('index',{user:sess.user});
	  	}	
	  }
  });
});
/*进行注册*/
router.post('/doRegister', function (req, res, next) {
  var username = req.body.username;
  var sess = req.session;
	conn.query ('select * from t_users where username=?',[username],function(error, results, fields) {
		  if(error) {
		  	console.log(error);
		  } else if(results == '') {
			conn.query('insert into t_users(username,password) value(?,?)',[username,md5(req.body.password)],function(error, results, fields) {
			  if(error) {
			  	console.log(error);
			  } else {
			  	sess.user = {username:username};
			  	console.log(sess.user);
			  	res.render('person',{user:sess.user});
			  }
			});
		  } else {
		  	res.render('register',{'error':'该用户已经注册'});
		  }
	});
});
/*跳到个人中心*/
router.get('/personal', function (req, res, next) {
	var sess = req.session,
		user = sess.user;
	conn.query('select * from t_users where username=?',[user.username],function(err,results){
		if(err) {
			console.log(err);
		}else {
			conn.query('select province from t_school group by province order by id',function(err,results){
				if(err) {
					console.log('error:'+err);
				}else {
					user = results[0];
					res.render('person',{'provinces':results});
				}
			});
		}
	});
});
/*填写个人信息*/
router.post('/savePersonInfo', function (req, res, next) {
    var nickname = req.body.nickname,
    	sex = req.body.sex,
    	birth = req.body.birth,
    	email = req.body.email,
    	school = req.body.school,
    	signature = req.body.signature,
		user = req.session.user;
	conn.query('select * from t_users where nickname=? and username!=?',[nickname,user.username],function(err,results){
		if(err) {
			console.log(err);
		}else if(results == ''){
			conn.query('update t_users set nickname=?,birthday=?,mail=?,school=?,signature=? where username=?',[nickname,birth,email,school,signature,user.username],function(err,results){
				if(err) {
					console.log(err);
				}else {
					conn.query('select province from t_school group by province order by id',function(err,results){
					if(err) {
							console.log('error:'+err);
						}else {
							user.nickname = nickname;
							user.sex = sex;
							user.birthday = birth;
							user.mail = email;
							user.school = school;
							user.signature = signature;
							res.render('person',{'provinces':results});
						}
					});
				}
			});
		}else {
			res.render('person',{nicknameError:'该用户名已被注册'});
		}
	});
});
/*登出操作*/
router.get('/logout' , function (req, res, next) {
	var sess = req.session;
	req.session.user = null;
	res.render('index');
});


module.exports = router;
