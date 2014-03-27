var	fs = require('fs'), // filesystem access
	http = require('http');

var express = require('express');
var app = express();
var configure = require('./configs/configure');
var routes = require('./configs/routes');

configure(app);
routes(app);

app.use(function(req, res, next) {
    res.redirect(req.protocol + '://' + req.get('Host') + '/#' + req.url)
});

httpServer = http.createServer(app),

httpServer.listen(8000);
