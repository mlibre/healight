"use strict";

let space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.CheckSpaceAccess);
router.use(middlewares.CheckUploadFFArAccess);

router.route('/')
.post(function(req , res)
{	
	if(req.body.spaceFolderAddress == "" || typeof req.body.spaceFolderAddress == "undefined" ||
	req.files == "" || typeof req.files == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}
	let spaceFolderAddress = req.body.spaceFolderAddress;
	if(spaceFolderAddress[spaceFolderAddress.length-1] != '/')
	{
		spaceFolderAddress = spaceFolderAddress + '/';
	}
	async.series
	([
		function (callback)
		{
			space.copyFile(spaceFolderAddress, req.files.file.name, req.files.file.data ,function (err, res)
			{
				callback(err , spaceFolderAddress + req.files.file.name);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			res.send( consV.codes.general.error.toString() );
		}
		else
		{
			let fileUrl = '/' + spaceFolderAddress + req.files.file.name;
			res.send( fileUrl.toString() );
		}
	});
});

module.exports = router;