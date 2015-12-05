var express = require('express');
var router = express.Router();
var session = require('express-session');
var conn = require('../utils/mysql');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	var nowDateT = Math.round(new Date().getTime()/1000);
	var friends = new Array();
	var sess = req.session;
	var user = sess.user;
	async.waterfall([  
	    function(callback){
		    conn.query('select u.id uid,u.nickname,ua.id,ua.theme,ua.activityWay,ua.address,ua.applyCount,ua.createDate,ua.finishDate,ua.objectSex,ua.remark from t_users u,t_useractivity ua where activityDateSign>? and ua.launcherId=u.id;',[nowDateT],function(err,results){
				callback(err, results);  
			});
	    }
    ], function (err,activitys) {  
    	if(err) {
    		console.log(err);
    	}else {
			res.render('index',{acts:activitys});
    	}
    });  

});

//发布活动
router.get('/publish', function(req, res, next) {
	var sess = req.session;
	var user = sess.user;
	if(user == null) {
		res.redirect('/users/login');
	}
	conn.query('select * from t_school where province = (select province from t_school where schoolName = ?)',
	[user.school],function(err,results){
		if(err) {
			console.log(err);
		}else {
			res.render('publish',{schoolName:results});
		}
	});
});

//通过省份选择学校
router.post('/changeSchool',function(req, res, next) {
	var province = req.body.province;
	conn.query('select schoolName from t_school where province=?',[province],function(err,results){
		if(err) {
			console.log(err);
		}else {
			res.json({'msg':results});
		}
	});
});

//发布活动
router.post('/publishActivity',function(req,res,next) {
	var sess = req.session,
		user = sess.user;
	var theme = req.body.theme,
		date = req.body.date,
		remark = req.body.remark,
		sex = req.body.sex,
		address = req.body.address,
		applyCount = 0,
		way = req.body.way;
	var oDate = new Date(); //时间对象
		startDateT = Math.round(new Date().getTime()/1000),
		startDate = getDate(startDateT),
		endDateT = null;
	switch(sex){
		case 'both':
			sex = '不限';
			break;
		case 'man':
			sex = '男';
			break;
		case 'woman':
			sex = '女';
			break;
		default:
			break;
	}
	switch(way){
		case 'book':
			way = '陪看书';
			break;
		case 'study':
			way = '去自习';
			break;
		case 'friend':
			way = '找书友';
			break;
		case 'change':
			way = '换本书';
			break;
		case 'teach-book':
			way = '求教材';
			break;
		case 'more-lession':
			way = '求补课';
			break;
		default:
			break;
	}
	switch(date){
		case 'day':
			endDateT = 60*60*24+startDateT;
			break;
		case 'week':
			endDateT = 60*60*24*7+startDateT;
			break;
		case 'halfMonth':
			endDateT = 60*60*24*15+startDateT;
			break;
		case 'month':
			endDateT = 60*60*24*30+startDateT;
			break;
		default:
			break;
	}
	var endDate = getDate(endDateT);
	conn.query('insert into t_useractivity(activityDateSign,createDate,theme,objectSex,finishDate,address,activityWay,remark,applycount,launcherId) values(?,?,?,?,?,?,?,?,?,?)',
	[endDateT,startDate,theme,sex,endDate,address,way,remark,applyCount,user.id],function(err,results){
		if(err) {
			console.log(err);
		}else {
			res.redirect('/');
		}
	});
});

//跳到评论页面
router.get('/comment/:aid',function(req, res, next) {
	var aid = req.params.aid;

	async.waterfall([  
	    function(callback){
		    conn.query('select u.id uid,u.nickname,ua.id,ua.theme,ua.activityWay,ua.address,ua.applyCount,ua.createDate,ua.finishDate,ua.objectSex,ua.remark from t_users u,t_useractivity ua where ua.id=? and ua.launcherId=u.id;',[aid],function(err,results){
				callback(err, results[0]);  
			});
	    },function(data,callback) {
	    	conn.query('select messageContent,date,nickname from t_users u,t_usermessage us where u.id=us.launchUserId and us.activityId=?',[aid],function(err,results){
				callback(err, data,results);  
			});
	    },function(data,data2,callback) {
	    	conn.query('select * from t_friends where friendId=?',[data.uid],function(err,results){
	    		callback(err,data,data2,results);
	    	});	
	    },function(data,data2,data3,callback) {
	    	conn.query('select * from t_betweenuseractivity where userActivityId=? and userId=?',[aid,data.uid],function(err,results){
	    		callback(err,data,data2,data3,results);
	    	});
	    },function() {
	    	
	    }
    ], function (err,activity,messages,attentive,apply) {  
    	if(err) {
    		console.log(err);
    	}else {
    		console.log(apply);
			res.render('activity',{act:activity,mes:messages,att:attentive,apply:apply});
    	}
    });  
});

//评论活动
router.post('/act-comment',function(req, res, next) {
	var sess = req.session,
		user = sess.user;
	if(user == null) {
		res.redirect('/users/login');
	}
	var actId = req.body.actId,
		fId = req.body.uId,
		comment = req.body.comment,
		uId = user.id;
	var oDate = new Date(); //时间对象
		dateT = Math.round(new Date().getTime()/1000),
		date = getDate(dateT),
	conn.query('insert into t_usermessage(messageContent,date,activityId,launchUserId,receiverId) values(?,?,?,?,?)',[comment,date,actId,fId,uId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			res.redirect('/comment/'+actId)
		}
	});
});

//报名活动
router.post('/apply-act',function(req, res, next) {
	var personId = req.body.user_id,
		aId = req.body.aId,
		sess = req.session,
		user = sess.user,
		userId = user.id,
		applyCount = parseInt(req.body.applyCount)+1;

	conn.query('select * from t_betweenuseractivity where userActivityId=? and userId=? and receiverId=?',[aId,personId,userId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			if(results.length == 0) {
				conn.query('insert into t_betweenuseractivity(userActivityId,userId,receiverId) values(?,?,?)',[aId,personId,userId],function(err,results){
					if(err) {
						console.log(err);
					}else {
						console.log(applyCount);
						conn.query('update t_useractivity set applyCount=? where id = ?',[applyCount,aId],function(err,results){
							if(err) {
								console.log(err);
							}
						});
					}
				});
			}
		}
		res.json({'state':200,'msg':'add'});
	});
});


//取消报名活动
router.post('/cancel-act',function(req, res, next) {
	var personId = req.body.user_id,
		aId = req.body.aId,
		sess = req.session,
		user = sess.user,
		userId = user.id,
		applyCount = 0;
	if(applyCount>0) {
		applyCount = parseInt(req.body.applyCount)-1;
	}

	conn.query('select * from t_betweenuseractivity where userActivityId=? and userId=? and receiverId=?',[aId,personId,userId],function(err,results){
		if(err) {
			console.log(err);
		}else {
			if(results.length != 0) {
				conn.query('delete from t_betweenuseractivity where userActivityId=? and userId=? and receiverId=?',[aId,personId,userId],function(err,results){
					if(err) {
						console.log(err);
					}else {
						console.log(applyCount);
						conn.query('update t_useractivity set applyCount=? where id = ?',[applyCount,aId],function(err,results){
							if(err) {
								console.log(err);
							}
						});
					}
				});
			}
		}
		res.json({'state':200,'msg':'del'});
	});
});

//服务条款
router.get('/service',function(req, res, next) {
	res.render('service');
});


function getDate(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}     

module.exports = router;
