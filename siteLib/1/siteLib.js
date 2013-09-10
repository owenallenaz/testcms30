var foreverDir = __dirname + "/../../forever/1/node_modules/forever";
var foreverExec = foreverDir + "/bin/forever";
var forever = require(foreverDir);
var express = require(__dirname + "/../../express/1/node_modules/express");
var fs = require("fs");
var exec = require("child_process").exec;

var siteLib = module.exports;

module.exports.startSite = function(site, callback) {
	callback = callback || function() {};
	
	exec(foreverExec + " start -a -l /sv/logs/" + site.name + "_forever.log -o /sv/logs/" + site.name + "_out.log -e /sv/logs/" + site.name + "_error.log " + site.serverJs, function(err, stdout, stderr) {
		if (err) throw err;
		callback(null, true);
	});
}

module.exports.stopSite = function(site, callback) {
	callback = callback || function() {}
	exec(foreverExec + " stop " + site.serverJs, function(err, stdout, stderr) {
		if (err) throw err;
		callback(null, true);
	});
}

module.exports.restartSite = function(site, callback) {
	callback = callback || function() {}
	exec(foreverExec + " restart " + site.serverJs, function(err, stdout, stderr) {
		if (err) throw err;
		callback(null, true);
	});
}

module.exports.getRunningSites = function(callback) {
	forever.list(null, function(err, sites) {
		if (sites == null) {
			sites = [];
		}
		
		callback(null, sites);
	});
}

module.exports.getServerConfig = function(callback) {
	fs.readFile(__dirname + "/../../../config.json", { encoding : "utf8" }, function(err, data) {
		if (err) { throw err; }
		
		var data = JSON.parse(data);
		
		callback(null, data);
	});
}

module.exports.getSites = function(callback) {
	siteLib.getServerConfig(function(err, config) {
		callback(null, config.sites);
	});
}

module.exports.getSite = function(name, callback) {
	siteLib.getSites(function(err, sites) {
		for(var i = 0; i < sites.length; i++) {
			if (sites[i].name == name) {
				callback(null, sites[i]);
			}
		}
	});
}

module.exports.boot = function(name, callback) {
	var returnData = {
		site : "",
		app : "",
	}
	
	returnData.app = express();
	siteLib.getSite(name, function(err, site) {
		returnData.site = site;
		
		fs.unlink(site.socket, function(err) {
			// ENOENT == file does not exist, which is the intent of unlink
			if (err && err.code != "ENOENT") { throw err; }
			
			returnData.app.listen(site.socket);
			console.log(name + " started");
			
			callback(null, returnData);
		});
	});
}

module.exports.getTemplate = function(path, callback) {
	fs.readFile(path, { encoding : "utf8" }, function(err, data) {
		callback(null, data);
	});
}