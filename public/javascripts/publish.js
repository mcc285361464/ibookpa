$(function(){
	//点击提交按钮
	$('.btn-publish').click(function(){
		var theme = $('.input-theme').val();
		var address = $('.input-address').val();
		var remark = $('.remark').val();
		if(theme == '') {
			$('.theme-error').html('主题不能为空');
		}else if(address == '') {
			$('.address-error').html('主题不能为空');
		}else if(remark == '') {
			$('.remark-error').html('主题不能为空');
		}else {
			$('.form-publish').submit();
		}
	});	
	$('.school').delegate('.school-item','click',function(){
		$('.input-address').val($(this).html().trim());
		$('.btn-modal-close').click();
	});
});