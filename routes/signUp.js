var mysql = require('./mysql');
var customerDAO = require('../dbServices/customerDAO');
var farmerDAO = require('../dbServices/farmerDAO');

function checkCustomerEmail(msg, callback) {

    var email = msg.email;
    var query = "select * from customers where email='" + email + "'";
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length == 1) {
                json_responses = {
                    "statusCode" : 401,
                    "error" : "Email exists"
                };

            } else {
                json_responses = {
                    "statusCode" : 200,
                };

            }
            callback(null, json_responses);
        }
    }, query);

}

function checkCustomerSSN(msg, callback) {
    var ssn = msg.ssn;
    var query = "select * from customers where customer_id='" + ssn + "'";


        mysql.fetchData(function(err, results) {
            if (err) {
                throw err;
            } else {
                if (results.length == 1) {
                    json_responses = {
                        "statusCode" : 401,
                        "error" : "ssn exists"
                    };
                    callback(null, json_responses);
                } else {
                    json_responses = {
                        "statusCode": 200,
                    };
                    callback(null, json_responses);
                }

            }
        }, query);
}

function createCustomer(msg, callback){
    var user = msg.user;
    customerDAO.insertCustomerData(user, function(result) {
        if (result) {
            console.log("entered create customer");
            json_responses = {
                "statusCode": 200,
            }
            callback(null, json_responses);
        } else {
            json_responses = {
                "statusCode": 401,
            }
            callback(null, json_responses);
        }

    });
};

function checkFarmerEmail(msg, callback) {
    var email = msg.email;
    farmerDAO.checkFarmerEmail(email, function(response){
        callback(null, response);
    });
};

function createFarmer(msg, callback){
    var farmer = msg.farmer;
    var ssn = msg.ssn;
    var vendorname = msg.vendorname;
    //todo add all values are not null and undefined
    
    farmerDAO.getFarmerDetails(ssn, function(response){
        if(response){
            json_responses = {
                "statusCode" : 401,
                "error" : "ssn exists"
            };
            callback(null, json_responses);
        } else {
            farmerDAO.checkUniqueVendorName(vendorname, function(response){
                if(response){
                    json_responses = {
                        "statusCode" : 401,
                        "error" : "vendor name exists"
                    };
                    callback(null, json_responses);
                } else {
                    farmerDAO.insertFarmerData(farmer, function(result){
                        if(result){
                            json_responses = {
                                "statusCode" : 200
                            };
                            callback(null, json_responses);
                        } else {
                            json_responses = {
                                "statusCode" : 401,
                                "error" : "unexpected error"
                            };
                            callback(null, json_responses);
                        }
                    });
                }
                
            });
        }

    });
}

exports.checkCustomerEmail = checkCustomerEmail;
exports.checkCustomerSSN = checkCustomerSSN;
exports.createCustomer = createCustomer;
exports.checkFarmerEmail = checkFarmerEmail;
exports.createFarmer= createFarmer;
