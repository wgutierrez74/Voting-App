'use strict';

var path = process.cwd();
var SessionHandler = require(path + '/app/controllers/server/sessionHandler.server.js');
var navigation = require(path + "/app/controllers/server/navigationHandler.server.js");
var functions = require(path + "/app/controllers/server/functionHandler.server.js");
var xmlparser = require("express-xml-bodyparser");


module.exports = function (app, passport) {
	
	var sessionHandler = new SessionHandler();
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}
	
	function loggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/home');
		} else {
			return next();
		}
	}
	
	app.route("/dropindexes").get(functions.dropIndexes);
	
	app.route("/showdb").get(functions.showdb);
	
	app.route("/testdb").get(functions.testdb);
	
	app.route("/deletedb").get(functions.deletedb);
	
	app.route("/navigation").get(navigation.setup);
	
	//Should be a different view, this should be login view...maybe
	app.route('/').get(function (req, res) {
		res.render(path + '/public/index.ejs', {
			"message" : req.flash('message')
		});
	});
	
	app.route('/register').get(loggedIn, function(req, res) {
	    res.render(path + '/public/register.ejs',{
	    	"message" : req.flash('message')
	    });
	});
	
	app.route('/register').post(passport.authenticate('register', {
		successRedirect: '/home',
		failureRedirect: '/register',
		failureFlash : true
	}));
	
	app.route('/login').post(passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));
	
	app.route('/logout').get(function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.route('/api/user').get(isLoggedIn, sessionHandler.getUser);
	
	app.route('/home').get(isLoggedIn, function(req, res){
		res.render(path+'/public/home.ejs', {
			"message" : "", 
			 user	: req.user
		});
	});
	
	app.route('/profile').get(function (req, res) {
		res.render(path + '/public/profile.ejs');
	});


	app.route('/polls/create').get(isLoggedIn, function(req, res) {
	    res.render(path + "/public/create.ejs", {
	    	"message" : ""
	    });
	});
	
	app.route('/polls/delete/:query').post(isLoggedIn, functions.deletePoll);
	
	app.route('/polls/create').post(isLoggedIn, functions.createPoll);

	app.route('/polls').get(function(req, res){
		res.render(path + "/public/polls.ejs");
	});
		
	app.route('/polls/all').get(functions.showAllPolls);

	// app.route("/polls/get/:query").get(function(req, res){
	//  	res.render(path + "/public/show-poll.ejs", {
	//  		user: req.user
	//  	});
	// });
	
	app.route("/polls/get/:query").get(functions.showEjsPoll);
	
	app.route("/polls/get/info/:query").get(functions.showPoll);
	
	app.route("/polls/add/info/:query").post(functions.saveOptionChoice);
	
	app.route("/polls/add/options/:query").post(functions.addNewOptions);
	



		

};
