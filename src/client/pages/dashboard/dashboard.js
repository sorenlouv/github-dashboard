var moment = require('moment');

function dashboardCtrl($scope, githubService) {
	githubService.getUserMentions()
		.then(function(response) {
			$scope.userIssues = response.data;
		});

	githubService.getTeamMentions()
		.then(function(response) {
			$scope.teamIssues = response.data;
		});

	$scope.getRelativeTime = function(timestamp) {
		return moment(timestamp).fromNow();
	};

	githubService.getTeamMembers('Tradeshift')
		.then(function(response) {
			console.log(response.data);
		});
}
module.exports = ['$scope', 'githubService', dashboardCtrl];
