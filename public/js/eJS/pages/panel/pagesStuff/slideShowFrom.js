
function setSlideShowFromData(Item)
{
	let fromLang = $('#slideShowFormLang').val();
	if(Item.image_alt != null)
	{
		let alts = Item.image_alt.split(" ");
		$('#slideShowFormImageAlt1').val(alts[0]);
		$('#slideShowFormImageAlt2').val(alts[1]);
		$('#slideShowFormImageAlt3').val(alts[2]);
	}
	if(Item.title != null)
	{
		$('#slideShowFormTitle').val(Item.title);
	}
	setChosenNodeLang(fromLang);
	setChosenNodeId(Item.art_id);
	createchooseNodeTree("root", 6);
}

function getSlideShowFormPage()
{
	return $('#slideShowFormPage').val();
}
function getSlideShowFormSN()
{
	return $('#slideShowFormSN').val();
}
function getSlideShowFormLang()
{
	return $('#slideShowFormLang').val();
}