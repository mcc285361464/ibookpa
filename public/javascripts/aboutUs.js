$(function(){
	$('.member-pic').mouseover(function(){
		$(this).attr('src','/images/xinlang.png');
	});
	$('.member-pic').mouseout(function(){
        $(this).attr('src','/images/member_'+$(this).attr('data-id')+'.png');
	});
});