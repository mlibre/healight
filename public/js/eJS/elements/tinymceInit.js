"use strict";

var tinymceCssLang = "/stylesheet/css/elements/tinymce-" +lang+ ".css";

tinymce.init(
{
	selector: '#editor',
	directionality: 'rtl',
	theme: 'modern',
	plugins:['link' , 'advlist' , 'media' , 'image' , 'autolink' , 'lists', 'hr',
	'charmap' , 'preview' , 'anchor' , 'paste' , 'table' , 'textcolor' , 'emoticons',
	'searchreplace' , 'wordcount' , 'save' , 'visualblocks' , 'nonbreaking' , 'contextmenu',
	'template' , 'imagetools' , 'directionality' , 'textpattern' , 'colorpicker' ,
	'fullscreen' , 'autoresize' , 'toc', 'code'],
	image_advtab: true,
	image_caption: true,
	toc_depth: 5,
	toc_header: 'h4',
	toolbar: ['formatselect | undo redo | fontselect fontsizeselect | ltr rtl | alignleft aligncenter alignright alignjustofy | outdent indent | searchreplace | fullscreen',
	'bold underline | forecolor backcolor | emoticons | bullist numlist | styleselect | removeformat',
	'link image media | insert | toc'],
	font_formats: 'IranSans=IRANSans; Times New Roman=times new roman, times; Verdana=verdana; Arial=arial, sans-serif;',
	fontsize_formats: '1rem 1.0625rem 1.15625rem 1.25rem 1.375rem 1.5rem 1.625rem',
	style_formats_merge: true,
	style_formats:
	[
		{
			title:'font size', 'items':
			[
				{
					title:'16px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1rem'}
				},
				{
					title:'17px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1.0625rem'}
				},
				{
					title:'18.5px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1.15625rem'}
				},
				{
					title:'20px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1.25rem'}
				},
				{
					title:'22px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1.375rem'}
				},
				{
					title:'24px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1.5rem'}
				},
				{
					title:'26px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1.625rem'}
				},
				{
					title:'28px', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,span,div,li', styles:{'font-size': '1.75rem'}
				}
			]
		},
		{
			title: 'Image Left',
			selector: 'img',
			styles:{},
			classes: ['float-sm-left', 'd-block', 'd-sm-inline-block', 'mx-auto', 'mr-sm-4', 'mt-2', 'mt-sm-3', 'mb-2', 'mb-sm-3']
		},
		{
			title: 'Image Right',
			selector: 'img',
			styles:{},
			classes: ['float-sm-right', 'd-block', 'd-sm-inline-block', 'mx-auto', 'ml-sm-4', 'mt-2', 'mt-sm-3', 'mb-2', 'mb-sm-3']
		},
		{
			title: 'Header Line',
			selector: 'h1,h2,h3,h4,h5,h6',
			styles:{},
			classes: ['borderBotLine']
		},
		{
			title: 'Header Margin',
			selector: 'h1,h2,h3,h4,h5,h6',
			styles:{},
			classes: ['mt-4']
		}
	],
	content_css: ['/stylesheet/css/elements/tinymce.css', tinymceCssLang, '<%=consV.css.bootstrap%>' , "<%=consV.css.beautifier%>"],
	convert_urls: false,
	file_picker_callback: function (callback , value, meta)
	{
		$('#uploadImageForm input[id="file"]').click();
	}
});