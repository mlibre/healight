// Events
//Initiliazation
var charts = {};
charts.wetnessChart = {};
charts.wetnessChart.text = 'تری';
charts.wetnessChart.color = '#607D8B';

charts.ColdChart = {};
charts.ColdChart.text = 'سردی';
charts.ColdChart.color = '#2196F3';

charts.heatChart = {};
charts.heatChart.text = 'گرمی';
charts.heatChart.color = '#EF5350';

charts.drynessChart = {};
charts.drynessChart.text = 'خشکی';
charts.drynessChart.color = '#795548';


$(document).ready(function()
{
	hideQ('lipid');
	hideQ('strongBlackHair');
	chartInitialization('ColdChart');
	chartInitialization('heatChart');
	chartInitialization('wetnessChart');
	chartInitialization('drynessChart');

	//Assignment
	var bodyTempHot = $('input:radio[name="bodyTemp"][value="bodyTempHot"]');
	var bodyTempCold = $('input:radio[name="bodyTemp"][value="bodyTempCold"]');
	var skinS = $('input:radio[name="skinSH"][value="skinS"]');
	var skinH = $('input:radio[name="skinSH"][value="skinH"]');
	var skinColorDark = $('input:radio[name="skinColor"][value="skinColorDark"]');
	var skinColorYellow = $('input:radio[name="skinColor"][value="skinColorYellow"]');
	var skinColorWhite = $('input:radio[name="skinColor"][value="skinColorWhite"]')
	var redSkinColorYes = $('input:radio[name="redSkinColor"][value="redSkinColorYes"]');
	var redSkinColorNo = $('input:radio[name="redSkinColor"][value="redSkinColorNo"]');
	var broadShoulder = $('input:radio[name="bodyFrom"][value="broadShoulder"]');
	var bodySizeNormal = $('input:radio[name="bodyFrom"][value="bodySizeNormal"]');
	var petite = $('input:radio[name="bodyFrom"][value="petite"]');
	var fat = $('input:radio[name="belly"][value="fat"]');
	var thin = $('input:radio[name="belly"][value="thin"]');
	var lipidYes = $('input:radio[name="lipid"][value="lipidYes"]');
	var hair_bright = $('input:radio[name="hairBrightness"][value="hair_bright"]');
	var hair_dark = $('input:radio[name="hairBrightness"][value="hair_dark"]');
	var strongBlackHairYes = $('input:radio[name="strongBlackHair"][value="strongBlackHairYes"]');
	var curlyHair = $('input:radio[name="hairForm"][value="curlyHair"]');
	var straightHair = $('input:radio[name="hairForm"][value="straightHair"]');
	var hairThick = $('input:radio[name="hairThickness"][value="hairThick"]');
	var hairThin = $('input:radio[name="hairThickness"][value="hairThin"]');
	var hairLong = $('input:radio[name="hairlenght"][value="hairLong"]');
	var hairShort = $('input:radio[name="hairlenght"][value="hairShort"]');
	var hairHighDensity = $('input:radio[name="hairTDensity"][value="hairHighDensity"]');
	var hairLowDensity = $('input:radio[name="hairTDensity"][value="hairLowDensity"]');

	$('form').change(function ()
	{
		hideQ('lipid');
		hideQ('strongBlackHair');
		chartInitialization('ColdChart');
		chartInitialization('heatChart');
		chartInitialization('wetnessChart');
		chartInitialization('drynessChart');
		var ColdPer = 0;
		var heatPer = 0;
		var wetnessPer = 0;
		var drynessPer = 0;

		// Form Rules
		if( checkConditions(fat) )
		{
			showQ('lipid');
		}
		if( checkConditions(hair_dark) )
		{
			showQ('strongBlackHair');
		}
		// Logic Rules
		//*************** Single ***************/
		if( checkConditions(bodyTempHot) )
		{
			heatPer += 10;
		}
		if( checkConditions(bodyTempCold) )
		{
			ColdPer += 10;
		}
		if( checkConditions(skinS) )
		{
			wetnessPer += 10;
		}
		if( checkConditions(skinH) )
		{
			drynessPer += 10;
		}
		if( checkConditions(skinColorDark) )
		{
			drynessPer += 5;
			ColdPer += 5;
		}
		if( checkConditions(skinColorWhite) )
		{
			ColdPer += 5;
		}
		if( checkConditions(skinColorYellow) )
		{
			heatPer += 5;
			drynessPer += 5;
		}
		if( checkConditions(redSkinColorYes) )
		{
			heatPer += 10;
			wetnessPer += 5;
		}
		if( checkConditions(skinColorWhite, redSkinColorNo) )
		{
			ColdPer += 10;
		}
		if( checkConditions(broadShoulder) )
		{
			heatPer += 10;
			wetnessPer += 10;
		}
		if( checkConditions(petite) )
		{
			ColdPer += 10;
			drynessPer += 10;
		}
		if( checkConditions(fat) )
		{
			ColdPer += 10;
			wetnessPer += 10;
		}
		if( checkConditions(thin) )
		{
			heatPer += 10;
			drynessPer += 10;
		}
		if( checkConditions(lipidYes) )
		{
			ColdPer += 5;
			wetnessPer += 5;
		}
		if( checkConditions(hair_bright) )
		{
			heatPer += 5;
			wetnessPer += 5;
		}
		if( checkConditions(hair_dark) )
		{
			heatPer += 5;
		}
		if( checkConditions(strongBlackHairYes) )
		{
			drynessPer += 10;
		}
		
		updateChart('drynessChart', drynessPer );
		updateChart('ColdChart', ColdPer );
		updateChart('heatChart', heatPer );
		updateChart('wetnessChart', wetnessPer );
	});
});

