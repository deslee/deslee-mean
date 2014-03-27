var	express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var config = require('./');
var secret = require('./secret');
var expressJwt = require('express-jwt');
var lessMiddleware = require('less-middleware');
var path = require('path');

module.exports = function(app) {
	console.log(path.join(__dirname, '../../public'))
	app.use(lessMiddleware(path.join(__dirname, '../../public')));

	app.use(express.static('../public/'));	// static sites
	app.use(express.json());			// json parsing
	app.use(express.urlencoded());		
	app.use(express.multipart());		
	app.use(express.methodOverride());	// simulate delete / put

	////
	// implement your own passport strategy here.
	////
	passport.use(
	  new LocalStrategy(function(username, password, done) {
	  	console.log("BEGIN THING");
		if (username === secret.username && password === secret.pass) {
			console.log('okay then.')
			return done(null, {name: 'Desmond Lee'});
		}
		return done(null, false);
	}));
	
	app.use(passport.initialize());		// initializes auth system
	app.use(config.api_auth, expressJwt({secret: secret.key}));

	app.use(app.router); // allows custom middleware or something
}