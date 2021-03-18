"use strict";

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
		// approveTab
		$('.nav-tabs a[href="#approveTab"]').on('show.bs.tab', function ()
		{
			$("html, body").animate({scrollTop: 0}, 1000);
			getNodeInf(getChosenNodeId(), function (res)
			{
				let artLang = getChosenNodeLang();
				artItem = res;
				$('#article_header_text').html(artItem.treeTitle[artLang]);
				$('#article_content').html(artItem.content[artLang]);
			});
			nodeUrl(getChosenNodeId(), getChosenNodeEnc(), function (url)
			{
				$('#article_header').attr("href", url);
			});
			ArtApproves(getChosenNodeId(), getChosenNodeEnc(), function (ArtApprvs)
			{
				$('#ApprvsUsers').empty();
				var html = '<ul class="list-group p-0">';
				ArtApprvs.forEach(function(el , index)
				{
					html+= '<li class="list-group-item list-group-item-action list-group-item-info flex-column';
					// if(index == 0){html+= 'active';} // rang baraye khude user ro avaz kone
					html += `">\
									<div class="d-flex w-100 justify-content- align-items-end">\
										<div id="nodId" class="">${index}</div>\
										<div class="Font18px mr-5 my-auto">${el.name} ${el.family}</div>\
										<div class="Font15px mr-auto my-auto">${el.email}</div>\
									</div>\
								</li>`;
				});
				html+= '</ul>'
				$('#ApprvsUsers').prepend(html);
			});
		});
		// remove disabled
		$('.nav-tabs .nav-item .disabled').removeClass('disabled');
		$("a[href='#chooseNodeTab']").tab('show');
	});
});

// Functions

function nodeUrl(nodeId, nodeEnc, cbf)
{
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.encyclopedia.nodeUrl%>',
		type: 'POST',
		data:
		{
			nodeId: nodeId,
			nodeEnc: nodeEnc
		},
		success: function (res)
		{
			if( res == '-1' )
			{
				// hadeaghal etelaat
			}
			else if( res == '<%=consV.codes.db.Error%>' )
			{
				//
			}
			else if( res )
			{
				// URLNameSuccess();
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in nodeUrl post request. message: %s" , err);
		}
	});
}

function ArtApproves(nodeId, nodeEnc, cbf)
{
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.encyclopedia.ArtApproves%>',
		type: 'POST',
		data:
		{
			nodeId: nodeId,
			nodeEnc: nodeEnc
		},
		success: function (res)
		{
			if( res == "<%=consV.codes.lackOfInformation%>" )
			{
				// hadeaghal etelaat
			}
			else if( res == '<%=consV.codes.db.Error%>' )
			{
				//
			}
			else if( res )
			{
				// URLNameSuccess();
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in artivle approve post request. message: %s" , err);
		}
	});
}

function ARArt(nodeId, nodeEnc, AR, RAText)
{	
	$('#MModal').modal({show:true});
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.encyclopedia.approveArt%>',
		type: 'POST',
		data:
		{
			nodeId: nodeId,
			nodeEnc: nodeEnc,
			AR: AR,
			RAText: RAText
		},
		success: function (res)
		{
			if( res == "<%=consV.codes.db.Error%>" )
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if( res )
			{
				successMmodal("نظر شما ثبت شد");
				setTimeout(function ()
				{
					window.location.href = '';
				}, 1500);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in approve article post request. message: %s" , err);
		}
	});
}