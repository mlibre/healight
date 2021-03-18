"use strict";

// Events
$(window).bind("load", function()
{
	$(document).ready(function()
	{
		// modal
		setDefaultMmodal('در حال پردازش');

		// drafts tab
		$('.nav-tabs a[href="#drafts"]').on('show.bs.tab', function ()
		{
			$("html, body").animate({scrollTop: 0}, 1000);
			createDraftList();
		});

		// edit tab
		$('.nav-tabs a[href="#edit"]').on('show.bs.tab', function ()
		{
			$("html, body").animate({scrollTop: 0}, 1000);
			var artItem = draftsJs[$('#draftList .active #nodId').html()];
			var artLang = $('#formArtLang').val();
			
			setCreEdiArtFromData(artItem);
		});
		// place tab
		$('.nav-tabs a[href="#place"]').on('show.bs.tab', function ()
		{
			$("html, body").animate({scrollTop: 0}, 1000);
			URLNameWarning();
			var artItem = draftsJs[$('#draftList .active #nodId').html()];
			var artLang = $('#placeFormlang').val();
			
			$('#URLName').val(artItem.URLName);
			$('#placeArtnodeId').val(artItem._id);

			encTree( $('#placeArtEnc').val(), "root", 4, function (res)
			{
				createPlaceNodeTree(res, 'EncTree', artLang, artItem);			
			});
		});
		// remove disabled
		$('.nav-tabs .nav-item .disabled').removeClass('disabled');
		$("a[href='#drafts']").tab('show');
	});
});

// Functions

function createDraftList()
{
	var artLang = $('#draftsLang').val();
			
	$('#draftList').empty();
	var html = '<ul class="list-group p-0">';
	draftsJs.forEach(function(el , index)
	{
		html+= '<a href="#" class="list-group-item list-group-item-action flex-column ';
		if(index == 0){html+= 'active';}
		html += `\
		">\
			<div class="d-flex w-100 justify-content- align-items-end">\
				<div id="nodId" class="">${index}</div>\
				<div id="draftTitle" class="Font18px my-auto">${el.treeTitle[artLang]}</div>\
				<time class="timeago Font15px my-auto" datetime="${new Date(el.date).toISOString()}">${new Date(el.date).toISOString()}</time>\
			</div>\
		</a>`;
	});
	html+= '</ul>';
	$('#draftList').prepend(html);
	// time ago
	$("time.timeago").timeago();
}

function maxDepthNodeClicked(ev, nodeId)
{	
	var artItem = draftsJs[$('#draftList .active #nodId').html()];
	var artLang = $('#placeFormlang').val();

	encTree( $('#placeArtEnc').val(), nodeId, 4, function (res)
	{
		createPlaceNodeTree(res, 'EncTree', artLang, artItem);			
	});
}

function langChanged()
{
	var artItem = draftsJs[$('#draftList .active #nodId').html()];
	var artLang = $('#formArtLang').val();

	setCreEdiArtFromData(artItem);
}

function placeFormlangChanged()
{
	var item = draftsJs[$('#draftList .active #nodId').html()];
	var artLang = $('#placeFormlang').val();
	
	$('#URLName').val(item.URLName);
	
	encTree( $('#placeArtEnc').val() , "root", 4, function (res)
	{
		createPlaceNodeTree(res, 'EncTree', artLang, item);			
	});
}
function placeFormEncChanged()
{
	$('#nodePlaceInput').val("");
	placeFormlangChanged();
}

// Graphical. view
function draftListClicked(ev)
{
	ev.preventDefault();
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