var siteLib = require(__dirname + "/../../../siteLib/1/siteLib");

siteLib.getSites(function(err, sites) {
	sites.forEach(function(val, i) {
		siteLib.startSite(val, function() {
			console.log(val.name + " started");
		});
	});
	
	console.log("Nodes started");
});