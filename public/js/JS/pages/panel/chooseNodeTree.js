function createCNT(tree, artLang)
{
	let rootId = tree[0][0];
	let nodes = tree[1];
	let max_depth = 6;
	let html;
	$('#nodeTree').empty();

	function resursion(curNodeId, depth)
	{
		var ul_opened = false;
		if(depth == 0)
		{
			// nothing :!
		}
		else if(nodes[curNodeId].list.length == 0)
		{
			html+= `<li data-nodeId="${nodes[curNodeId].data._id}">`;
			html+= choosePartHtml(nodes, curNodeId, artLang);
			html+= '</li>';
		}
		else if(depth == max_depth - 1)
		{
			html+= `<li data-nodeId="${nodes[curNodeId].data._id}" class="cursorPointer" onmouseover="hover_on_item($(this));" onmouseleave="leave_item($(this))" \
				    onclick="CNTmaxDepthNodeClicked(event,'${nodes[curNodeId].data._id}')">`;
			html+= choosePartHtml(nodes, curNodeId, artLang);
			html+= '<span id="chevron" class="fa fa-chevron-left"></span>\
					  <span style="margin-top: 9px; margin-left: 0.5px; float: left; font-size: 7px; color: rgba(40,40,40,0.8);" class="fa fa-circle"></span>';
			html+= '</li>';
		}
		else
		{
			ul_opened = true;
			html+= `<li data-nodeId="${nodes[curNodeId].data._id}" class="cursorPointer" onmouseover="hover_on_item($(this));" onmouseleave="leave_item($(this))" onclick="collapse(event);">`;
			html+= choosePartHtml(nodes, curNodeId, artLang);
			html+= '<span id="chevron" class="fa fa-chevron-left"></span>';
			html+= '</li>\
			<ul style="display: none">';
		}
		nodes[curNodeId].list.forEach(function(child)
		{
			if(depth < max_depth - 1)
			{
				resursion(child , depth + 1);
			}
		});
		if(ul_opened == true)
		{
			html+= '</ul>';
		}
	}
	html=
	`<!-- PanEncTree Start -->\
	<section class="treeHeader mr-4">\
		<div data-nodeId="${nodes[rootId].data._id}">`;
			html+= choosePartHtml(nodes, rootId, artLang);
html+='</div>\
	</section>\
	<section class="Tree">\
	<ul>';
	resursion(rootId, 0);
	html+= '</ul>\
	</section>';

	$('#nodeTree').prepend(html);
}

function choosePartHtml(nodes, id, artLang)
{
	let st=
	`<span class="choosePart px-2" onclick="nodeChoosed(event);">\
		<span class="fa-stack fa-lg checkButton">\
			<span class="fa fa-square fa-stack-2x"></span>\
			<span class="fa fa-stack-1x fa-circle"></span>\
		</span>\
		<span style="vertical-align: middle" class="mr-2 mt-1">${nodes[id].data.treeTitle[artLang]}</span>`;		
		if(nodes[id].data.DI_i_am_owner == true)
		{
 st+='<span class="fa fa-user onwer mr-2"></span>';
		}
st+='</span>';
	return st;
}

function createchooseNodeTree(CNTNodeId, CNTDepth)
{
	var artLang = $('#chooseNodeLang').val();
	var enc = $('#chooseNodeEnc').val();

	encTree(enc , CNTNodeId, CNTDepth, function (res)
	{
		createCNT(res , artLang);
	});
}

function CNTmaxDepthNodeClicked(ev, nodeId)
{
	createchooseNodeTree(nodeId, 6);
}

function chooseNodeEncChenged()
{
	createchooseNodeTree("root", 6);
}

function chooseNodeLangChenged()
{
	createchooseNodeTree("root", 6);
}

function nodeChoosed(ev)
{
   var el = $(ev.target);
	var elParent = $(el).parent();
	if(elParent.prop('tagName') == 'SPAN')
	{
		elParent = elParent.parent();
	}
	if(elParent.prop('tagName') == 'SPAN')
	{
		elParent = elParent.parent();
	}

	$('.checkButton').removeClass('selected');
   $('.checkButton .selected').removeClass('selected');
	$(".checkButton .fa-check").addClass('fa-circle');
   $('.checkButton .fa-check').removeClass('fa-check');

	$(elParent).find(".checkButton").addClass('selected');
	$(elParent).find(".checkButton .fa-square").addClass('selected');
	$(elParent).find(".checkButton .fa-circle").addClass('fa-check');
	$(elParent).find(".checkButton .fa-check").removeClass('fa-circle');

   $('#selectedNodeInput').val( $(elParent).attr('data-nodeId') );
}

function getChosenNodeId()
{
	return $('#selectedNodeInput').val();
}
function getChosenNodeEnc()
{
	return $('#chooseNodeEnc').val();
}
function getChosenNodeLang()
{
	return $('#chooseNodeLang').val();
}

function setChosenNodeId(va)
{
	$('#selectedNodeInput').val(va);
}
function setChosenNodeEnc(va)
{
	return $('#chooseNodeEnc').val(va);
}
function setChosenNodeLang(va)
{
	return $('#chooseNodeLang').val(va);
}