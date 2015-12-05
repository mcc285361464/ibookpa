$(function(){
	$('.user-picture').mouseover(function(){
		$(this).stop().animate({
			left:'85px',
			top:'35px',
		    height:'230px',
		    width:'230px'
		},'fast');
	});
	$('.user-picture').mouseout(function(){
		$(this).stop().animate({
			left:'100px',
			top:'50px',
		    height:'200px',
		    width:'200px'
		},'fast');
	});
	$('.btn-group').delegate('.personal-message-btn','click',function(){
		var user = $('#session_user').val();
		if(user != null && user != '' && user != undefined) {
			$('.personal-message').toggle();
		}else {
			window.location = '/users/login';
		}
	})

	$('.btn-group').delegate('.attentive','click',function(){
		var user = $('#session_user').val();
		if(user != null && user != '' && user != undefined) {

		}else {
			window.location = '/users/login';
		}
	})

	$('.personal-message').delegate('.btn-sub-per-mes','click',function(){
		var message = $('.personal-message-textarea').val();
		var user_id = $('#person_id').val();
		$.ajax({
			type:'post',  
			url:'/users/personal-message',  
		    data:{message:message,user_id:user_id},  
		    cache:false,  
		    dataType:'json',  
		    success:function(data){  
			    $('.btn-sub-per-mes').html('提交成功');
			    $('.btn-sub-per-mes').attr('disabled','true');
			    setTimeout(
			    	"$('.personal-message').hide();$('.btn-sub-per-mes').html('提交').removeAttr('disabled');$('.personal-message-textarea').val('')",
			    	2000
			    )
		    },  
		    error:function(){}  
		});
	});

	$('.btn-group').delegate('.attentive','click',function(){
		var user_id = $('#person_id').val(),
			url = null;
		if($(this).html().trim()=="关注") {
			url = "/users/add-friend";
		}else {
			url = "/users/del-friend";
		}
		$.ajax({
			type:'post',  
			url:url,  
		    data:{user_id:user_id},  
		    cache:false,  
		    dataType:'json',  
		    success:function(data){  
		    	if(data.msg == 'add') {
			    	$('.attentive').html('已关注');
		    	}else {
		    		$('.attentive').html('关注');
		    	}
		    },  
		    error:function(){}  
		});
		/*
		*/
	});
});