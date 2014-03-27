var app = angular.module('cmsControllers', []);

app.controller('Home', ['$scope', 'API', '$sce', function($scope, API, $sce) {
	API.get('entry?html=true', function(response) {
		if (response.api_status === 'success') {
			$scope.entries = response.data.map(function(entry) {
				var e = entry;
				e.text = $sce.trustAsHtml(entry.text);
				return e;
			});
		}
	});
}]);

app.controller('Admin', ['$scope', 'API', '$sce', function($scope, API, $sce) {
	API.get('entry', function(response) {
		if (response.api_status === 'success') {
			$scope.entries = response.data.map(function(entry) {
				var e = entry;
				return e;
			});
		}
	});
}]);

app.controller('Entry', ['$scope', '$routeParams', 'API', '$sce', function($scope, $routeParams ,API, $sce) {
	var slug = $routeParams.slug;
	API.get('entry/' + slug + '?html=true', function(response) {
		if (response.api_status === 'success') {
			$scope.entry = response.data;
			$scope.logged_in = API.logged_in();
			$scope.entry.text = $sce.trustAsHtml(response.data.text);
		}
		else {
		}
	});
}])

app.controller('Login', ['$scope', '$location', 'API', function($scope, $location, API) {
	$scope.submit = function() {
		API.login($scope.user.username, $scope.user.password, function(data) {
			if (data.api_status === 'success') {
				console.log("Successfully logged in.");
				$location.path('/admin');
			} else {
			}
		});
	}		
}]);

////
//	For testing purposes.
////
app.controller('Test', ['$scope', 'API', function($scope, API) {
	$scope.submit = function(type) {
		if (type == 'auth') {
			API.get($scope.path, function(response) {
				console.log(response);
			}, true);
		}
	}
}])

app.controller('UpdateEntry', ['$scope', '$location', '$routeParams', 'API', function($scope, $location, $routeParams, API) {
	var slug = $routeParams.slug;
	var model = 'entry';

	API.get(model+'/'+slug, function(response) {
		if (response.api_status === 'success') {
			$scope.entry = response.data;
		}
	})

	$scope.submit = function() {
		var entry = $scope.entry;
		entry.slug = slug;
		if (!entry.isPost) {
			entry.isPost = false;
		}
		API.post(model + '/' + slug, entry, function(response) {
			if (response.api_status === 'success') {
				$location.path('/' + slug);
			}
			else {
			}
		}, true);
	}

	$scope.delete = function() {
		API.delete(model + '/' + slug, function(response) {
			if (response.api_status === 'success') {
				$location.path('/');
			}
			else {
			}
		}, true);
	}
}])