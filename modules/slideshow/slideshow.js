"use strict";

var current_slide_index = 0;

$(document).ready(function()
{
	var slidesCount = $('#slideshow').children().length - 4;
	var slideshowEl = document.getElementById('slideshow');
	var hammer = new Hammer(slideshowEl);
	hammer.on('swiperight' , function (ev)
	{
		let index = ( current_slide_index + 1 ) % slidesCount;
		nextSlide(index);
	});
	hammer.on('swipeleft' , function (ev)
	{
		let index = ( current_slide_index - 1 ) % slidesCount;
		nextSlide(index);
	});

	$(".slideshow ul > div").hover(
	function()
	{
		let index = $(this).index();
		nextSlide(index);
   },
   function()
	{

	});
	
	$("#nextSlideArrow").click(
		function()
		{			
			let index = ( current_slide_index + 1 ) % slidesCount;
			nextSlide(index);
		}
	);
	$("#prevSlideArrow").click(
		function()
		{			
			let index = ( current_slide_index - 1 ) % slidesCount;
			nextSlide(index);
		}
	);

	$("#nextSlideArrow, #prevSlideArrow").hover(
		function()
		{			
			$('#nextSlideArrow, #prevSlideArrow').fadeTo('fast' , 1);
		},
		function()
		{
			$('#nextSlideArrow, #prevSlideArrow').fadeTo('fast' , 0.7);
		}
	);


});

function nextSlide(index)
{
	if( current_slide_index != index )
	{
		$(`.slideshow img:eq(${index})`).fadeToggle('slow');
		$(`.slideshow img:eq(${current_slide_index})`).fadeToggle('slow');

		$(`.slideshow #bottom_slideshow_part ul > div:eq(${index})`).toggleClass("slideshow_AS");
		$(`.slideshow #bottom_slideshow_part ul > div:eq(${current_slide_index})`).toggleClass("slideshow_AS");

		$(`.slideshow #bottom_slideshow_part_mobile ul > div:eq(${index})`).toggleClass("d-none");
		$(`.slideshow #bottom_slideshow_part_mobile ul > div:eq(${current_slide_index})`).toggleClass("d-none");

		current_slide_index = index;
	}
}