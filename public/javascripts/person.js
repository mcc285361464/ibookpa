$(function(){
	/*
		用js延缓添加默认黑龙江省的学校
	*/
	var schools = [
			'<li class="school-item">黑龙江大学</li>',
			'<li class="school-item">哈尔滨工业大学</li>',
			'<li class="school-item">哈尔滨工程大学</li>',
			'<li class="school-item">东北林业大学</li>',
			'<li class="school-item">东北农业大学</li>',
			'<li class="school-item">哈尔滨理工大学</li>',
			'<li class="school-item">佳木斯大学</li>',
			'<li class="school-item">齐齐哈尔大学</li>',
			'<li class="school-item">东北石油大学</li>',
			'<li class="school-item">黑龙江八一农垦大学</li>',
			'<li class="school-item">哈尔滨医科大学</li>',
			'<li class="school-item">黑龙江中医药大学</li>',
			'<li class="school-item">哈尔滨师范大学</li>',
			'<li class="school-item">哈尔滨商业大学</li>',
			'<li class="school-item">哈尔滨学院</li>',
			'<li class="school-item">黑龙江工程学院</li>',
			'<li class="school-item">黑龙江科技大学</li>',
			'<li class="school-item">牡丹江医学院</li>',
			'<li class="school-item">齐齐哈尔医学院</li>',
			'<li class="school-item">牡丹江师范学院</li>',
			'<li class="school-item">大庆师范学院</li>',
			'<li class="school-item">黑龙江财经学院</li>',
			'<li class="school-item">哈尔滨体育学院</li>',
			'<li class="school-item">黑龙江东方学院</li>',
			'<li class="school-item">绥化学院</li>',
			'<li class="school-item">黑河学院</li>',
			'<li class="school-item">哈尔滨金融学院</li>',
			'<li class="school-item">齐齐哈尔工程学院</li>',
			'<li class="school-item">哈尔滨华德学院</li>',
			'<li class="school-item">黑龙江外国语学院</li>',
			'<li class="school-item">哈尔滨剑桥学院</li>',
			'<li class="school-item">哈尔滨石油学院</li>',
			'<li class="school-item">哈尔滨广厦学院</li>',
			'<li class="school-item">哈尔滨远东理工学院</li>',
			'<li class="school-item">黑龙江工业学院</li>'
	].join('');
	$('.schools-wrapper').append(schools);
	/*
		日期插件
	*/
	$( "#birth" ).datepicker({
		changeMonth: true,
		changeYear: true
	});
	/*
		划过显示向右小箭头
	*/
	$('.main-content .ul-tags').delegate('li','mouseover',function(){
		$('.main-content .tag-sign').removeClass('glyphicon glyphicon-circle-arrow-right');
		$(this).find('span').addClass('glyphicon glyphicon-circle-arrow-right');
	});
	/*
		点击左侧显示相应选项卡
	*/
	$('.main-content .ul-tags').delegate('li','click',function(){
		var name = $(this).attr('id');
		$('.info .info-act').css('display','none');
		switch(name){
			case "tag-base-info":
				$('.right-block .title').html('基本信息');
				$('.info .basic-info').css('display','block');
				break;
			case "tag-message-info":
				$('.right-block .title').html('消息中心');
				$('.info .message-info').css('display','block');
				break;
			case "tag-friend-manage":
				$('.right-block .title').html('好友管理');
				$('.info .friend-manage').css('display','block');
				break;
			case "tag-self-activity":
				$('.right-block .title').html('我的活动');
				$('.info .my-activities').css('display','block');
				break;
			case "tag-change-password":
				$('.right-block .title').html('修改密码');
				$('.info .change-password').css('display','block');
				break;
			default:
				break;
		}
	});
	/*
		把右标签加在左侧小选项卡上
	*/
	$('.my-activities').delegate('.ul-activity li','click',function(){
		var li = $('.ul-activity li');
		var length = li.length;
		$('.activity').css('display','none');
		var oli = $(this)[0].id;
		$('.ul-activity li').removeClass('li-active');
		switch(oli){
			case "li-self":
				$('#li-self').addClass('li-active');
				$('.self-activity').css('display','block');
				break;
			case "li-join":
				$('#li-join').addClass('li-active');
				$('.join-activity').css('display','block');
				break;
			case "li-end":
				$('#li-end').addClass('li-active');
				$('.end-activity').css('display','block');
				break;
			default:
				break;
		}
	});
	/*
		修改密码的小眼睛，看到密码
	*/
	$('.change-password').delegate('.see-password','click',function(){
		if($(this).hasClass('glyphicon glyphicon-eye-close')) {
			$('.new-password').attr('type','text');
			$('.oldPassword').attr('type','text');
			$(this).removeClass('glyphicon glyphicon-eye-close').addClass('glyphicon glyphicon-eye-open');
		}else {
			$('.new-password').attr('type','password');
			$('.oldPassword').attr('type','password');
			$(this).removeClass('glyphicon glyphicon-eye-open').addClass('glyphicon glyphicon-eye-close');
		}
	});
	/*
		我不选择用文本校验插件，我觉得量太小，没有必要引入过多的文件。
		所以选择自己写
	*/
	$('.basic-info').delegate('.btn-save','click',function(){
		var nickname = $('.nickname').val(),
			birth = $('.birth').val(),
			email = $('.email').val(),
			school = $('.school').val(),
			reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
		if(nickname == '') {
			$('.span-error').html('');
			$('.nickname-error').html('昵称不能为空');
		}else if(birth == '') {
			$('.span-error').html('');
			$('.birth-error').html('生日不能为空');
		}else if(email == ''){
			$('.span-error').html('');
			$('.email-error').html('邮箱不能为空');
		}else if(!reg.test(email)) {
			$('.span-error').html('');
			$('.email-error').html('邮箱格式错误');
		}else if(school == '') {
			$('.span-error').html('');
			$('.school-error').html('学校不能为空');
		}else {
			$('.form-save-person-info').submit();
		}

	});
	//通过省份选择学校
	$('.province-wrapper').delegate('.province-item','click',function(err,result){
		$('.province-wrapper li').removeClass('li-active');
		$(this).addClass('li-active');
			var province = $(this).html();
		$.ajax({
			type:'post',  
		    url:'/changeSchool',  
		    data:{province:province},  
		    cache:false,  
		    dataType:'json',  
		    success:function(data){  
		    	var str = '';
		    	var schools = data.msg;
		    	for(var i=0;i<schools.length;i++) {
		    		str += '<li class="school-item">'+schools[i].schoolName+'</li>'
		    	}
		    	$('.schools-wrapper').html(str);
		    },  
		    error:function(){}  
		});
	});

	$('.schools-wrapper').delegate('li','click',function(){
		$('.school').val($(this).html());
		$('.btn-close').click();
	});

	//删除好友
	$('.friend-item').delegate('.del-btn','click',function(){
		var uid = $(this).attr('data-id');
		$.ajax({
			type:'post',  
		    url:'/users/del-friend',  
		    data:{user_id:uid},  
		    cache:false,  
		    dataType:'json',  
		    success:function(data){  
		    	var className = '.f'+uid;
		    	$(className).css('display','none');
		    },  
		    error:function(){}  
		});
	})
	//修改密码
	$('.change-password').delegate('.btn-pass-submit','click',function(){
		var oldPassword = $('.oldPassword').val(),
			newPassword = $('.new-password').val(),
			errO = $('.errOldPassword'),
			errN = $('.errNewPassword');

		if(oldPassword == '') {
			errO.html('原密码不能为空');
		}else if(newPassword == '') {
			errO.html('');
			errN.html('新密码不能为空');
		}else {
			errO.html('');
			errN.html('');
			$.ajax({
				type:'post',  
			    url:'/users/changePassword',  
			    data:{oldPassword:oldPassword,newPassword:newPassword},  
			    cache:false,  
			    dataType:'json',  
			    success:function(data){  
			    	if(data.msg == 'oldErr') {
			    		errO.html('原密码错误');
			    	}else {
			    		window.location = '/users/login';
			    	}
			    },  
			    error:function(){}  
			});
		}
	});
});