var cms = angular.module('cms', [
	'ngRoute',
	'cmsControllers',
	'cmsServices',
]);

var app_auth_url = '/admin';
var app_login_url = '/login';

cms.factory('authInterceptor', ['$rootScope', '$q', '$window',
	function ($rootScope, $q, $window) {
		return {
			request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token) {
					config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
				}
				return config;
			},
			response: function (response) {
				if (response.status === 401) {
				// handle the case where the user is not authenticated
				}
				return response || $q.when(response);
			}
		};
	}]);

cms.config(['$routeProvider', '$locationProvider', '$httpProvider',
	function($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'Home',
	})
	.when(app_login_url, {
		templateUrl: 'partials/mixins/login.html',
		controller: 'Login',
	})
	.when('/test', {
		templateUrl: 'partials/tester.html',
		controller: 'Test',
	})
	.when(app_auth_url + '/update/:slug', {
		templateUrl: 'partials/mixins/entry_form.html',
		controller: 'UpdateEntry',
	})
	.when('/:slug', {
		templateUrl: 'partials/entry.html',
		controller: 'Entry',
	})
	;
	$locationProvider.html5Mode(true);

	$httpProvider.interceptors.push('authInterceptor');
}]);

cms.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window) {
	$rootScope.$on('$routeChangeStart', function(event) {
		if($location.path().substring(0,app_auth_url.length) == app_auth_url) {
			if (!$window.sessionStorage.token) {
				event.preventDefault();
				$location.path(app_login_url)
			}
		}
	});

	$('.navigation.button').click(function(e) {
		$('.ui.navigation.sidebar').sidebar('toggle');
	})
}])