var router = function($routeProvider) {
	$routeProvider
		.when('/login', {
			template: require('./login/login.html'),
			controller: require('./login/login'),
		})
		.when('/dashboard', {
			template: require('./dashboard/dashboard.html'),
			controller: require('./dashboard/dashboard'),
		})
		.otherwise({
			redirectTo: '/login',
		});
};

router.$inject = ['$routeProvider'];
module.exports = router;
