"use strict";

function panSidebarMenuCollapse()
{
	$('nav .collapse').on('show.bs.collapse',
	function()
	{
    	var parent = $(this).parent(); // li
		parent.addClass('panBG');

        var item = parent.find('a #chevron_sidebar');
		item.toggleClass('fa-chevron-left');
		item.toggleClass('fa-chevron-down');
	});
	$('nav .collapse').on('hidden.bs.collapse',
	function()
	{		
    	var parent = $(this).parent(); // li
		parent.removeClass('panBG');

        var item = parent.find('a #chevron_sidebar');
		item.toggleClass('fa-chevron-down');
		item.toggleClass('fa-chevron-left');
	});
}
$(document).ready(function()
{
	panSidebarMenuCollapse();
});