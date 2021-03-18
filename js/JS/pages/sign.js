"use strict";

function sign_In_user(ev, lang)
{
	var form = $(ev.target);
	ev.preventDefault();
	$('#MModal').modal({show:true});
	var pass = form.find('#password').val();	
	var hashed_pass = new Hashes.SHA256().hex(pass);
	form.find('#password').val(hashed_pass);
	var data = form.serialize();
	form.find('#password').val(pass);

	$.post( form.attr('action'), data, (res) =>
	{
		if( res == "-6" )
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
		else if( res == "-3" )
		{
			failMmodal("متاسفانه کاربری با این ایمیل و پسورد پیدا نشد");
		}
		else if(res == "-2")
		{
			failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
		}
		else if( res )
		{
			successMmodal("خوش آمدید");
			setTimeout(function ()
			{
				window.location.href = "/"+lang;
			} , 1500);
		}
	})
	.fail( (res) => 
	{
		failMmodal("احتمال خطا از مرورگر شما");
	});
}

function signUp_modal(ev, lang)
{
	var form = $(ev.target);
	ev.preventDefault();
	$('#MModal').modal({show:true});
	var pass = form.find('#password').val();
	var hashed_pass = new Hashes.SHA256().hex(pass);
	form.find('#password').val(hashed_pass);
	var data = form.serialize();
	form.find('#password').val(pass);

	$.ajax
	({
		url: form.attr('action'),
		type: 'POST',
		data: data,
		success: function (res)
		{
			if( res == '1' )
			{
				successMmodal("با موفقیت ثبت نام شدید");
				setTimeout(function ()
				{
					window.location.href = "/"+lang;
				} , 1500);
			}
			else if( res == '2' )
			{
				failMmodal("ایمیل وارد شده قبلا ثبت شده است، از ایمیل دیگری استفاده کنید");
			}
			else
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function sign_out()
{
	$.ajax
	({
		url: '/sign/sign_out',
		type: 'POST',
		success: function (res)
		{
			if( res == true )
			{
				location.reload(true);
			}
			else if(res == false)
			{
				location.reload(true);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in sign out post request. message: %s" , err);
		}
	});
}