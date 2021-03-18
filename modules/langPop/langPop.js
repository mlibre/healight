$(document).ready(function()
{
	$.get("/helper/user_region", function response(country)
	{
		var dontShowAgainEn = "<div class='ltrDir px-1 py-1 m-0'><a id='dontShowLanPop' href='#' onclick='dontShowLanPopAgain()'>Dont show this again</a></div>";
		var dontShowAgainFa = "<div class='rtlDir px-1 py-1 m-0'><a id='dontShowLanPop' href='#' onclick='dontShowLanPopAgain()'>این پیام رو دیگه نیار</a></div>";
		if(lang != 'fa' && (country == null || country == 'IR'))
		{
			$('#lanPop').attr('data-original-title', $('#lanPop').data('title') + "به دنبال صفحه ی فارسی هستید؟");
			$('#lanPopBottom').attr('data-original-title', $('#lanPopBottom').data('title') + "به دنبال صفحه ی فارسی هستید؟");
			$('#lanPop, #lanPopBottom').attr('data-content', `<p class="px-1 py-1 m-0"><a href="${altPage.fa}">زبان رو به فارسی تغییر بده</a></p>` + dontShowAgainEn);
			$('#lanPop, #lanPopBottom').popover('show');
		}
		else if(lang != 'en' && typeof altPage.en != 'undefined' && (country == null || country != 'IR'))
		{
			if( typeof dontGenAltPage == 'undefined' || (typeof dontGenAltPage != 'undefined' && dontGenAltPage['en'] != true) )
			{
				$('#lanPop').attr('data-original-title',"Looking for this page in English?" + $('#lanPop').data('title'));
				$('#lanPopBottom').attr('data-original-title' , "Looking for this page in English?" + $('#lanPopBottom').data('title'));
				$('#lanPop, #lanPopBottom').attr('data-content', `<p class="px-1 py-1 m-0"><a href="${altPage.en}">Change to English</a></p>` + dontShowAgainFa);
				$('#lanPop, #lanPopBottom').popover('show');
			}
		}
	}, 'json');
});
function hideLanPop()
{
	$('#lanPop, #lanPopBottom').popover('hide');
}
function dontShowLanPopAgain()
{
	$.ajax
	({
		url: '/web_services/lanPopShow',
		type: 'POST',
		success: function (res)
		{
			if( res == true )
			{
				$('#remSign').click();
			}
			else
			{
				console.log("#Ajax. Error in LanPopShow response");
			}
		},
		error: function(JXHR , status , err)
		{
			console.log(`#Ajax. Error in LanPopShow post request. message: ${err}`);
		}
	});	
}