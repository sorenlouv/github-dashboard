function mainCtrl($scope, $location, githubService) {
	var isAuthenticated = githubService.isAuthenticated();
	if (!isAuthenticated) {
		$scope.loginUrl = githubService.getLoginUrl();
	} else {
		$location.path('/dashboard');
	}
}
module.exports = ['$scope', '$location', 'githubService', mainCtrl];
