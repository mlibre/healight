"use strict";

function search_bar()
{
	$(document).ready(function()
	{
		$('#search_bar input').focus(function()
		{
		});
		$('#search_bar input').focusout(function()
		{
		});
	});
}

function searchInputVal()
{
	return document.getElementById('searchInput').value;
}
/********************************** enc tree mobile sidbar **********************************/
function openSN()
{
	$('#overlay').show();
	$('#SNOpenB').hide();
	if($('#SNOpen_mobile_navbar').length != 0)
	{
		$('#SNOpen_mobile_navbar').hide();
	}
	$('#sidebar_navbar').removeClass('slideOutRight');
	$('#sidebar_navbar').addClass('slideInRight');
	$('#sidebar_navbar').show();
}

function closeSN()
{
	$('#sidebar_navbar').removeClass('slideInRight');
	$('#sidebar_navbar').addClass('slideOutRight');
	setTimeout(function()
	{
		$('#sidebar_navbar').hide();
		$('#SNOpenB').show();
		if($('#SNOpen_mobile_navbar').length != 0)
		{
			$('#SNOpen_mobile_navbar').show();
		}
	}, 1000);
	$('#overlay').hide();
}

function navbarSidebarCollapse()
{	
	$('#sidebar_navbar .collapse').on('show.bs.collapse',
	function()
	{		
    	var parent = $(this).parent(); // li
		parent.addClass('customBG');

      var item = parent.find('a #chevron_sidebar');
		item.toggleClass('fa-chevron-left');
		item.toggleClass('fa-chevron-down');
	});
	$('#sidebar_navbar .collapse').on('hidden.bs.collapse',
	function()
	{		
    	var parent = $(this).parent(); // li
		parent.removeClass('customBG');

      var item = parent.find('a #chevron_sidebar');
		item.toggleClass('fa-chevron-down');
		item.toggleClass('fa-chevron-left');
	});
}
/********************************** enc tree mobile sidbar end **********************************/
function googleSearch()
{
	window.open('/' + lang + '<%= consV.pages.searchRes%>?q='+ searchInputVal());
}

function ToPersian(string)
{	
    var etp = ['۰' , '۱' , '۲' , '۳' , '۴' , '۵' , '۶' , '۷' , '۸' , '۹'];
    var sr = "";
    var st = string.toString();
    for(var i = 0 ; i < st.length ; i++)
    {
        sr += etp[ parseInt(st[i]) ];
    }
    return sr;
}

$(document).ready(function()
{
	navbarSidebarCollapse();
});