var express = require('express');
var router = express.Router();
var conn = require('../utils/mysql');
var md5 = require('md5');
var session = require('express-session');
var async = require('async')

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
	  		res.redirect('/');
	  	}	
	  }
  });
});
/*进行注册*/
router.post('/users/doRegister', function (req, res, next) {
  var username = req.body.username;
  var sess = req.session;
  console.log('lababa');
  conn.query ('select * from t_users where username=?',[username],function(error, results, fields) {
	  if(error) {
	  	console.log(error);
	  } else if(results == '') {
		conn.query('insert into t_users(username,password) value(?,?)',[username,md5(req.body.password)],function(error, results, fields) {
		  if(error) {
		  	console.log(error);
		  } else {
		/*
		  	sess.user = {username:username};
		  	conn.query('select province from t_school group by province order by id',function(err,results){
				if(err) {
					console.log('error:'+err);
				}else {
					res.render('person',{'provinces':results});
				}
			});
		*/	
			sess.user = {username:username};
			res.redirect('/users/personal');
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
		user = sess.user,
		username = user.username,
		oDate = new Date(), //时间对象
		dateT = Math.round(new Date().getTime()/1000);
	async.waterfall([  
	    function(callback){
		    conn.query('select * from t_users where username=?',[username],function(err,results){
		    	callback(err,results[0]);
			});
	    },function(data,callback) {
	    	conn.query('select province from t_school group by province order by id',function(err,results){
				callback(err,data,results);
			});
	    },function(data,data2,callback) {
	    	conn.query('select u.nickname nickname,um.messageContent,date,isPersonMessage from t_usermessage um,t_users u where um.launchUserId=u.id and um.receiverId=?',[data.id],function(err,results){
				callback(err,data,data2,results);
			});
	    },function(data,data2,data3,callback) {
	    	conn.query('select u.nickname nickname,u.id,u.sex,u.school from t_users u,t_friends f where u.id=f.friendId and userId=?',[data.id],function(err,results){
				callback(err,data,data2,data3,results);
			});
	    },function(data,data2,data3,data4,callback) {
	    	conn.query('select id,theme from t_useractivity where launcherId=?',[data.id],function(err,results){
				callback(err,data,data2,data3,data4,results);
			});
	    },function(data,data2,data3,data4,data5,callback) {
	    	conn.query('select ua.id,ua.theme from t_useractivity ua,t_betweenuseractivity bua where bua.receiverId=? and bua.userActivityId=ua.id',[data.id],function(err,results){
				callback(err,data,data2,data3,data4,data5,results);
			});
	    },function(data,data2,data3,data4,data5,data6,callback) {
	    	conn.query('select ua.id,ua.theme from t_useractivity ua,t_betweenuseractivity bua where (bua.receiverId=? and bua.userActivityId=ua.id and ua.activityDateSign<?) or (ua.launcherId=? and ua.activityDateSign<?);',[data.id,dateT,data.id,dateT],function(err,results){
				callback(err,data,data2,data3,data4,data5,data6,results);
			});
	    }
    ], function (err,user,provinces,mes,friends,selfAct,applyAct,finAct) {  
    	if(err) {
    		console.log(err);
    	}else {
    		user = user;
			res.render('person',{'provinces':provinces,'mes':mes,'friends':friends,'selfAct':selfAct,'applyAct':applyAct,'finAct':finAct});
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
			conn.query('update t_users set nickname=?,birthday=?,mail=?,school=?,signature=?,sex=? where username=?',[nickname,birth,email,school,signature,sex,user.username],function(err,results){
				if(err) {
					console.log(err);
				}else {
				/*
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
				*/
					user.nickname = nickname;
					user.sex = sex;
					user.birthday = birth;
					user.mail = email;
					user.school = school;
					user.signature = signature;
					res.redirect('/users/personal');
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
	res.redirect('/');
});

//进入访客页面 userPage.ejs
router.get('/visit/:user_id' , function (req, res, next) {
	var user_id = req.params.user_id;
	var user = null;
	var publicCount = null;
	var joinCount = null;
	var attentived = null;
	async.waterfall([  
	    function(callback){
	    	conn.query('select id,nickname,sex,school,signature from t_users where id=?',[user_id],function(err,results){
				callback(err, results[0]);  
			});
	    },
	    function (data, callback){
			user = data;
			conn.query('select id from t_useractivity where launcherId=?',[user_id],function(err,data){
	        	callback(err,user,data.length);  
	        });  
		},
		function (user,data2, callback){
			publicCount = data2;
			conn.query('select id from t_betweenuseractivity where receiverId=?',[user_id],function(err,data){
	        	callback(err,user,publicCount,data.length);  
	        });  
		},
		function (user,publicCount,data3, callback){
			joinCount = data3;
			conn.query('select userId from t_friends where friendId=?',[user_id],function(err,data){
	        	callback(err,user,publicCount,joinCount,data);  
	        });  
		}
    ], function (err,d0,d1,d2,d3) {  
    	if(err) {
    		console.log(err);
    	}else {
			res.render('userPage',{user:d0,publicCount:d1,joinCount:d2,attentived:d3});
    	}
    });  
	
}) 

//关于我们
router.get('/aboutUs' , function (req, res, next) {
	res.render('aboutUs');
});

//私信 
router.post('/personal-message' , function (req, res, next) {
	var sess = req.session,
		user = sess.user,
		sId = user.id,
		personId = req.body.user_id,
		message = req.body.message,
		oDate = new Date(), //时间对象
		dateT = Math.round(new Date().getTime()/1000),
		date = getDate(dateT);
	conn.query('insert into t_usermessage(messageContent,date,isPersonMessage,launchUserId,receiverId) value(?,?,?,?,?)',[message,date,1,sId,personId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			res.json({'state':200});
		}
	});
});

//关注
router.post('/add-friend' , function (req, res, next) {
	var sess = req.session,
		user = sess.user,
		sId = user.id,
		personId = req.body.user_id;
	conn.query('select * from t_friends where friendId=? and userId=?',[personId,sId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			if(results.length == 0) {
				conn.query('insert into t_friends(friendId,userId) value(?,?)',[personId,sId],function(err,results){
					if(err) {
						console.log(err);
					}
				});
			}
		}
		res.json({'state':200,'msg':'add'});
	});
});
//取消关注
router.post('/del-friend' , function (req, res, next) {
	var sess = req.session,
		user = sess.user,
		sId = user.id,
		personId = req.body.user_id;
	conn.query('select * from t_friends where friendId=? and userId=?',[personId,sId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			if(results.length != 0) {
				conn.query('delete from t_friends where friendId=? and userId=?',[personId,sId],function(err,results){
					if(err) {
						console.log(err);
					}
				});
			}
		}
		res.json({'state':200,'msg':'del'});
	});
});

router.post('/changePassword' , function (req, res, next) {
	var oldPassword = req.body.oldPassword,
	 	newPassword = req.body.newPassword,
	 	sess = req.session,
		user = sess.user,
		sId = user.id;
	conn.query('select * from t_users where id=?',[sId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			if(results[0].password == md5(oldPassword)) {
				conn.query('update t_users set password = ? where id=?',[md5(newPassword),sId],function(err,results){
					if(err) {
						console.log(err);
					}else {
						res.json({'state':200,'msg':'ok'});		
					}
				});
			}else {
				res.json({'state':200,'msg':'oldErr'});
			}
		}
	});
});

function getDate(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}     
module.exports = router;
