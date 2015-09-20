angular.module('githubDashboard', ['ngMaterial', 'ngRoute', 'ngCookies'])
	.config(require('./pages/routing'))
	// .config(require('./config'))
	.run(require('./templates/templates'))

	// Directives
	.directive('autocomplete', require('./directives/autocomplete'))
	.directive('spinner', require('./directives/spinner/spinner'))

	// Controllers
	.controller('mainCtrl', require('./templates/main/main'))

	// Services
	.service('teamService', require('./services/team'))
	.service('githubService', require('./services/github'));
