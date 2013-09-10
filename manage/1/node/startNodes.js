var siteLib = require(__dirname + "/../../../siteLib/1/siteLib");

siteLib.getSites(function(err, sites) {
	sites.forEach(function(val, i) {
		siteLib.startNode(val.serverJs, function() {
			console.log(val.serverJs + " started");
		});
	});
	
	console.log("Nodes started");
});