function checkConditions()
{	
	for(var i = 0 ; i < arguments.length; i++)
	{
		if(arguments[i].prop('checked') != true)
		{
			return false;
		}
	}
	return true;
}
function chartInitialization(chartId)
{
	$('#' + chartId).empty();
	$('#' + chartId).data('per' , "0");
	$('#' + chartId).circliful
	({
		animationStep: 4,
		text: charts[chartId].text,
		textStyle: "font-size: 1.1rem",
		textY: 15,
		foregroundColor: charts[chartId].color,
		pointColor: charts[chartId].color,
		pointSize: 35,
		fontColor: "white",
		foregroundBorderWidth: 10,
		backgroundBorderWidth: 20,
		percentageY: 106,
		percent: 0
	});
}
function updateChart(chartId, per)
{
	$('#' + chartId).data('per' , per.toString());
	$('#' + chartId).empty();
	$('#' + chartId).circliful
	({
		animationStep: 4,
		text: charts[chartId].text,
		textStyle: "font-size: 1.1rem",
		textY: 15,
		foregroundColor: charts[chartId].color,
		pointColor: charts[chartId].color,
		pointSize: 35,
		fontColor: "white",
		foregroundBorderWidth: 10,
		backgroundBorderWidth: 20,
		percentageY: 106,
		percent: per
	});
}
function hideQ(artId)
{
	$('#article_content_' + artId).parent().hide();
}
function showQ(artId)
{
	$('#article_content_' + artId).parent().show();
}
function radioChecked(ev)
{
	var item = $(ev.target);
	var card = item.closest('div .card');
	var card_deck = item.closest('div .card-deck');
	var ClickedCard = card.find('input').prop('checked');
	
	card_deck.find('.card-footer').removeClass('selectedColor');
	card_deck.find('.card-footer').addClass('unSelectedColor');
	
	if(ClickedCard)
	{
		card.find('input').prop('checked',false).change();
	}
	else
	{
		card.find('input').prop('checked',true).change();
		card.find('.card-footer').removeClass('unSelectedColor');
		card.find('.card-footer').addClass('selectedColor');
	}
}