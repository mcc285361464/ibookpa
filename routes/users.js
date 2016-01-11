var express = require('express');
var router = express.Router();
var conn = require('../utils/mysql');
var md5 = require('md5');
var session = require('express-session');
var async = require('async');
var multiparty = require('multiparty');
var fs = require('fs');
var nodemailer = require('nodemailer');


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
	  		var user = sess.user;
	  		if(user.nickname == null || user.nickname == '') {
	  			res.redirect('/users/personal');
	  		}else {
		  		res.redirect('/');
			}
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
		user = sess.user;
	if(user == undefined || user == '' || user == null) {
		res.redirect('/users/login');
	}
	var	username = user.username,
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
	    	conn.query('select u.nickname nickname,u.id,u.sex,u.school,u.headPictureUrl from t_users u,t_friends f where u.id=f.friendId and userId=?',[data.id],function(err,results){
				callback(err,data,data2,data3,results);
			});
	    },function(data,data2,data3,data4,callback) {
	    	conn.query('select ua.id,ua.theme,u.headPictureUrl,u.id uId from t_useractivity ua,t_users u where ua.launcherId=? and activityDateSign>? and u.id=?',[data.id,dateT,data.id],function(err,results){
				callback(err,data,data2,data3,data4,results);
			});
	    },function(data,data2,data3,data4,data5,callback) {
	    	conn.query('select bua.isPass,u.username,u.id uId,u.headPictureUrl,ua.id,ua.theme from t_users u,t_useractivity ua,t_betweenuseractivity bua where bua.receiverId=? and bua.userActivityId=ua.id and ua.activityDateSign>? and ua.launcherId=u.id',[data.id,dateT],function(err,results){
				callback(err,data,data2,data3,data4,data5,results);
			});
	    },function(data,data2,data3,data4,data5,data6,callback) {
	    	conn.query('select u.id uId,u.headPictureUrl,ua.id,ua.theme from t_useractivity ua,t_betweenuseractivity bua,t_users u where (bua.receiverId=? and bua.userActivityId=ua.id and ua.activityDateSign<? and u.id=ua.launcherId) or (ua.launcherId=? and ua.activityDateSign<? and u.id=ua.launcherId) group by ua.id;',[data.id,dateT,data.id,dateT],function(err,results){
				callback(err,data,data2,data3,data4,data5,data6,results);
			});
	    },function(data,data2,data3,data4,data5,data6,data7,callback) {
	    	conn.query('select ua.id,ua.theme from t_useractivity ua,t_betweenuseractivity bua where (bua.receiverId=? and bua.userActivityId=ua.id and ua.activityDateSign<?) or (ua.launcherId=? and ua.activityDateSign<?);',[data.id,dateT,data.id,dateT],function(err,results){
				callback(err,data,data2,data3,data4,data5,data6,data7,results);
			});
	    }
    ], function (err,user,provinces,mes,friends,selfAct,applyAct,finAct,applyMan) {  
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
	    	conn.query('select id,nickname,sex,school,signature,headPictureUrl from t_users where id=?',[user_id],function(err,results){
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

router.post('/manageAct' , function (req, res, next) {
	var aId = req.body.aId,
		sess = req.session,
		user = sess.user,
		data = '',
		sId = user.id;
	conn.query('select u.id,u.nickname,u.headPictureUrl,u.username from t_users u where id in (select receiverId from t_betweenuseractivity bua where bua.userId=? and bua.userActivityId = ? and bua.isPass != 1);',[sId,aId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			for(var i=0;i<results.length;i++) {
				data += [
					'<div class="row">',
	                   '<div class="col-md-1"><a href="/users/visit/'+results[i].id+'"><img src="'+results[i].headPictureUrl+'" class="img-head"></a></div>',
	                   '<div class="col-md-3">'+results[i].nickname+'</div>',
	                   '<div class="col-md-3 col-md-offset-1 none tel'+results[i].id+'">'+results[i].username+'</div>',
	                   '<span class="btn col-md-offset-6 btn-success pass pass'+results[i].id+'" data-id='+results[i].id+'>通过</span>',
	               '</div>',
	            ].join('');
			}
			conn.query('select u.id,u.nickname,u.headPictureUrl,u.username from t_users u where id in (select receiverId from t_betweenuseractivity bua where bua.userId=? and bua.userActivityId = ? and bua.isPass = 1);',[sId,aId],function(err,results){
				if(err) {
					console.log(err);
				} else {
					for(var i=0;i<results.length;i++) {
						data += [
							'<div class="row">',
			                   '<div class="col-md-1"><a href="/users/visit/'+results[i].id+'"><img src="'+results[i].headPictureUrl+'" class="img-head"></a></div>',
			                   '<div class="col-md-3">'+results[i].nickname+'</div>',
			                   '<div class="col-md-6 col-md-offset-1 tel'+results[i].id+'"><span class="fontS18 green">已通过，电话：</span>'+results[i].username+'</div>',
			               	'</div>',
			            ].join('');
					}	
					res.json({'state':200,'msg':data});
				}
			});
		}
	});
});

router.post('/passAct', function(req, res, next){
	var uId = req.body.user_id,
		aId = req.body.aId;
	conn.query('update t_betweenuseractivity set isPass=1 where userActivityId=? and receiverId=?',[aId,uId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			console.log(uId+'--'+aId);
			res.json({'state':200});
		}
	});
});

//上传图片
router.post('/uploadHeadPic', function(req, res, next) {
    //生成multiparty对象，并配置上传目标路径
   var form = new multiparty.Form({uploadDir: './public/headPics/'});
   var sess = req.session,
   	   user = sess.user,
   	   uId = user.id;
   //上传完成后处理
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);
		if(err){
		  console.log('parse error: ' + err);
		} else {
		  var inputFile = files.inputHead[0];
		  var uploadedPath = inputFile.path;
		  var dstPath = uploadedPath.substr(6);
		  conn.query('update t_users set headPictureUrl=? where id=?',[dstPath,uId],function(){
		  	if(err) {
		  		console.log(err);
		  	}else {
		  		user.headPictureUrl = dstPath;
		  		res.redirect('/users/personal');
		  	}
		  });
 /*
		  var dstName = 'ibookpa_';
		  for(var i=0;i<6;i++) {
		  	dstName += Math.floor(Math.random()*10);
		  }
		  var dstPath = './public/headPics/' + inputFile.originalFilename;
		  */
	//	  var dstPath = '/headPics/'+dstName+".png";
		  //重命名为真实文件名
		  /*
		  fs.rename(uploadedPath, dstPath, function(err) {
		    if(err){
		      console.log('rename error: ' + err);
		    } else {
		      console.log(uploadedPath);
		      console.log(dstPath);
		      console.log('rename ok');
		    }
		  });
  */

		}
	});
});

