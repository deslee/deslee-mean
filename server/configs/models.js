var config = require('./')
var mongoose = require('mongoose');
var markdown = require( "markdown" ).markdown
mongoose.connect(config.mongo_url);

var Model = function(name, fields, format) {
	this.fields = fields;
	this.odm = mongoose.model(name, fields);
	this.format = format;
}

////
//  Trims a object's fields, so that its only fields 
//  are the ones specified in the model.
////
Model.prototype.trim = function(data) {
    var m = {}, fields = this.fields
    Object.keys(fields).forEach(function(key) {
    	if (data[key]) {
			m[key] = data[key];
		}
    });
    if (this.format) {
    	this.format(m);
    }
    return m;
}
////
// outgoing model
// if html is requested, convert to html first.
////
Model.prototype.out = function(data, req) {
	var m = this.trim(data);
	console.log(req.query);
	if (req.query.html) {
		m.text = markdown.toHTML(m.text);
	}
	return m;
}

////
// incoming model. just check the data
////
Model.prototype.in = function(data, req) {
    var m = this.trim(data);
    return m;
}

module.exports.Entry = new Model('Entry', {
	slug: String,
	text: String,
	title: String,
	date: Date,
});
