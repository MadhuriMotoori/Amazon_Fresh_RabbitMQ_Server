var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mysql = require('./mysql');
var customer = require('../dbServices/customerDAO');
var farmer = require('../dbServices/farmerDAO');
//var loginDatabase = "mongodb://localhost:27017/login";
module.exports = function(passport) {
    passport.use('customerlogin', new LocalStrategy(function (username, password, done) {
        process.nextTick(function () {

            customer.validateCustomer(username, password, function (response) {
                console.log(response);
                if (response.statusCode === 401) {
                    done(null, response);
                }
                else {
                    console.log(username);
                    done(null, username);
                }
            });

        });
    }));
    passport.use('Farmerlogin', new LocalStrategy(function (username, password, done) {
        var query = "select * from farmers where email='" + username + "'and password='" + password + "'";
        process.nextTick(function () {
            farmer.validateFarmer(username, password, function (response) {
                console.log(response);
                if (response.statusCode === 401) {
                    done(null, response);
                }
                else {
                    console.log(username);
                    done(null, username);
                }
            });
        });
    }));
};