//忘记密码
router.get('/forget', function(req, res, next) {
	res.render('forget');
});

router.post('/forgetPassword', function(req, res, next) {
	var username = req.body.username,
		email = req.body.email,
		regU = /^1[34578]\d{9}/,
		regM = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

	if(!regU.test(username) || !regM.test(email)) {
		res.render('forget',{'err':'用户名或邮箱格式错误'});
	}

	conn.query('select username,mail from t_users where username=?',[username],function(err,results){
		if(err) {
			console.log(err);
		}else {
			if(results.length == 0) {
				res.render('forget',{err:'该用户名没有注册'});
			}else {
				if(results[0].mail != email) {
					res.render('forget',{err:"该用户名对应的邮箱错误"})
				}else {
					// create reusable transporter object using SMTP transport 
					var transporter = nodemailer.createTransport({
					    service: '163',
					    auth: {
					        user: 'shupawang@163.com',
					        pass: 'shupawang123'
					    }
					});
					var href = 'http://localhost:3000/users/tranChangePass/'+username;
					var mailOptions = {
					    from: '书趴网 <shupawang@163.com>', // sender address 
					    to: email, // list of receivers 
					    subject: '找回密码', // Subject line 
					    text: 'Hello world ', // plaintext body 
					    html: '<a href="'+href+'"><b>点击该链接修改密码</b></a>' // html body 
					};
					transporter.sendMail(mailOptions, function(error, info){
					    if(error){
					        return console.log(error);
					    }
					});
					res.render('login');
				}
			}
		}
	});
});

router.get('/tranChangePass/:uName', function(req, res, next) {
	var username = req.params.uName;
	res.render('forget1',{username:username});
});

router.post('/changePasswordFinally', function(req, res, next) {
	var username = req.body.username,
		password = req.body.password;
	conn.query('update t_users set password = ? where username = ?',[password,username],function(err,results){
		if(err) {
			console.log(err);
		}else {
			res.render('login',{changeSuccess:'修改密码成功'});
		}
	});
	
});

//通过时间戳--->时间
function getDate(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}     
module.exports = router;
