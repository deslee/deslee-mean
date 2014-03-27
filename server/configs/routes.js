var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('./');
var secret = require('./secret');
var models = require('./models');

var api_response = function(data, api_status) {
	if (!api_status) {
		api_status = 'success';
	}
	return {
		api_status: api_status,
		data: data,
	}
};

var model_not_found = "Model is not defined in the server";

var success = function(res, data) {
	return res.json(api_response(data));
}, failure = function(res, data) {
	return res.json(api_response(data, 'failure'));
}, error = function(res, err) {
	return res.json(api_response(err, 'error'));
};

module.exports = function(app) {
	app.post(config.api + '/login', function(req, res) {
		passport.authenticate('local', { session: false }, function(err, user, info) {
			if (err) {
				error(res, err);
			}
			if (!user) {
				failure(res);
			}
			var token = jwt.sign(user, secret);
			success(res, token);
		})(req, res);
	});

	app.get(config.api + '/information', function(req, res) {
		success(res);
	});

	app.get(config.api_auth + '/user', function(req, res) {
		success(req.user);
	});

	app.get(config.api + '/:model', function(req, res) {
		var modelName = req.params.model;
		var Model = models[modelName[0].toUpperCase()+modelName.slice(1)];

		if (!Model) {
			return failure(res, model_not_found);
		}

		Model.odm.find(function(err, result) {
			if (err) {
				return error(res, err);
			}
			return success(res, result.map(function(model) {
				return Model.trim(model);
			}));
		});
	});

	app.get(config.api + '/:model/:slug', function(req, res) {
		var modelName = req.params.model;
		var slug = req.params.slug;
		var Model = models[modelName[0].toUpperCase()+modelName.slice(1)];

		if (!Model) {
			return failure(res, model_not_found);
		}

		Model.odm.findOne({slug: slug}, function(err, result) {
			if (err) {
				return error(res, err);
			}
			else if (!result) {
				return failure(res);
			}
			else {
				return success(res, Model.trim(result));
			}
		});
	})

	app.post(config.api_auth + '/update/:model/:slug', function(req, res) {
		var modelName = req.params.model;
		var slug = req.params.slug;
		var Model = models[modelName[0].toUpperCase()+modelName.slice(1)];

		if (!Model) {
			return failure(res, model_not_found);
		}

		var doc = Model.trim(req.body);
		
		Model.odm.findOneAndUpdate({slug: slug}, doc, {upsert: true}, function(err, updated) {
			if (err) {
				return error(res, err);
			}
			else {
				return success(res, Model.trim(updated));
			}
		});
		
	})
}