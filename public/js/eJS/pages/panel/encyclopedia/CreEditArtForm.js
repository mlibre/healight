
function setCreEdiArtFromData(artItem)
{	
	let artLang = $('#formArtLang').val();

	$('#spaceFolderName').val(artItem.spaceFolderName);
	$('#spaceFolderAddress').val("<%=consV.space.articlesFolderName%>"+artItem.spaceFolderName);
	$('#treeTitle').val(artItem.treeTitle[artLang]);	
	if(typeof artItem.summary != "undefined")
	{
		$('#summary').val(artItem.summary[artLang]);
	}
	else
	{
		$('#summary').val("");
	}

	$('#tags').importTags("");
	if(typeof artItem.tags[artLang] != 'undefined' && artItem.tags[artLang] != null)
	{
		artItem.tags[artLang].forEach(function(el , index)
		{
			$('#tags').addTag(el);
		});
	}

	$('#formArtResLicType').val(artItem.license.type);
	$('#formArtResLic').val(artItem.license.text);

	if(typeof artItem.content[artLang] == 'undefined')
	{
		tinyMCE.activeEditor.setContent('');
	}
	else
	{
		tinyMCE.activeEditor.setContent(artItem.content[artLang]);
	}
}

$('#formArtResLicType').on('change' , function ()
{
	if( $(this).val()==="other" )
	{
		$('#formArtResLic').parent().show();
	}
	else
	{
		$('#formArtResLic').parent().hide();
	}
});

function setSpaceFolderName(name)
{
	$('#spaceFolderName').val(name);
}
function setArtSpaceAddress(add)
{
	$('#spaceFolderAddress').val(add);
}
function setArtTreeTitle(ti)
{
	$('#treeTitle').val(ti);
}
function setArtTags(tags)
{
	$('#tags').importTags("");
	if(typeof tags != 'undefined' && tags != null)
	{
		tags.forEach(function(el , index)
		{
			$('#tags').addTag(el);
		});
	}
}
function setArtCon(Con)
{
	if(typeof Con == 'undefined' || Con == null)
	{
		tinyMCE.activeEditor.setContent('');
	}
	else
	{
		tinyMCE.activeEditor.setContent(Con);
	}
}
function getFromLang()
{
	return $('#formArtLang').val();
}

function CEAFSendFile(ev)
{
	let form = ev.target;
	let formData = new FormData( $(form)[0] );
	ev.preventDefault();
	$.ajax
	({
		url: $(form).attr('action'),
		type: 'POST',
		enctype: 'multipart/form-data',
		processData: false,
		contentType: false,
		// cache: false,
		data: formData,
		success: function (res)
		{
			if(res == "<%=consV.codes.general.error%>")
			{
				top.$('.mce-btn.mce-open').parent().find('.mce-textbox').val('Error. SomeThing Is Wrong');
			}
			else if( res )
			{
				top.$('.mce-btn.mce-open').parent().find('.mce-textbox').val(res);
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}