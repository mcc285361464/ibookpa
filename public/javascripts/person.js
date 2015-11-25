$(function(){
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
			$(this).removeClass('glyphicon glyphicon-eye-close').addClass('glyphicon glyphicon-eye-open');
		}else {
			$('.new-password').attr('type','password');
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

});