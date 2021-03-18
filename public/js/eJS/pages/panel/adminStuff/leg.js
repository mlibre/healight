"use strict";

// Events
$(window).bind("load", function()
{
	$(document).ready(function()
	{
		// modal
		setDefaultMmodal('در حال پردازش');
		setLegFrom(artItem);
	});
});
function setLegFrom(item)
{	
	let Lang = getFromLang();		
	setSpaceFolderName(item.spaceFolderName);
	setArtSpaceAddress("<%=consV.space.siteFolderName%>"+item.spaceFolderName);
	setArtTreeTitle(item.title[Lang]);
	setArtTags(item.tags[Lang]);
	setArtCon(item.content[Lang]);
}
function setLeg(ev, cbf)
{
	var form = ev.target;
	setLeg.artCretedMessage = setLeg.artCretedMessage  || "ثبت شد";
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
				successMmodal(setLeg.artCretedMessage);
				$('#CreEditArtSubmit').text('ویرایش');
				setLeg.artCretedMessage = "ویرایش انجام شد";
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
