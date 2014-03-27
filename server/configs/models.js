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
//  Trims a model's fields, so that its only fields 
//  are the ones specified in the original model construction.
////
Model.prototype.trim = function(data) {
    var m = {}, fields = this.fields
    Object.keys(fields).forEach(function(key) {
		m[key] = data[key];
    });
    if (this.format) {
    	this.format(m);
    }
    return m;
}

module.exports.Entry = new Model('Entry', {
	slug: String,
	text: String,
	title: String,
	date: Date,
}, function(entry) {
	entry.text = markdown.toHTML(entry.text);
});