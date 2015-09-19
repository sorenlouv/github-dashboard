var moment = require('moment');
var _ = require('lodash');

function editTeamCtrl($scope, githubService, teamService) {
	$scope.teamMembers = teamService.getList();
	githubService.getOrganizationMembers()
		.then(function(members) {
			$scope.organizationMembers = _.map(members, 'login');
		});

	$scope.addTeamMember = function(name) {
		teamService.add(name);
	};

	$scope.removeTeamMember = function(name) {
		teamService.remove(name);
	};

	$scope.updateTeamIssues = function() {
		$scope.$emit('teamMembers:updated');
	};
}
module.exports = ['$scope', 'githubService', 'teamService', editTeamCtrl];
