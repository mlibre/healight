"use strict";

$(document).ready(function()
{
	$('#dynamic_aside_container #tree li').hover(
		function ()
		{
			$(this).css('background-color' , 'rgb(237,237,237)');
		},
		function ()
		{
			var pbc = $(this).parent().css('background-color');
			$(this).css('background-color' , pbc);
		}
	);
	$('#dynamic_aside_container #tree li[data-n="parent"]').click(
		function ()
		{
			SidebarCollapse($(this));
		}
	);
	$('#sidebar_mobile #tree li[data-n="parent"]').click(
		function ()
		{
			mobileSidebarCollapse($(this));
		}
	);
});

function SidebarCollapse(item)
{
	let clicked_item = item;
	if( clicked_item.prop('tagName') == 'SPAN' )
	{
		clicked_item = clicked_item.parent();
	}	
	let next_item = clicked_item.next();
	if( next_item.prop('tagName') == 'UL' )
	{
		if(clicked_item.data("inbranch") != true)
		{
			clicked_item.toggleClass('beautiful_blue_1');			
			clicked_item.children('a').toggleClass('beautiful_blue_1');
			clicked_item.toggleClass('bgeeeeee');
		}
		clicked_item.children('span').toggleClass('fa-chevron-left');
		clicked_item.children('span').toggleClass('fa-chevron-down');
		next_item.toggleClass('bgeeeeee');
		next_item.animate({height:'toggle'} , 500);
	}
}

function closeAll()
{
	closeSN_mobile_navbar();
	closeSN();
}

/********************************** enc tree mobile sidbar **********************************/
function openSN_mobile_navbar()
{
	$('#overlay').show();
	$('#SNOpen_mobile_navbar').hide();
	$('#SNOpenB').hide();
	$('#sidebar_mobile').removeClass('slideOutRight');
	$('#sidebar_mobile').addClass('slideInRight');
	$('#sidebar_mobile').show();
}

function closeSN_mobile_navbar()
{
	$('#sidebar_mobile').removeClass('slideInRight');
	$('#sidebar_mobile').addClass('slideOutRight');
	setTimeout(function()
	{
		$('#sidebar_mobile').hide();
		$('#SNOpen_mobile_navbar').show();
		$('#SNOpenB').show();
	}, 1000);
	$('#overlay').hide();
}

function mobileSidebarCollapse(item)
{	
	let clicked_item = item;
	if( clicked_item.prop('tagName') == 'SPAN' )
	{
		clicked_item = clicked_item.parent();
	}	
	let next_item = clicked_item.next();
	if( next_item.prop('tagName') == 'UL' )
	{
		if(clicked_item.data("inbranch") != true)
		{
			clicked_item.toggleClass('whiteColor');			
			clicked_item.children('a').toggleClass('whiteColor');
			clicked_item.toggleClass('BG_custom_gray');
		}
		clicked_item.children('span').toggleClass('fa-chevron-left');
		clicked_item.children('span').toggleClass('fa-chevron-down');
		next_item.toggleClass('BG_custom_gray');
		next_item.animate({height:'toggle'} , 500);
	}
}
/********************************** enc tree mobile sidbar end **********************************/
