var MongoClient = require('mongodb').MongoClient;


var optionvalues = {
    db:{
        numberOfRetries : 5
    },
    server: {
        auto_reconnect: true,
        poolSize : 40,
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    replSet: {},
    mongos: {}
};

function MongoPool(){}

var dbconn;

function initiatePool(url, callback){
    MongoClient.connect(url, optionvalues, function(err, db) {
        if (err) throw err;

        dbconn = db;
        connected = true;
        if(callback && typeof(callback) == 'function')
            callback(dbconn);
    });
    return MongoPool;
}

MongoPool.initiatePool = initiatePool;

function connect(url, callback){
    if(!dbconn){
        initiatePool(url, callback)
    }
    else{
        if(callback && typeof(callback) == 'function')
            callback(dbconn);
    }
}


MongoPool.connect = connect;


module.exports = MongoPool;


