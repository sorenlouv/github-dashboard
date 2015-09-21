var _ = require('lodash');

function githubService($http, $cookies, $location, $q) {
	var service = {};
	var organizationName = 'Tradeshift';
	var clientId = '462cf694b2beee8059b6';
	var ACCESS_TOKEN_COOKIE_NAME = 'access_token';

	var twoWeeksAgo = new Date(Date.now() - 1000 * 3600 * 24 * 14).toISOString();
	var oneWeekAgo = new Date(Date.now() - 1000 * 3600 * 24 * 7).toISOString();

	function request(options) {
		var baseUrl = 'https://api.github.com';
		options.url = baseUrl + options.url;
		options.headers = {
			Authorization: 'token ' + service.getAccessToken()
		};
		return $http(options)
			.then(function(response) {
				return options.raw ? response : response.data;
			})
			.catch(function(error) {
				console.log(error);
				if (error.status === 401) {
					console.log('Unauthenticated');
					service.isTokenValid()
						.then(function(isValid) {
							if (!isValid) {
								service.removeAccessToken();
								$location.path('/login');
							}
						});
				}
				throw error;
			});
	}

	service.isTokenValid = function() {
		return request({
			method: 'GET',
			url: '/applications/' + clientId + '/tokens/' + service.accessToken
		}).then(function() {
			return true;
		})
		.catch(function() {
			return false;
		});
	};

	service.removeAccessToken = function() {
		$cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
		service.accessToken = null;
	};

	service.getLoginUrl = function() {
		var scope = 'user,repo';
		return 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&scope=' + scope;
	};

	service.getAccessToken = function() {
		if (!service.accessToken) {
			service.accessToken = $cookies.get(ACCESS_TOKEN_COOKIE_NAME);
		}
		return service.accessToken;
	};

	service.isAuthenticated = function() {
		var accessToken = service.getAccessToken();
		return !!accessToken;
	};

	service.getIssuesCreatedByUser = function() {
		return request({
			method: 'GET',
			url: '/orgs/' + organizationName + '/issues',
			params: {
				filter: 'created',
				state: 'open'
			}
		});
	};

	service.getIssuesMentioningUser = function() {
		return request({
			method: 'GET',
			url: '/orgs/' + organizationName + '/issues',
			params: {
				filter: 'mentioned',
				state: 'open',
				since: twoWeeksAgo,
				sort: 'update'
			}
		});
	};

	service.getTeamMentions = function(repoName, username) {
		return request({
			method: 'GET',
			url: '/repos/' + organizationName + '/' + repoName + '/issues',
			params: {
				mentioned: username,
				since: oneWeekAgo,
				sort: 'update'
			}
		})
		.then(function(issues) {
			return issues.map(function(issue) {
				issue.mentionedUser = username;
				return issue;
			});
		});
	};

	service.getMultiTeamMentions = function(repos, users) {
		var promises = [];
		repos.forEach(function(repoName) {
			users.forEach(function(username) {
				promises.push(service.getTeamMentions(repoName, username));
			});
		});
		return $q.all(promises).then(function(responses) {
			return _(responses).flatten().sortBy('id').reverse().value();
		});
	};

	service.getOrganizationMembers = function() {
		return request({
			cache: true,
			method: 'GET',
			url: '/orgs/' + organizationName + '/members',
			params: {
				per_page: 100
			}
		});
	};

	service.getIssueComments = function(repoName, issueId) {
		return request({
			method: 'GET',
			url: '/repos/' + organizationName + '/' + repoName + '/issues/' + issueId + '/comments'
		});
	};

	service.getIssuesByCommenter = function(username) {
		return request({
			method: 'GET',
			url: '/search/issues',
			params: {
				q: 'commenter:' + username + ' state:open type:pr updated:>=' + twoWeeksAgo,
				direction: 'desc',
				sort: 'updated'
			}
		}).then(function(result) {
			return result.items;
		});
	};

	service.getIssuesByOwnComments = function() {
		return service.getUser()
			.then(function(user) {
				return service.getIssuesByCommenter(user.login);
			});
	};

	service.getUser = function() {
		return request({
			method: 'GET',
			url: '/user',
			cache: true
		});
	};

	return service;
}

module.exports = ['$http', '$cookies', '$location', '$q', githubService];
