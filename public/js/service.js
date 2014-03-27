var cms = angular.module('cmsServices', [
]);

cms.service('API', ['$http', '$window', function($http, $window) {
	var self = this;
	self.api_url = 'api/';
	self.api_auth_url = 'auth/';

	var request = function(method, path, data, callback, require_login) {
		var config = {
			method: method,
			url: (require_login ? self.api_auth_url : self.api_url) + path,
			data: data,
		}
		console.log('sending:');
		console.log(config);
		var promise = $http(config);
		promise.success(function(data, status, headers, config) {
			console.log('server response:');
			if (data.api_status) {
				console.log(data);
				callback(data);
			}
			else {
				console.log('\tgot unpredicted response:');
				console.log(data);
			}
		}).error(function(data, status, headers, config) {
			console.log('server error:');
			console.log(data);
			callback({api_status: 'error', data: data}); 
		});
	}

	self.get = function(path, callback, require_login) {
		request('GET', path, null, callback, require_login);			
	}
	self.post = function(path, data, callback, require_login) {
		request('POST', path, data, callback, require_login);
	}
	self.delete = function(path, callback, require_login) {
		self.post(path, {_method: "delete"}, callback, require_login);
	}


	self.login = function(user, pass, callback) {
		self.post('login', {username: user, password: pass}, function(response) {
			// save this to the session.
			$window.sessionStorage.token = response.data;
			callback(response);
		});
	}

	self.logged_in = function() {
		if($window.sessionStorage.token) {
			return true;
		}
		else {
			return false;
		}
	}
}]);