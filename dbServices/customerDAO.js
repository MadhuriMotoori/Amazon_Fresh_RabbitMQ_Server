var mysqlformat = require('mysql');
var mysql = require('../routes/mysql');
var bcrypt   = require('bcrypt-nodejs');
exports.insertCustomerData= function(user, callback){
    var customer_id = "" + user.customer_id_1 + user.customer_id_2 + user.customer_id_3;
    var firstname = user.firstname;
    var lastname = user.lastname;
    var email = user.email;
    var password = user.password;
    var address1 = user.streetaddress;
    var address2 = user.streetaddressOptional;
    var city = user.city;
    var state = user.state;
    var zipcode = user.zipcode;
    var phone_number = user.phonenumber;
    var card_type = user.creditcardtype;
    var name_on_card = user.cardholdername;
    var card_num = user.creditcardno;
    var cvv = user.creditcardcvv;
    var expiry_date = user.customer_month_expiry + '/' + user.customer_year_expiry;
    var latitude = user.latitude;
    var longitude = user.longitude;
    var hash=bcrypt.hash(password,null,null,function(err,hash) {
        if (err) {
            console.log(err);
        }
        else {
            var insertquery = "insert into customers (customer_id, firstname, lastname, email, password, " +
                "address1, address2, city, state, zipcode, phone_number, card_type, name_on_card, card_num," +
                "cvv, expiry_date, latitude, longitude)" +
                "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?)";
            var params = [customer_id, firstname, lastname, email, hash, address1, address2,
                city, state, zipcode, phone_number, card_type, name_on_card,
                card_num, cvv, expiry_date, latitude, longitude];
            var finalquery = mysqlformat.format(insertquery, params);

            mysql.fetchData(function (err, results) {
                if (err) {
                    throw err;
                } else {
                    callback(results);
                }
            }, finalquery);
        }
    });
};

exports.validateCustomer = function(email, password, callback){
    var query = "select * from customers where email = ?";
    var params = [email];
    var finalquery = mysqlformat.format(query, params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if(results.length == 1){
                if(results[0].status == "yes"){
                    var hash1=results[0].password;
                    console.log(hash1);
                    bcrypt.compare(password,hash1 , function(err, result1) {
                    if(result1==true){
                        json_responses = {
                            statusCode : 200
                        };
                        callback(json_responses);
                    } else {
                        json_responses = {
                            statusCode: 401,
                            error: "password error"
                        };
                        callback(json_responses);
                    }
                });} else {
                    json_responses = {
                        statusCode: 401,
                        error: "Not approved"
                    };
                    callback(json_responses);
                }

            } else {
                json_responses = {
                    statusCode : 401,
                    error: "Email doesnot exist"
                };
                callback(json_responses);
            }

        }
    }, finalquery);
};
exports.getcustomerDetails = function(email, callback){
    var query = "select * from customers where email = ?";
    var params = [email];
    var finalquery = mysqlformat.format(query, params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if(results.length == 1){

                        callback(results);
                    } else {
                        json_responses = {
                            statusCode: 401,
                            error: "error no user"
                        };
                        callback(json_responses);
                    }
                }




    }, finalquery);
};

exports.deleteCustomer = function(email, callback){
    var query="update customers set deactivated='yes' where email='"+email+"'" ;
    mysql.fetchData(function(err,results){
        if(err) {
            json_responses = {
                statusCode: 401
            };
        }
        else{
            json_responses = {
                statusCode : 200
            };
        }
        callback(json_responses);
    },query);

};