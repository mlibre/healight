"use strict";

function resFormInit()
{
	// set inputs
	$('#formResWriter').parent().hide();
	$('#formResURL').parent().hide();

	$('#formResType').on('change' , function ()
	{
		if( $(this).val()==="person" )
		{
			$('#formResFamily').parent().show();
			$('#formResName').parent().show();
			$('#formResWriter').parent().hide();
			$('#formResURL').parent().hide();
		}
		else if( $(this).val()==="book" )
		{
			$('#formResWriter').parent().show();
			$('#formResName').parent().show();
			$('#formResFamily').parent().hide();
			$('#formResURL').parent().hide();
		}
		else if( $(this).val()==="webSite" )
		{
			$('#formResURL').parent().show();
			$('#formResFamily').parent().hide();
			$('#formResName').parent().hide();
			$('#formResWriter').parent().hide();
		}
	});
	$('#formResLic').on('change' , function ()
	{
		if( $(this).val()==="other" )
		{
			$('#formResLicO').parent().show();
		}
		else
		{
			$('#formResLicO').parent().hide();
		}
	});
}

function setAddEditResFromData(resItem)
{
	let resLang = $('#formResLang').val();	
	$('#formResType').val(resItem.type);
	$('#formResName').val(resItem.name[resLang] || "");
	$('#formResFamily').val(resItem.family[resLang] || "");
	$('#formResWriter').val(resItem.writer || "");
	$('#formResURL').val(resItem.url || "");
	$('#formResLic').val(resItem.license || "");
	$('#formResLicO').val(resItem.license_custom || "");
	$('#formResEx').val(resItem.content[resLang] || "");
	$('#formResImageLicenseLink').val(resItem.image_license_link || "");
	
	if(resItem.image_alt != null)
	{
		let alts = resItem.image_alt.split(" ");
		$('#resFormImageAlt1').val(alts[0]);
		$('#resFormImageAlt2').val(alts[1]);
		$('#resFormImageAlt3').val(alts[2]);
	}
}

function setAddEditResFromResId(resId)
{
	$('#formResId').val(resId);
}

function getAddEditResFromResId()
{
	return $('#formResId').val();
}