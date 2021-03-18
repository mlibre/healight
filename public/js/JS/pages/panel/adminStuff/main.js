"use strict";

function CreateEditRes(ev, cbf)
{
	$('#MModal').modal('show');
	ev.preventDefault();
	CreateEditRes.MessageCreated = CreateEditRes.MessageCreated  || "منبع ثبت شد";

	let form = ev.target;
	let formData = new FormData( $(form)[0] );

	$.ajax
	({
		url: $(form).attr('action'),
		type: 'POST',
		enctype: 'multipart/form-data',
		processData: false,
		contentType: false,
		// cache: false,
		data: formData,
		success: function (res)
		{			
			if(res == "-2")
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if(res)
			{
				successMmodal(CreateEditRes.MessageCreated);
				$('#addResFormSubmit').text('ویرایش');
				CreateEditRes.MessageCreated = "ویرایش انجام شد";
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function DeleteRes(resId)
{	
	$('#MModal').modal('show');
	$.ajax
	({
		url: '/' + lang + "/panel/adminStuff/WS/delResources",
		type: 'POST',
		data: {resId: resId},
		success: function (res)
		{			
			if(res == "-2")
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if(res)
			{
				successMmodal("منبع حذف شد");
				setTimeout(function ()
				{
					window.location.href = '';
				}, 1500);
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function getResInf(resId, cbf)
{
	$.ajax
	({
		url: '/' + lang + '/panel/adminStuff/resInf',
		type: 'POST',
		data:
		{
			resId: resId
		},
		success: function (res)
		{
			if( res == "-6" )
			{
			}
			else if( res )
			{
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in getResInf post request. message: %s" , err);
		}
	});
}