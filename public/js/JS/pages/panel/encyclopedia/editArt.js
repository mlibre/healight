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
		// edit tab
		$('.nav-tabs a[href="#edit"]').on('show.bs.tab', function ()
		{
			$("html, body").animate({scrollTop: 0}, 1000);
			$('#formArtLang').val( $('#chooseNodeLang').val() );			
			getNodeInf(getChosenNodeId(), function (res)
			{				
				artItem = res;				
				setCreEdiArtFromData(artItem);
			});
		});
		// place tab
		$('.nav-tabs a[href="#place"]').on('show.bs.tab', function ()
		{
			$("html, body").animate({scrollTop: 0}, 1000);
			URLNameWarning();
			$('#placeFormlang').val( $('#chooseNodeLang').val() );

			getNodeInf(getChosenNodeId(), function (res)
			{
				artItem = res;

				var artLang = $('#placeFormlang').val();

				$('#placeArtnodeId').val(artItem._id);
				$('#URLName').val(artItem.URLName);

				encTree( $('#placeArtEnc').val() , "root", 4, function (res)
				{
					createPlaceNodeTree(res, 'EncTree', artLang, artItem);
				});
			});
		});
		// remove disabled
		$('.nav-tabs .nav-item .disabled').removeClass('disabled');
		$("a[href='#chooseNodeTab']").tab('show');
	});
});

// Functions

function maxDepthNodeClicked(ev, nodeId)
{
	var artLang = $('#placeFormlang').val();

	encTree( $('#placeArtEnc').val(), nodeId, 4, function (res)
	{
		createPlaceNodeTree(res, 'EncTree', artLang, artItem);
	});
}

function placeFormlangChanged()
{
	var artLang = $('#placeFormlang').val();
	
	$('#URLName').val(artItem.URLName);
	
	encTree( $('#placeArtEnc').val(), "root", 4, function (res)
	{
		createPlaceNodeTree(res, 'EncTree', artLang, artItem);			
	});
}
function placeFormEncChanged()
{
	$('#nodePlaceInput').val("");
	placeFormlangChanged();
}