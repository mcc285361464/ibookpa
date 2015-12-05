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


	$('.ul-user-option').delegate('.user-attention','click',function(){
		var user = $('#session_user').val();
		alert(user);
		if(user == '' || user == null || user == undefined) {
			window.location = '/users/login';
		}else {
			$.ajax({
				type:'post',  
			    //url:'/changeSchool',  
			    data:{},  
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
		}
	});

	$('.ul-user-option').delegate('.user-talk-about','click',function(){
		var aid = $(this).attr('data-id').trim();
		window.location = '/comment/'+aid;
	});

});


