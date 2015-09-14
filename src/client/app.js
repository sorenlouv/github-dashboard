angular.module('githubDashboard', ['ngMaterial', 'ngRoute', 'ngCookies'])
	.config(require('./pages/routing'))
	// .config(require('./config'))
	// .run(require('./templates'))

	// Directives
	.directive('autocomplete', require('./directives/autocomplete'))

	// Controllers
	.controller('mainCtrl', require('./main/main'))

	// Services
	.service('teamService', require('./services/team'))
	.service('githubService', require('./services/github'));
