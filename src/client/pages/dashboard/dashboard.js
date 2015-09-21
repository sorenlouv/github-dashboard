var moment = require('moment');
var _ = require('lodash');

function dashboardCtrl($scope, $q, githubService, teamService) {
	$scope.spinnerOptions = {top: '22px', left: '95%', lines: 7, length: 8, width: 4, radius: 6, scale: 1};
	$scope.isLoading = {
		mentions: true,
		comments: true
	};

	// $scope.teamMembers = teamService.getList();
	// var repos = ['Apps', 'Apps-Server', 'Backend-Service', 'Frontend'];
	// var users = $scope.teamMembers;
	// var teamPromise = githubService.getMultiTeamMentions(repos, users);

	var mentionedIssues = githubService.getIssuesMentioningUser();
	var commentedIssues = githubService.getIssuesByOwnComments();
	var createdIssues = githubService.getIssuesCreatedByUser();

	$q.all([mentionedIssues, commentedIssues, createdIssues])
		.then(function(issues) {
			$scope.isLoading = {
				mentions: false,
				comments: false
			};
			$scope.mentionedIssues = issues[0];
			$scope.commentedIssues = issues[1].filter(function(issue) {
				return !_.find($scope.mentionedIssues, {id: issue.id});
			});

			console.log(issues[2]);

			decorateWithApprovals($scope.mentionedIssues);
			decorateWithApprovals($scope.commentedIssues);
		});

	$scope.getRelativeTime = function(timestamp) {
		return moment(timestamp).fromNow();
	};

	function decorateWithApprovals(issues) {
		issues.map(function(issue) {
			var repoName = issue.url.match(/repos\/\w+\/([a-zA-Z0-9\-\_]+)\/issues\//)[1];
			githubService.getIssueComments(repoName, issue.number)
				.then(function(comments) {
					issue.approved = hasApprovedComment(comments);
				});
		});
	}

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
