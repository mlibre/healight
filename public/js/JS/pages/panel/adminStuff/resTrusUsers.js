"use strict";

// Events
$(window).bind("load", function()
{
	$(document).ready(function()
	{
		// modal
		setDefaultMmodal('در حال پردازش');

		// resource form init
		resFormInit();

		// chooseRes tab
		$('.nav-tabs a[href="#chooseResTab"]').on('show.bs.tab', function ()
		{
		});
		// edit tab
		$('.nav-tabs a[href="#edit"]').on('show.bs.tab', function ()
		{
			setAddEditResFromResId($('#selectedResInput').val())
			
			getResInf(getAddEditResFromResId(), function (res)
			{				
				resItem = res;				
				setAddEditResFromData(resItem);
			});
		});
		// remove disabled
		$('.nav-tabs .nav-item .disabled').removeClass('disabled');
		$("a[href='#chooseResTab']").tab('show');
	});
});

function chooseResource(ev)
{
	let el = $(ev.target);
	el = el.closest('tr');
	let resId = el.find('th').html();

   $('#selectedResInput').val( resId );
	$("a[href='#edit']").tab('show');
}