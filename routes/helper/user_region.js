"use strict";

let express = require("express");
let geoIP = require('geoip-lite');
let router = express.Router({mergeParams: true});

router.route('/')
.all(function (req , res)
{
	if(typeof req.headers['cf-ipcountry'] != 'undefined' && req.headers['cf-ipcountry'] != 'XX')
	{
		res.json(consV.site.CoToLang[req.headers['cf-ipcountry']]);
	}
	else
	{
		let ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		let location = geoIP.lookup(ip);
		if (location == null)
		{
			location = {};
			location.country = null;
		}
		res.json(location.country);
	}
});

module.exports = router;
