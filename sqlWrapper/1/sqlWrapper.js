var async = require(__dirname + "/../../async/1/node_modules/async");
var tedious = require(__dirname + "/../../tedious/1/node_modules/tedious");
var tedious_connection_pool = require(__dirname + "/../../tedious-connection-pool/1/node_modules/tedious-connection-pool");

var databases = {
	"crm_shell_30_dev" : { 
		userName : "admin",
		password : "rsbr220sql",
		server : "sv-sql-test-1.220office.local",
		options : {
			database : "crm_shell_30",
			rowCollectionOnRequestCompletion : true
		}
	}
}

var getPool = function(database, callback) {
	var pool = new tedious_connection_pool({
		max : 100
	}, databases[database]);
	callback(null, pool);
}

var getPoolMemo = async.memoize(getPool);

var connect = function(database, callback) {
	getPoolMemo(database, function(err, pool) {
		pool.requestConnection(function(err, connection) {
			callback(err, connection);
		});
	});
}

// exports
module.exports.tedious = tedious;
module.exports.tedious_connection_pool = tedious_connection_pool;
module.exports.getConnection = connect;