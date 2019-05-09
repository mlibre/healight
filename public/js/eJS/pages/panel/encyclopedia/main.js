function CreateArt(ev, cbf)
{
	var form = ev.target;
	CreateArt.artCretedMessage = CreateArt.artCretedMessage  || "مقاله ثبت شد";
	ev.preventDefault();
	$('#MModal').modal('show');
	tinyMCE.triggerSave();
	$.ajax
	({
		url: $(form).attr('action'),
		type: 'POST',
		data: $(form).serialize(),
		success: function (res)
		{
			if( res == "<%=consV.codes.lackOfInformation%>" )
			{
				failMmodal("اطلاعات حداقل پر نشده است");
			}
			else if(res)
			{
				successMmodal(CreateArt.artCretedMessage);
				$('#CreEditArtSubmit').text('ویرایش');
				CreateArt.artCretedMessage = "ویرایش انجام شد";
				cbf(res);
			}
			else
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function UpdateArt(ev, cbf)
{
	var form = ev.target;
	ev.preventDefault();
	$('#MModal').modal({show:true});
	tinyMCE.triggerSave();

	$.ajax
	({
		url: $(form).attr('action'),
		type: 'POST',
		data: $(form).serialize(),
		success: function (res)
		{
			if( res == "<%=consV.codes.lackOfInformation%>" )
			{
				failMmodal("اطلاعات حداقل پر نشده است");
			}
			else if(res == "<%=consV.codes.notAllowed%>")
			{
				failMmodal("شما مجوز ویرایش این مقاله را ندارید");
			}
			else if(res == "<%=consV.codes.db.Error%>")
			{
				failMmodal("خطای داخلی سیستم");
			}
			else if( res )
			{
				cbf(res);
				successMmodal("مقاله با موفقیت ویرایش شد");
			}
			else
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function PlaceArt(ev, cbf)
{
	var form = ev.target;
	ev.preventDefault();
	$('#MModal').modal({show:true});
	$.ajax
	({
		url: $(form).attr('action'),
		type: 'POST',
		data: $(form).serialize(),
		success: function (res)
		{
			if( res == "<%=consV.codes.lackOfInformation%>" )
			{
				failMmodal("اطلاعات حداقل پر نشده است");
			}
			else if( res == "<%=consV.codes.db.success%>")
			{
				successMmodal("مقاله در دانش نامه قرار گرفت");
				cbf();
			}
			else if( res == "<%=consV.codes.db.docFound%>")
			{
				failMmodal("این نام در زیر مجموعه ای که انتخاب کردید، از قبل هست، از نام دیگری استفاده کنید");
			}
			else if( res == "<%=consV.codes.validationError%>")
			{
				failMmodal("نام بدرستی وارد نشده");
			}
			else if( res == "<%=consV.codes.notAllowed%>")
			{
				failMmodal("شما مجوز ویرایش این مقاله را ندارید");
			}
			else
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function DeleteArt(nodeId)
{
	$('#MModal').modal({show:true});
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.encyclopedia.deleteArt%>',
		type: 'POST',
		data:
		{
			nodeId: nodeId
		},
		success: function (res)
		{
			if( res == "<%=consV.codes.db.Error%>" )
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if( res )
			{
				successMmodal("مقاله حذف شد");
				setTimeout(function ()
				{
					window.location.href = '';
				}, 1500);			
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in DeleteArt post request. message: %s" , err);
		}
	});
}

function createPlaceNodeTree(tree, tagId, artLang, item)
{
	var rootId = tree[0][0];
	var nodes = tree[1];
	var max_depth = 5;
	var html = "";
	$('#' + tagId).empty();

	function resursion(curNodeId, depth)
	{
		var ul_opened = false;
		if( (depth == 0) || (item._id == nodes[curNodeId].data._id) )
		{
			// nothing :!
		}
		else if(depth == max_depth - 1)
		{
			html+=`\
			<li class="cursorPointer" onmouseover="hover_on_item($(this));" onmouseleave="leave_item($(this))" \
			onclick="maxDepthNodeClicked(event,'${nodes[curNodeId].data._id}')">\
				${nodes[curNodeId].data.treeTitle[artLang]}\
				<span id="chevron" style="margin-top: 7px; font-size: 12px;float: left" class="fa fa-chevron-left"></span>\
				<span style="margin-top: 9px; margin-left: 0.5px; float: left; font-size: 7px; color: rgba(40,40,40,0.8);" class="fa fa-circle"></span>\
			</li>`;
		}
		else
		{
			ul_opened = true;
			html+= '<li class="cursorPointer" onmouseover="hover_on_item($(this));" onmouseleave="leave_item($(this))" onclick="collapse(event);">' + nodes[curNodeId].data.treeTitle[artLang] + '<span id="chevron" style="margin-top: 7px; font-size: 12px;float: left" class="fa fa-chevron-left"></span></li>';
			html+= '<ul style="display: none">';
			html+= '<li class="nodePlace NPUnselected" onclick="nodePlaceClicked(event)" data-nodeId="' + nodes[curNodeId].data._id + '">' + item.treeTitle[artLang] + '</li>';
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

	html =`<!-- PanEncTree Start -->\
			  <section class="treeHeader row align-items-center">\
			     <span class="mr-4">${nodes[rootId].data.treeTitle[artLang]}</span>\
			  </section>\
			  <section class="Tree">\
			     <ul>\
				     <li class="nodePlace NPUnselected" onclick="nodePlaceClicked(event)" data-nodeId="${nodes[rootId].data._id}">${item.treeTitle[artLang]}</li>`;
					  resursion(rootId, 0);
		html+= '</ul>\
			  </section>';
	$('#' + tagId).prepend(html);
}

function nodePlaceClicked(ev)
{
    $('.nodePlace').removeClass('NPSelected');
    $('.nodePlace').addClass('NPUnselected');
    
    var n = ev.target;
    $(n).addClass('NPSelected');
    
    $('#nodePlaceInput').val( $(n).attr('data-nodeId') );
}

function CheckURLName(item)
{
	$.ajax
	({
		url: '/' + lang + '<%=consV.pages.panel.encyclopedia.URLNameValidation%>',
		type: 'POST',
		data:
		{
			nodeId: item._id,
			parentNodeId: $('#nodePlaceInput').val(),
			URLName: $('#URLName').val()
		},
		success: function (res)
		{			
			if( res == "<%=consV.codes.lackOfInformation%>" )
			{
				// hadeaghal etelaat
				URLNameDanger();
				// En Ghataan bayad cbf beshe
			}
			else if( res == "<%=consV.codes.db.docFound%>" || res == "<%=consV.codes.validationError%>")
			{
				// node ba hamin nam vojid darad
				URLNameDanger();
			}
			else if( res == "<%=consV.codes.db.success%>" )
			{
				URLNameSuccess();
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in CheckURLName post request. message: %s" , err);
		}
	});
}


// Graphical
function URLNameClean()
{
	$('#URLName').removeClass('is-valid');
	$('#URLName').removeClass('is-invalid');
	$('#URLName').removeClass('form-control-warning');
}
function URLNameWarning()
{
	URLNameClean();

	$('#URLName').addClass('form-control-warning');
}
function URLNameDanger()
{
	URLNameClean();
	$('#URLName').addClass('is-invalid');
}
function URLNameSuccess()
{
	URLNameClean();
	$('#URLName').addClass('is-valid');
}