var _ = require('lodash');

function githubService($http, $cookies, $location, $q) {
	var service = {};
	var organizationName = 'Tradeshift';

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
		var twoWeeksAgo = new Date(Date.now() - 1000 * 3600 * 24 * 14).toISOString();
		return request({
			method: 'GET',
			url: '/orgs/' + organizationName + '/issues',
			params: {
				filter: 'mentioned',
				since: twoWeeksAgo,
				sort: 'update'
			}
		});
	};

	service.getTeamMentions = function(repoName, username) {
		var oneWeekAgo = new Date(Date.now() - 1000 * 3600 * 24 * 7).toISOString();
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
			method: 'GET',
			url: '/orgs/' + organizationName + '/members',
			params: {
				per_page: 100
			}
		});
	};

	service.getIssueComments = function(repoName, issueId) {
		var oneWeekAgo = new Date(Date.now() - 1000 * 3600 * 24 * 7).toISOString();
		return request({
			method: 'GET',
			url: '/repos/' + organizationName + '/' + repoName + '/issues/' + issueId + '/comments',
			params: {
				direction: 'desc',
				sort: 'updated'
			}
		});
	};

	return service;
}

module.exports = ['$http', '$cookies', '$location', '$q', githubService];
