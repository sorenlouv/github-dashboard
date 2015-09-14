var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
app.use(express.static('public'));
require('./src/server/routes')(app);

var server = require('http').Server(app);
server.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Github Dashboard listening at http://%s:%s', host, port);
});
