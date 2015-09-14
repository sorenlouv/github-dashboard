var moment = require('moment');
var _ = require('lodash');

function dashboardCtrl($scope, $q, githubService, teamService) {
	$scope.teamMembers = teamService.getList();
	$scope.isEdit = false;

	var repos = ['Apps', 'Apps-Server', 'Backend-Service', 'Frontend'];
	var users = $scope.teamMembers;
	var teamPromise = githubService.getMultiTeamMentions(repos, users);
	var userPromise = githubService.getUserMentions();
	$q.all([userPromise, teamPromise])
		.then(function(issues) {
			var userIssues = issues[0];
			var teamIssues = issues[1];
			$scope.userIssues = userIssues;
			$scope.teamIssues = teamIssues.filter(function(issue) {
				return !_.find($scope.userIssues, {id: issue.id});
			});
		});

	githubService.getTeamMembers('Tradeshift')
		.then(function(members) {
			$scope.members = _.map(members, 'login');
		});

	$scope.getRelativeTime = function(timestamp) {
		return moment(timestamp).fromNow();
	};

	$scope.addTeamMember = function(name) {
		teamService.add(name);
	};

	$scope.removeTeamMember = function(name) {
		teamService.remove(name);
	};
}
module.exports = ['$scope', '$q', 'githubService', 'teamService', dashboardCtrl];
