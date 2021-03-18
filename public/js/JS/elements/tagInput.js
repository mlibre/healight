"use strict";

$(document).ready(function ()
{
	$('#tags').tagsInput
	({
		defaultText: 'افزودن برچسب',
		delimiter: [','],
		height: 'initial',
		width: 'initial'
	});

	$('#tags_tagsinput *').focus(
	function ()
	{
		$('#tags_tagsinput').addClass('tagsinputFocus');
	});
	$('#tags_tagsinput *').focusout(
	function ()
	{
		$('#tags_tagsinput').removeClass('tagsinputFocus');
	});
});