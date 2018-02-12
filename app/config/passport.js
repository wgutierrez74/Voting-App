'use strict';

var User = require('../models/users.js');
var LocalStrategy   = require('passport-local').Strategy;
var login = require("./login.js");
var register = require("./register.js");
var bCrypt = require('bcrypt-nodejs');
//var configAuth = require('./auth');

module.exports = function (passport) {
	
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	

	login(passport);
	
	register(passport);
	

};
