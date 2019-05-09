"use strict";


let middlewares = require( consV.methods.middlewares );
let express = require("express");
let router = express.Router({mergeParams: true});
const fs = require('fs');

// router.use(middlewares.CheckRootAccess);

router.route('/')
.post(function (req , res)
{
	require('reboot').reboot();
});

module.exports = router;
