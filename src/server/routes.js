var request = require('request');

function routes(app) {
	app.get('/access_token', function(req, res) {
		var clientId = '462cf694b2beee8059b6';
		var clientSecret = '2843fdc3e20b1432de97fd4db63ae8028d43ddc8';
		var code = req.query.code;
		request.post('https://github.com/login/oauth/access_token', {
			body: {
				client_id: clientId,
				client_secret: clientSecret,
				code: code
			},
			json: true
		},  function(err, response, body) {
			var accessToken = body.access_token;
			var week = 1000 * 3600 * 24 * 7;
			res.cookie('access_token', accessToken, {maxAge: week, httpOnly: false});
			res.redirect('/');
		});
	});
}

module.exports = routes;
