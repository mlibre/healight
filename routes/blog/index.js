"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
var router = express.Router({mergeParams: true});

// Routing
router.use('/' , require('./main'));
router.use('/main' , require('./main'));
router.use('/users/:username' , require('./users/'));

module.exports = router;
