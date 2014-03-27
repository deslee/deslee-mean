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

app.controller('Entry', ['$scope', '$routeParams', 'API', '$sce', function($scope, $routeParams ,API, $sce) {
	var slug = $routeParams.slug;
	API.get('entry/' + slug + '?html=true', function(response) {
		if (response.api_status === 'success') {
			$scope.entry = response.data;
			$scope.entry.text = $sce.trustAsHtml(response.data.text);
		}
		else {
			console.log(response);
		}
	});
}])

app.controller('Login', ['$scope', 'API', function($scope, API) {
	$scope.submit = function() {
		API.login($scope.user.username, $scope.user.password, function(data) {
			if (data.api_status === 'success') {
				console.log("Successfully logged in.");
			} else {
				console.log('Failed to log in');
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
		API.post('update/' + model + '/' + slug, entry, function(response) {
			if (response.api_status === 'success') {
				$location.path('/' + slug);
			}
			else {
				console.log(response);
			}
		}, true);
	}
}])