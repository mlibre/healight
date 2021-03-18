"use strict";

let DBArticles = require( consV.methods.db.articles );
let space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares );
let express = require("express");
let async = require('async');
let Chance = require('chance');
let router = express.Router({mergeParams: true});
const fs = require('fs');

// router.use(middlewares.CheckTransAccess);

router.route('/')
.get(function(req , res)
{
	let title = 'صفحه ترجمه، آی ام جی';
	res.render("panel/translate/text",
	{
		title: title
	});
})
.post(function (req , res)
{
	let formVars = req.body;
	let transObg = {};
	
	for (let index = 0; index < Math.floor(Object.keys(formVars).length / 2) ; index++)
	{
		transObg[formVars['F' + index]] = formVars['T' + index].toString();
	}
	fs.writeFileSync(consV.space.locales + formVars.transTo + '.json' , JSON.stringify(transObg) , 'utf-8');	
	
	// if(err)
	// {
	// 	res.send( consV.codes.db.Error.toString() );
	// }
	// else
	// {
		res.json( true );
	// }
});

module.exports = router;
