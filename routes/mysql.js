var ejs= require('ejs');
var mysql = require('mysql');

//For Connection Pool
var queue = require('queue');
var connectionPool = new queue();

//adding comment for develop branch
//Put your mysql configuration settings - user, password, database and port
function getConnection(){
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'mad',
        database : 'amazonfreshdb',
        multipleStatements:'true',
        port	 : 3306
    });
    return connection;
}


function fetchData(callback,sqlQuery){

    console.log("\nSQL Query::" + sqlQuery);

    var connection=getConnection();


    connection.query(sqlQuery, function(err, rows, fields) {
        if(err){
            console.log("ERROR: " + err.message);
        }
        else
        {	// return err or result
            console.log("DB Results:"+JSON.stringify(rows));
            callback(err, rows);
        }
    });
    console.log("\nConnection closed..");
    connection.end();
}

//ConnectionPool

function fetchData2(callback,sqlQuery){

    console.log("\nSQL Query::" + sqlQuery);

    var connection=getPoolConnection();


    connection.query(sqlQuery, function(err, rows, fields) {
        if(err){
            console.log("ERROR: " + err.message);
        }
        else
        {	// return err or result
            console.log("DB Results:"+rows);
            callback(err, rows);
        }
    });
    console.log("\nConnection returned...");
    returnConnection(connection);
}

function createConnectionPool(num) {


    if(connectionPool != null) {
        connectionPool.start();
        for(var i =0; i< num; i++) {
            connectionPool.push(getConnection());
        }
    }
}

function getPoolConnection() {

    if(getPoolSize() <= 0) {
        updateConnectionPool(100);
    }
    connectionPool.reverse();
    connection = connectionPool.pop();
    connectionPool.reverse();
    return connection;
}

function getPoolSize() {

    if(connectionPool != null){
        return connectionPool.length;
    }
}

function updateConnectionPool(num) {
    if(connectionPool != null) {
        for(var i =0; i< num; i++) {
            connectionPool.push(getConnection());
        }
    }
}

function returnConnection(connectionObject){
    if(connectionPool != null) {
        connectionPool.push(connectionObject)
    }
}

function terminateConnectionPool() {
    if(connectionPool != null) {
        connectionPool.stop();
    }
}

exports.fetchData=fetchData;
exports.terminateConnectionPool = terminateConnectionPool;
exports.createConnectionPool = createConnectionPool;