var moment = require('moment');

function dashboardCtrl($scope, githubService) {
	githubService.getUserMentions()
		.then(function(response) {
			$scope.userIssues = response.data;
		});

	var repos = ['Apps', 'Backend-Service', 'Frontend'];
	var users = ['zdlm', 'hofmeister'];
	githubService.getMultiTeamMentions(repos, users)
		.then(function(issues) {
			$scope.teamIssues = issues;
		});

	$scope.getRelativeTime = function(timestamp) {
		return moment(timestamp).fromNow();
	};

	githubService.getTeamMembers('Tradeshift')
		.then(function(response) {
			$scope.myItems = response.data.map(function(member) {
				return member.login;
			});
		});
}
module.exports = ['$scope', 'githubService', dashboardCtrl];
