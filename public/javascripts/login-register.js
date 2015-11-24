$(function(){
	$('.password-eye').click(function(){
		if($(this).hasClass('glyphicon glyphicon-eye-close')) {
			$('.password').attr('type','text');
			$(this).removeClass('glyphicon glyphicon-eye-close').addClass('glyphicon glyphicon-eye-open');
		}else {
			$('.password').attr('type','password');
			$(this).removeClass('glyphicon glyphicon-eye-open').addClass('glyphicon glyphicon-eye-close');
		}
	});
});