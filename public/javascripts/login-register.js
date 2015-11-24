$(function(){
	/*
		点击小眼睛
	*/
	$('.password-eye').click(function(){
		if($(this).hasClass('glyphicon glyphicon-eye-close')) {
			$('.password').attr('type','text');
			$(this).removeClass('glyphicon glyphicon-eye-close').addClass('glyphicon glyphicon-eye-open');
		}else {
			$('.password').attr('type','password');
			$(this).removeClass('glyphicon glyphicon-eye-open').addClass('glyphicon glyphicon-eye-close');
		}
	});
	/*
		检查登陆信息
	*/
	$('.div-login').delegate('.btn-login','click',function(){
		if($('.input-username').val() == '' || $('.input-password').val() == '') {
			$('.login-error').html('用户名或密码没有填写');
			return false;
		}else {
			$('.form-login').submit();
		}
	});

	$('.div-login').delegate('.btn-register','click',function(){
		window.location = '/users/register';
	});
	/*
		检查注册信息
	*/
	$('.div-login').delegate('.btn-register-now','click',function(){
		var reg = /^1[34578]\d{9}/;
		var username = $('.input-username-r').val();
		if(username == '' || $('.input-password-r').val() == '') {
			$('.register-error').html('用户名或密码没有填写');
		}else if(!reg.test(username)){
			$('.register-error').html('用户名应填写手机号码');
		}else {
			$('.form-register').submit();
		}
	});

});