$(function(){
	$('.member-pic').mouseover(function(){
		$(this).attr('src','./imgs/xinlang.png');
	});
	$('.member-pic').mouseout(function(){
        $(this).attr('src','./imgs/member_'+$(this).attr('data-id')+'.png');
	});
});