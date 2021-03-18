"use strict";

// Events
$(window).bind("load", function()
{
	$(document).ready(function()
	{
		// modal
		setDefaultMmodal('در حال پردازش');

		// nonArtsList tab
		$('.nav-tabs a[href="#nonArtsList"]').on('show.bs.tab', function ()
		{
			nonArtsTelList(function (res)
			{
				nonArts = res;				
				createNonArtsTelList();
			});
		});

		// addNonArt tab
		$('.nav-tabs a[href="#addNonArt"]').on('show.bs.tab', function ()
		{
			createchooseNodeTree("root", 6);			
		});
		// remove disabled
		$('.nav-tabs .nav-item .disabled').removeClass('disabled');
		$("a[href='#nonArtsList']").tab('show');
	});
});

// Functions
function nonArtsTelList(cbf)
{
	$.ajax
	({
		url: '/' + lang + '/panel/adminStuff/WS/nonArtsTelList_WA',
		type: 'POST',
		success: function (res)
		{
			if( res == "-2" )
			{
				console.log('Something Wrong happended' + res);
			}
			else if( res )
			{
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in nonArtsTelList post request. message: %s" , err);
		}
	});
}
function nonArtTelDel(nodeId, cbf)
{
	$('#MModal').modal({show:true});	
	$.ajax
	({
		url: '/' + lang + '/panel/adminStuff/WS/nonArtTelDel_WA',
		type: 'POST',
		data:
		{
			nodeId: nodeId
		},
		success: function (res)
		{
			if( res == "-2" )
			{
				console.log('Something Wrong happended' + res);
			}
			else if( res )
			{
				successMmodal("مقاله ار لیست حذف شد");								
				cbf();
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in nonArtsTelList post request. message: %s" , err);
		}
	});
}
function nonArtTelAdd(nodeId, cbf)
{
	$('#MModal').modal({show:true});	
	$.ajax
	({
		url: '/' + lang + '/panel/adminStuff/WS/nonArtTelAdd_WA',
		type: 'POST',
		data:
		{
			nodeId: nodeId
		},
		success: function (res)
		{
			if( res == "-2" )
			{
				failMmodal("مشکلی پیش امد و احتمالا مراقبت شده!");
				cbf();				
			}
			else if( res )
			{
				successMmodal("مقاله ار به لیست اضافه شد");								
				cbf();
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in nonArtsTelList post request. message: %s" , err);
		}
	});
}
function createNonArtsTelList()
{
	var listLang = $('#nonArtsListLang').val();
			
	$('#nonArtsListDiv').empty();
	var html = '<ul class="list-group p-0">';	
	nonArts.list.forEach(function(el , index)
	{
		html+= '<li class="list-group-item list-group-item-action flex-column ';
		if(index == 0){html+= 'active';}
		html += `\
		">\
			<div class="d-flex w-100 justify-content- align-items-end">\
				<div id="nodId" class="">${index}</div>\
				<div class="Font18px mr-5 my-auto">${nonArts[el].treeTitle[listLang]}</div>\
				<a href="${nonArts[el].url}" class="Font18px mr-auto my-auto">لینک به مقاله</a>\
			</div>\
		</li>`;
	});
	html+= '</ul>';
	$('#nonArtsListDiv').prepend(html);
}

// Graphical. view
function nonArtsLisClicked(ev)
{
	var listItem = $(ev.target);
	if(listItem.prop('tagName') == 'DIV')
	{
		listItem = listItem.parent();
	}
	if(listItem.prop('tagName') == 'DIV')
	{
		listItem = listItem.parent();
	}
	var listGroup = listItem.parent();
	listGroup.children().each(function()
	{
		$(this).removeClass('active');
	});
	listItem.addClass('active');
	return false;
}