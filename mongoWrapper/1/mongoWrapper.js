var mongodb = module.exports.mongodb = require(__dirname + "/../../mongodb/1/node_modules/mongodb");
var async = require(__dirname + "/../../async/1/node_modules/async");

var databases = module.exports.databases = {
	"rc_cms_dev" : {
		host : "192.168.50.1:27017",
		name : "site"
	}
}

var connect = function(database, callback) {
	var database = databases[database];
	mongodb.MongoClient.connect("mongodb://" + database.host + "/" + database.name, { 
		server : {
			poolSize : 5
		}
	}, function(err, db) {
		callback(err, db);
	});
}

module.exports.getConnection = async.memoize(connect);