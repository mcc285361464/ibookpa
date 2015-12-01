var express = require('express');
var router = express.Router();
var session = require('express-session');
var conn = require('../utils/mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
	var nowDateT = Math.round(new Date().getTime()/1000);
	conn.query('select * from t_useractivity where activityDateSign>?',[nowDateT],function(err,results){
		if(err) {
			console.log(err);
		}else {
			console.log(results);
			res.render('index',{acts:results});
		}
	});
});

//发布活动
router.get('/publish', function(req, res, next) {
	var sess = req.session;
	var user = sess.user;
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
	conn.query('insert into t_useractivity(activityDateSign,createDate,theme,objectSex,finishDate,address,activityWay,remark,applycount,launcherId) values(?,?,?,?,?,?,?,?,?)',
	[endDateT,startDate,theme,sex,endDate,address,way,remark,applyCount,user.id],function(err,results){
		if(err) {
			console.log(err);
		}else {
			res.redirect('/');
		}
	});
});

function getDate(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}     

module.exports = router;
