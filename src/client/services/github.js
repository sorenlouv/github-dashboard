function githubService($http, $cookies, $location) {
	var service = {};

	function request(options) {
		var baseUrl = 'https://api.github.com';
		options.url = baseUrl + options.url;
		options.headers = {
			Authorization: 'token ' + service.getAccessToken()
		};
		return $http(options)
			.catch(function(error) {
				if (error.status === 401) {
					$location.path('/login');
				}
				throw error;
			});
	}

	service.getLoginUrl = function() {
		var clientId = '462cf694b2beee8059b6';
		var scope = 'user,repo';
		return 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&scope=' + scope;
	};

	service.getAccessToken = function() {
		if (!service.accessToken) {
			service.accessToken = $cookies.get('access_token');
		}
		return service.accessToken;
	};

	service.isAuthenticated = function() {
		var accessToken = service.getAccessToken();
		return !!accessToken;
	};

	service.getUserMentions = function() {
		return request({
			method: 'get',
			url: '/orgs/Tradeshift/issues',
			params: {
				filter: 'mentioned'
			}
		});
	};

	service.getTeamMentions = function() {
		return request({
			method: 'get',
			url: '/repos/Tradeshift/Apps/issues',
			params: {
				mentioned: 'zdlm'
			}
		});
	};

	service.getTeamMembers = function(organizationName) {
		return request({
			method: 'get',
			url: '/orgs/' + organizationName + '/members'
		});
	};

	return service;
}

module.exports = ['$http', '$cookies', '$location', githubService];
