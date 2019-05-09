"use strict";

$(document).ready(function()
{
	let current_slide_index = 0;    
	$(".slideshow ul > div").hover(
	function()
	{
      let index = $(this).index();
      if( current_slide_index != index )
      {
			$(`.slideshow img:eq(${index})`).fadeToggle('slow');
			$(`.slideshow img:eq(${current_slide_index})`).fadeToggle('slow');

			$(this).toggleClass("slideshow_AS");
			$(`.slideshow ul > div:eq(${current_slide_index})`).toggleClass("slideshow_AS");

			current_slide_index = index;
      }
   },
   function()
	{

	});
});