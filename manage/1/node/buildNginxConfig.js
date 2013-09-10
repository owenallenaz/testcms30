var fs = require("fs");
var siteLib = require(__dirname + "/../../../siteLib/1/siteLib");
var goatee = require(__dirname + "/../../../goatee/1/goatee");

siteLib.getSites(function(err, sites) {
	fs.readFile(__dirname + "/templates/nginxConfigBase.html", { encoding : "utf8" }, function(err, data) {
		var test = goatee.fill(data, { sites : sites });
		
		fs.writeFile(__dirname + "/../../../../nginx.config", test);
		
		console.log("Config Created");
	});
});