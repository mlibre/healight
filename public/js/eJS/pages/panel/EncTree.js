"use strict";

// Functions
function encTree(enc, nodeId, depth, cbf)
{
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.EncTree%>',
		type: 'POST',
		data:
		{
			enc: enc,
			nodeId: nodeId,
			depth: depth
		},
		success: function (res)
		{
			if( res == '-1' )
			{
				console.log('Something Wrong happended');
			}
			else if( res )
			{
				cbf(res);
			}
			else
			{
				console.log('Something Wrong happended');
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in EncTree post request. message: %s" , err);
		}
	});
}

// Graphical
function collapse(ev)
{
	let clicked_item = $(ev.target);
	
	let next_item = clicked_item.next();
	if( next_item.prop('tagName') == 'UL' )
	{
		clicked_item.toggleClass('beautiful_blue_1');
		clicked_item.toggleClass('bgeeeeee');
		clicked_item.find('#chevron').toggleClass('fa-chevron-left');
		clicked_item.find('#chevron').toggleClass('fa-chevron-down');
		next_item.toggleClass('bgeeeeee');
		next_item.animate({height:'toggle'} , 500);
	}
}

function hover_on_item(item)
{
	item.css('background-color' , '#eeeeee');
}

function leave_item(item)
{
	var pbc = item.parent().css('background-color');
	item.css('background-color' , pbc);
}
