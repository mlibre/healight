"use strict";

// Functions

$(document).ready(function()
{
	setDefaultMmodal('در حال پردازش');
	configTransForm();
});

function configTransForm()
{
	var FormLang = $('#transTo').val();
	getLocale(FormLang, function (result)
	{
		$('#words').html('');
		Object.keys(result).forEach((element, index) => {
			$('#words').append($(`<div id="D${index}" class="form-group row">`));
			var inputF = jQuery(`<input name="F${index}" id="F${index}" class="form-control col mx-2" type="text">`);
			var inputT = jQuery(`<input name="T${index}" id="T${index}" class="form-control col mx-2" type="text">`);
			$(`#D${index}`).append(inputF);
			$(`#D${index}`).append(inputT);
			$(`#F${index}`).val(element);
			$(`#T${index}`).val(result[element]);
			$('#words').append($(`</div>`));
		});		
	});
}
function getLocale(lang, cbf)
{
	$.ajax
	({
		url: '/web_services/getLocalTrans',
		type: 'POST',
		data:
		{
			language: lang
		},
		success: function (res)
		{
			if( res == '-1' )
			{
				// console.log(res);
				
			}
			else if( res )
			{
				cbf(res)
				// URLNameSuccess();
				// console.log(res);
				
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in getNodeInf post request. message: %s" , err);
		}
	});
}

function setLocale(ev)
{
	var form = $(ev.target);
	$('#MModal').modal('show');
	ev.preventDefault();
	$.ajax
	({
		url: $(form).attr('action'),
		type: 'POST',
		data: $(form).serialize(),
		success: function (res)
		{
			if( res == '-1' )
			{
				successFail("مشکلی پیش آمده");
			}
			else if( res )
			{
				successMmodal("با موفقیت ثبت شد");				
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in getNodeInf post request. message: %s" , err);
		}
	});
}