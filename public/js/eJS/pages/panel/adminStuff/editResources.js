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
			setAddEditResFromResId($('#selectedResInput').val());
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
	setAddEditResFromResId($('#selectedResInput').val());

	ev.preventDefault();
	var listItem = $(ev.target);
	if(listItem.prop('tagName') == 'TD')
	{
		listItem = listItem.parent();
	}
	var listGroup = listItem.parent();
	listGroup.children().each(function()
	{
		$(this).removeClass('table-active');
	});
	listItem.addClass('table-active');
}