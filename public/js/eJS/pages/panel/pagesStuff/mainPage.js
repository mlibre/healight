"use strict";

// Events
$(window).bind("load", function()
{
	$(document).ready(function()
	{
		// modal
		setDefaultMmodal('در حال پردازش');

		// chooseNode tab
		$('.nav-tabs a[href="#todayArt"]').on('show.bs.tab', function ()
		{
			createchooseNodeTree("root", 6);
		});
		// show tab
		$("a[href='#todayArt']").tab('show');
	});
});

// Functions

function showArt(ev)
{
	getNodeInf(getChosenNodeId(), function (res)
	{
		let artLang = getChosenNodeLang();
		let artItem = res;
		$('#article_header_text').html(artItem.treeTitle[artLang]);
		$('#article_content').html(artItem.content[artLang]);
	});
	nodeUrl(getChosenNodeId(), getChosenNodeEnc(), function (url)
	{
		$('#article_header').attr("href", url);
	});
}

function pageArt(nodeId, nodeEnc, nodeLang, cbf)
{
	$('#MModal').modal({show:true});
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.pagesStuff.mainPage%>',
		type: 'POST',
		data:
		{
			nodeId: nodeId,
			nodeEnc: nodeEnc,
			nodeLang: nodeLang
		},
		success: function (res)
		{
			if( res == "<%=consV.codes.db.Error%>" )
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if( res )
			{
				successMmodal("تنظیم شد");
				setTimeout(function ()
				{
					window.location.href = '';
				}, 1500);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in pageArt post request. message: %s" , err);
		}
	});
}

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