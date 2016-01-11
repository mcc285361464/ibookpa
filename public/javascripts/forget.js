$(function(){
	$('.main-content-wrapper').delegate('.btn-submit','click',function(){
		var reg = /^1[34578]\d{9}/,
			regM = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
			username = $('.username').val(),
			email = $('.email').val();
		if(username == '' || email == '') {
			$('.span-err').html('用户名或邮箱没有填写');
		}else if(!reg.test(username)){
			$('.span-err').html('用户名应填写手机号码');
		}else if(!regM.test(email)){
			$('.span-err').html('邮箱格式错误');
		}else{
			$('.forget-form').submit();
		}
	});
});