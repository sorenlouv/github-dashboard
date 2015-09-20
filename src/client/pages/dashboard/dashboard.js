var moment = require('moment');
var _ = require('lodash');

function dashboardCtrl($scope, $q, githubService, teamService) {
	$scope.spinnerOptions = {top: '22px', left: '95%', lines: 7, length: 8, width: 4, radius: 6, scale: 1};
	$scope.teamMembers = teamService.getList();
	$scope.isEditTeam = false;
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

			userIssues.map(function(issue) {
				githubService.getIssueComments(issue.repository.name, issue.number)
					.then(function(comments) {
						issue.approved = hasApprovedComment(comments);
					});
			});
		});

	$scope.$on('teamMembers:updated', function() {
		$scope.isEditTeam = false;
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

	$scope.showEditTeam = function() {
		$scope.isEditTeam = true;
	};

	function hasApprovedComment(comments) {
		return comments.some(function(comment) {
			return hasEmoji(comment.body);
		});
	}

	function hasEmoji(str) {
		return /:[a-zA-Z0-9-+_]*:/g.test(str);
	}
}
module.exports = ['$scope', '$q', 'githubService', 'teamService', dashboardCtrl];
