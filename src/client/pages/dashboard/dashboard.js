var moment = require('moment');
var _ = require('lodash');

function dashboardCtrl($scope, $q, githubService, teamService) {
	$scope.teamMembers = teamService.getList();
	$scope.isEdit = false;
	$scope.isLoading = {
		team: true,
		user: true
	};

	var repos = ['Apps', 'Apps-Server', 'Backend-Service', 'Frontend'];
	var users = $scope.teamMembers;
	var teamPromise = githubService.getMultiTeamMentions(repos, users);
	var userPromise = githubService.getUserMentions();

	$q.all([userPromise, teamPromise])
		.then(function(issues) {
			$scope.isLoading = {
				team: false,
				user: false
			};
			var userIssues = issues[0];
			var teamIssues = issues[1];
			$scope.userIssues = userIssues;
			$scope.teamIssues = teamIssues.filter(function(issue) {
				return !_.find($scope.userIssues, {id: issue.id});
			});
		});

	$scope.$on('teamMembers:updated', function() {
		$scope.isEdit = false;
		$scope.isLoading.team = true;

		githubService.getMultiTeamMentions(repos, users)
			.then(function(teamIssues) {
				$scope.isLoading.team = false;
				$scope.teamIssues = teamIssues.filter(function(issue) {
					return !_.find($scope.userIssues, {id: issue.id});
				});
			});
	});

	$scope.getRelativeTime = function(timestamp) {
		return moment(timestamp).fromNow();
	};
}
module.exports = ['$scope', '$q', 'githubService', 'teamService', dashboardCtrl];
