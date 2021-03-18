"use strict";

// Functions

function getNodeInf(nodeId, cbf)
{
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.encyclopedia.nodeInf%>',
		type: 'POST',
		data:
		{
			nodeId: nodeId
		},
		success: function (res)
		{
			if( res == '-1' )
			{
				// hadeaghal etelaat
				// URLNameDanger();
			}
			else if( res )
			{
				// URLNameSuccess();
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in getNodeInf post request. message: %s" , err);
		}
	});
}
