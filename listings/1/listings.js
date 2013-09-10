var goatee = require(__dirname + "/../../goatee/1/goatee");
var mongoWrapper = require(__dirname + "/../../mongoWrapper/1/mongoWrapper");
var async = require(__dirname + "/../../async/1/node_modules/async");
var siteLib = require(__dirname + "/../../siteLib/1/siteLib");

var plugin = module.exports.plugin = function(args) {
	var self = this;
	
	self.options = args;
}

plugin.prototype.listingLayout = function(args, callback) {
	var self = this;
	
	mongoWrapper.getConnection(self.options.db, function(err, db) {
		if (err) { throw err; }
		
		db.collection("listings").find({}, { limit : 10 }).toArray(function(err, listings) {
			if (err) { throw err; }
			
			siteLib.getTemplate(__dirname + "/templates/listinglayout.html", function(err, html) {
				if (err) { throw err; }
				
				callback(null, goatee.fill(html, { listings : listings }));
			});
		});
	});
}

plugin.prototype.listingLayout2 = function(args, callback) {
	var self = this;
	
	mongoWrapper.getConnection(self.options.db, function(err, db) {
		if (err) { throw err; }
		
		db.collection("listings").find({}, { limit : 20 }).sort({ companySort : -1 }).toArray(function(err, listings) {
			if (err) { throw err; }
			
			siteLib.getTemplate(__dirname + "/templates/listinglayout.html", function(err, html) {
				if (err) { throw err; }
				
				callback(null, goatee.fill(html, { listings : listings }));
			});
		});
	});
}

plugin.prototype.listingLayout3 = function(args, callback) {
	var self = this;
	
	mongoWrapper.getConnection(self.options.db, function(err, db) {
		if (err) { throw err; }
		
		db.collection("listings").find({ companySort : { $gt : "d", $lt : "m" } }, { limit : 20 }).sort({ companySort : -1 }).toArray(function(err, listings) {
			if (err) { throw err; }
			
			siteLib.getTemplate(__dirname + "/templates/listinglayout.html", function(err, html) {
				if (err) { throw err; }
				
				callback(null, goatee.fill(html, { listings : listings }));
			});
		});
	});
}