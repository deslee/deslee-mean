var	fs = require('fs'), // filesystem access
	http = require('http'),
	https = require('https'),
	privateKey = fs.readFileSync('server.key', 'utf-8'),
	certificate = fs.readFileSync('server.crt', 'utf-8'),
	credentials = {key: privateKey, cert: certificate}; // server credentials

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
httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8090);