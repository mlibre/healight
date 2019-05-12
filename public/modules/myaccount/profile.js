"use strict";

$(window).bind("load", function()
{
	$(document).ready(function()
	{
		console.log(user);
		
		// modal
		setDefaultMmodal('در حال پردازش');		
		getClientInfo(user._id, function (result)
		{
			setChildBirthDates(result);
		});
	});
});

function setChildBirthDates(result)
{
	$('#ChildBirthDates').html('');	
	for (let index = 1; index <= result.ChildCount; index++)
	{
		var html = `<div class="col-md-3">
			<div class="form-group">
				<label class="bmd-label-floating">تاریخ تولد فرزند ${index}</label>
				<input name="${'ChildBirthDate'+index}" value =${user['ChildBirthDate'+index]} type="text" class="form-control">
			</div>
		</div>`;
		$('#ChildBirthDates').append($(html));
	}
}

function childeNoChanged(ev)
{	
	var co = $("#ChildCount").val();
	$('#ChildBirthDates').html('');
	for (let index = 1; index <= co; index++)
	{
		var html = `<div class="col-md-3">
			<div class="form-group">
				<label class="bmd-label-floating">تاریخ تولد فرزند ${index}</label>
				<input name="${'ChildBirthDate'+index}" value =${user['ChildBirthDate'+index] || 0} type="text" class="form-control">
			</div>
		</div>`;
		$('#ChildBirthDates').append($(html));
	}
}

function postProfileForm(ev)
{
	ev.preventDefault();
	var form = $(ev.target);
	$('#MModal').modal({show:true});
	$.ajax
	({
		url: form.attr('action'),
		type: 'POST',
		data: $(form).serialize(),
		success: function (res)
		{			
			if( res == "true" )
			{
				successMmodal("با موفقیت ثبت شد");
				setTimeout(function ()
				{
					window.location.href = "";
				} , 1500);
			}
			else if( res == "-2" )
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if(res == "-5")
			{
				failMmodal("شما مجوز ویرایش این درخواست را ندارید");
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function getClientInfo(userID, cbf)
{
	$.ajax
	({
		url: "/web_services/getClientProfile",
		type: 'POST',
		data:
		{
			userID: userID
		},
		success: function (res)
		{			
			if( res == "-2" )
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if(res == "-5")
			{
				failMmodal("شما مجوز ویرایش این درخواست را ندارید");
			}
			if( res )
			{
				cbf(res)
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}