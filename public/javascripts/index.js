$(function(){	
	//"发布活动"开场动画
	var btn_pub = $('.pub-act');
	btn_pub.animate({
		'filter':'alpha(opacity=80)',
		'opacity':'0.8'
	},500);

	btn_pub.animate({
		'font-size':'80px'
	},500);

	btn_pub.animate({
		'font-size':'45px'
	},500);

	btn_pub.click(function(){
		window.location="/publish";
	});

	//评论
	$('.ul-user-option').delegate('.user-talk-about','click',function(){
		var aid = $(this).attr('data-id').trim();
		window.location = '/comment/'+aid;
	});

	//报名
	$('.ul-user-option').delegate('.user-apply','click',function(){
		var user = $('#session_user').val(),
			user_id = null,
			apply = $(this).find('.apply-state'),
			user_sex = $('#user_sex').val(),
			act_sex = apply.attr('data-sex');

		if(apply.html().trim() == '报名') {
			url = '/apply-act';
		}else {
			url = '/cancel-act';
		}
		var aId = $(this).attr('data-act-id'),
			applyCount = $(this).attr('data-id'),
			user_id = $('.user-id'+aId).val();
		if(act_sex.trim() == '不限' || act_sex.trim() == user_sex.trim()) {
			$.ajax({
				type:'post',  
				url:url,  
	 			data:{user_id:user_id,aId:aId,applyCount:applyCount},  
			    cache:false,  
			    dataType:'json',  
			    success:function(data){  
			    	var className = '#apply-state'+aId,
			    		classNameCount = '.i-applyCount'+aId;
			    	if(data.msg == 'add') {
			    		var num = $(classNameCount).text();
			    		num ++;
			    		$(classNameCount).html(num);
			    		$(className).html('已报名');
			    	}else {
			    		var num = $(classNameCount).text();
			    		if(num>0) {
			    			num --;
			    		}
			    		$(classNameCount).html(num);
			    		$(className).html('报名');
			    	}
			    },  
			    error:function(){}  
			});
		}else if(user != '' && act_sex.trim() != user_sex.trim() && act_sex.trim() != '不限'){
			alert('与活动性别要求不符');
		}
	});
});


