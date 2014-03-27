var cms = angular.module('cms', [
	'ngRoute',
	'cmsControllers',
	'cmsServices',
	'ngAnimate',
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
	.when('/about', {
		templateUrl: 'partials/about.html',
	})
	.when('/projects', {
		templateUrl: 'partials/projects.html',
	})
	.when(app_login_url, {
		templateUrl: 'partials/mixins/login.html',
		controller: 'Login',
	})
	.when('/admin', {
		templateUrl: 'partials/admin.html',
		controller: 'Admin',
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

	var sidebar;
	$('.navigation.button').click(function(e) {
		sidebar = $('.ui.navigation.sidebar').sidebar('toggle');
		e.stopPropagation();
	})

	$('body').click(function(e) {
		var targets = $(e.target).parents();
		if (e.clientX > 200 && sidebar.sidebar('is open')) {
			if (targets.index($('button.navigation')) == -1) {
				sidebar.sidebar('hide');
			}
		}
	});

}])