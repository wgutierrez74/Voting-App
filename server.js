'use strict';

var express = require('express');
var routes = require('./app/routes/router.js');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
//require('body-parser-xml')(bodyParser);
var xmlparser = require('express-xml-bodyparser');


var passport = require('passport');
var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);


mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(xmlparser());
//app.use(bodyParser.xml());

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretKey',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Initiaize flash
var flash = require('connect-flash');
app.use(flash());



routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
