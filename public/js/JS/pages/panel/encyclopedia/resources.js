"use strict";

// Variables
var ArtRes;

// Events
$(window).bind("load", function()
{
	$(document).ready(function()
	{
		// modal
		setDefaultMmodal('در حال پردازش');

		// chooseNode tab
		$('.nav-tabs a[href="#chooseNodeTab"]').on('show.bs.tab', function ()
		{
			createchooseNodeTree("root", 6);
		});
		// resourcesTab
		$('.nav-tabs a[href="#resourcesTab"]').on('show.bs.tab', function ()
		{
			ArtResWithAddInfo(getChosenNodeId(), getChosenNodeEnc(), function (res)
			{
				ArtRes = res;				
				createArtRes(ArtRes, '#ArtResources');
			});
		});
		// remove disabled
		$('.nav-tabs .nav-item .disabled').removeClass('disabled');
		$("a[href='#chooseNodeTab']").tab('show');
	});
});

// Functions

function createArtRes(res, elId)
{
	$(elId).empty();
	
	for(var key in res[0])
	{
		var html=
		`<div class="row mt-3">
			<div class="col-md-3">
				<div class="card BoxShadow4">
					<img class="card-img-top img-fluid" src="${'/resources/' + key + '/' + res[2][key].image}">
					<div class="card-body">
						<h5 class="card-title text-center">${res[2][key].name[lang]} ${res[2][key].family[lang]}</h5>
						<p class="card-text">
							${res[2][key].content[lang]}
						</p>
					</div>
					<div class="card-footer if(${res[0][key].approving_state} == '0'){beautiful_background_color}"></div>
				</div>
			</div>
			<div class="col">
				<table class="table table-hover table-striped">
					<tbody>`;
					for(var k in res[0][key].content_user)
					{
						html+=
						`<tr>
							<td scope="row" class="text-center verAliMid noBorder rounded-right">${res[1][k].name}</td>
							<td class="text-center verAliMid noBorder">${res[1][k].family}</td>
							<td class="text-center verAliMid noBorder">${res[1][k].email}</td>`;
							if(k == res[3].user_id)
							{
								html+=
								`<td class="text-center verAliMid noBorder">
									<input data-resid="${key}" class="form-control" type="text" value="${res[0][key].content_user[k]}">
								</td>
								<td class="text-center verAliMid noBorder rounded-left"><i class="fa fa-trash verAliMid cursorPointer Font27px" onclick="deleteResource(event)" aria-hidden="true"></i></td>`;
							}
							else
							{
								html+=
								`<td class="text-center verAliMid noBorder rounded-left" colspan="2">${res[0][key].content_user[k]}</td>`;
							}
						html+=
						'</tr>';
					}
			html+='</tbody>\
				</table>\
			</div>\
		</div>';
		$(elId).prepend(html);
	}
}

function ArtResWithAddInfo(nodeId, nodeEnc, cbf)
{
	$.ajax
	({
		url: '/' + lang + '/panel/encyclopedia/ArtResources',
		type: 'POST',
		data:
		{
			nodeId: nodeId,
			nodeEnc: nodeEnc
		},
		success: function (res)
		{
			if( res == '-2' )
			{
				//
			}
			else if( res )
			{
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in ArtResWithAddInfo post request. message: %s" , err);
		}
	});
}

function addResource(ev)
{
   let el = $(ev.target);
	el = el.closest('tr');
	var resId = el.find('th').html();

	ArtRes[0][resId] = ArtRes[0][resId] || {};
	ArtRes[0][resId].content_user = ArtRes[0][resId].content_user || {};
	ArtRes[0][resId].content_user[ArtRes[3].user_id] = ArtRes[0][resId].content_user[ArtRes[3].user_id] || "";
	createArtRes(ArtRes, '#ArtResources');
}

function deleteResource(ev)
{
	$('#MModal').modal({show:true});
	let el = $(ev.target);
	el = el.closest('tr');	
	var resId = el.find('input').data('resid');
	
	$.ajax
	({
		url: '/' + lang + '/panel/encyclopedia/delResource',
		type: 'POST',
		data:
		{
			resId: resId,
			nodeId: getChosenNodeId(),
			nodeEnc: getChosenNodeEnc()
		},
		success: function (res)
		{
			if( res == '-2' )
			{
				failMmodal('خطای سیستمی رخ داد، در اسرع وقت درست میشود');
			}
			else if( res )
			{
				successMmodal('حذف شد');
				delete ArtRes[0][resId].content_user[ArtRes[3].user_id];
				if(jQuery.isEmptyObject(ArtRes[0][resId].content_user) == true)
				{
					delete ArtRes[0][resId].content_user;
				}
				if(jQuery.isEmptyObject(ArtRes[0][resId]) == true)
				{
					delete ArtRes[0][resId];
				}
				createArtRes(ArtRes, '#ArtResources');
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in deleteResource post request. message: %s" , err);
		}
	});
}

function post_art_resources(ev)
{	
	$('#MModal').modal({show:true});	
	for(var key in ArtRes[0])
	{
		if(typeof $(`input[data-resid="${key}"]`).val() != 'undefined')
		{
			ArtRes[0][key].content_user[ArtRes[3].user_id] = $(`input[data-resid="${key}"]`).val();
		}
	}
	var resData = 
	{
		res: JSON.stringify(ArtRes[0]),
		nodeId: getChosenNodeId(),
		nodeEnc: getChosenNodeEnc()
	}
	$.ajax
	({
		url: '/' + lang + '/panel/encyclopedia/resources',
		type: 'POST',
		data: resData,
		success: function (res)
		{			
			if( res == '-2' )
			{
				failMmodal('خطای سیستمی رخ داد، در اسرع وقت درست میشود');
			}
			else if(res == "-5")
			{
				failMmodal("شما مجوز ویرایش منابع این مطلب را ندارید");
			}
			else if( res )
			{
				successMmodal('منابع ثبت شد');
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in post_art_resources post request. message: %s" , err);
		}
	});
}