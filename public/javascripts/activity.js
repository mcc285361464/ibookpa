$(function(){
	$('.ul-user-option').delegate('.personal-mes','click',function(){
		var user = $('#session_user').val();
		if(user == null || user == '' || user == undefined) {
			window.location = '/users/login';
		}
	});
	$('#personal-message').delegate('.sub-message-btn','click',function(){
		var message = $('.textarea-personal').val();
		var user_id = $('#person_id').val();
		$.ajax({
			type:'post',  
			url:'/users/personal-message',  
		    data:{message:message,user_id:user_id},  
		    cache:false,  
		    dataType:'json',  
		    success:function(data){  
		    	$('.close-btn').click();
		    },  
		    error:function(){}  
		});
	});
	$('.ul-user-option').delegate('.attentive','click',function(){
		var user = $('#session_user').val();
		if(user == null || user == '' || user == undefined) {
			window.location = '/users/login';
		}
		var user_id = $('#person_id').val();
		var url = null;
		if($('.span-attentive').html().trim() == '关注') {
			url = '/users/add-friend';
		}else {
			url = '/users/del-friend';
		}
		$.ajax({
			type:'post',  
			url:url,  
		    data:{user_id:user_id},  
		    cache:false,  
		    dataType:'json',  
		    success:function(data){  
		    	if(data.msg == 'add') {
		    		$('.span-attentive').html('已关注');
		    	}else {
		    		$('.span-attentive').html('关注');
		    	}
		    },  
		    error:function(){}  
		});
	});

	$('.ul-user-option').delegate('#li-apply-activity','click',function(){
		var user = $('#session_user').val();
		if(user == null || user == '' || user == undefined) {
			window.location = '/users/login';
		}
		var user_id = $('#person_id').val(),
			url = null,
			aId = $('#aId').val(),
			applyCount = $('#applyCount').val();
		if($('.span-apply').html().trim() == '报名') {
			url = '/apply-act';
		}else {
			url = '/cancel-act';
		}
		var act_sex = $('#act_sex').val().trim(),
			user_sex = $('#user_sex').val().trim();
		if(act_sex == '不限' || act_sex == user_sex) {
			$.ajax({
				type:'post',  
				url:url,  
			    data:{user_id:user_id,aId:aId,applyCount:applyCount},  
			    cache:false,  
			    dataType:'json',  
			    success:function(data){  
			    	if(data.msg == 'add') {
			    		$('.span-apply').html('已报名');
			    		var num = $('.i-applyCount').text();
			    		num ++
			    		$('.i-applyCount').html(num);
			    	}else {
			    		$('.span-apply').html('报名');
			    		var num = $('.i-applyCount').text();
			    		if(num > 0) {
			    			num --
			    		}
			    		$('.i-applyCount').html(num);
			    	}
			    },  
			    error:function(){}  
			});
		}else if(user != '' && act_sex != user_sex && act_sex != '不限') {
			alert('与活动性别要求不符');
		}
	});


});