$(function(){
	$( "#birth" ).datepicker({
		changeMonth: true,
		changeYear: true
	});
	$('.main-content .ul-tags').delegate('li','mouseover',function(){
		$('.main-content .tag-sign').removeClass('glyphicon glyphicon-circle-arrow-right');
		$(this).find('span').addClass('glyphicon glyphicon-circle-arrow-right');
	});
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
	$('.change-password').delegate('.see-password','click',function(){
		if($(this).hasClass('glyphicon glyphicon-eye-close')) {
			$('.new-password').attr('type','text');
			$(this).removeClass('glyphicon glyphicon-eye-close').addClass('glyphicon glyphicon-eye-open');
		}else {
			$('.new-password').attr('type','password');
			$(this).removeClass('glyphicon glyphicon-eye-open').addClass('glyphicon glyphicon-eye-close');
		}
	});

});