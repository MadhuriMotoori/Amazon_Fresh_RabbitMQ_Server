var mysqlformat = require('mysql');
var mysql = require('../routes/mysql');
var mongoSessionConnectURL = "mongodb://localhost:27017/amazonfresh";
var mongo = require('../routes/mongo');
var bcrypt   = require('bcrypt-nodejs');
var redis = require("redis"),
    client = redis.createClient();

exports.checkFarmerEmail = function(email, callback){

    var query = "select * from farmers where email = ?";
    var params = [email];
    var finalquery = mysqlformat.format(query, params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length == 1) {
                json_responses = {
                        "statusCode" : 401,
                        "error" : "Email exists"
                    };
                    callback(json_responses);
                } else {
                    json_responses = {
                        "statusCode" : 200
                    };
                    callback(json_responses);
                }
            }
        }, finalquery);

};

exports.insertFarmerData = function(user, callback){
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
    var latitude = user.latitude;
    var longitude = user.longitude;
    var vendorname = user.vendorname;
    var hash=bcrypt.hash(password,null,null,function(err,hash) {
        if (err) {
            console.log(err);
        }
        else {
            var insertquery = "insert into farmers (farmer_id, firstname, lastname, email, password, " +
                "address1, address2, city, state, zipcode, phone_number, latitude, longitude, vendor)" +
                "values(?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?)";
            var params = [customer_id, firstname, lastname, email, hash, address1, address2,
                city, state, zipcode, phone_number, latitude, longitude, vendorname];
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

exports.getFarmerDetails = function(ssn, callback){
    var query = "select * from farmers where farmer_id= ?";
    var params= [ssn];
    var finalquery = mysqlformat.format(query,params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if(results.length == 1) {
                callback(results);
            } else {
                callback(null);
            }
        }
    }, finalquery);
};

exports.checkUniqueVendorName = function(vendorname, callback){
    var query = "select * from farmers where vendor= ?";
    var params= [vendorname];
    var finalquery = mysqlformat.format(query,params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            console.log("result length:" +  results.length);
            if(results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        }
    }, finalquery);
};

exports.validateFarmer = function(email, password, callback){
    var query = "select * from farmers where email = ?";
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
                    });
                }
                else {
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

exports.getFarmer = function(email, callback){
    var query = "select * from farmers where email = ?";
    var params = [email];
    var finalquery = mysqlformat.format(query, params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if(results.length == 1){
                json_responses = {
                    statusCode : 200,
                    farmer : results[0],
                };
                callback(json_responses);
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

exports.updateProfile=function(email,first_name,last_name,address1,address2,city,state,zipcode,phone_number,callback){
    var query = "update farmers set firstname=?,lastname=?,address1=?,address2=?,city=?,state=?,zipcode=?,phone_number=? where email=?";
    var params = [first_name,last_name,address1,address2,city,state,zipcode,phone_number,email];
    var finalquery = mysqlformat.format(query, params);

    mysql.fetchData(function(err, results) {
        if (err) {
            json_responses = {
                statusCode : 401
            };
            callback(json_responses);
        } else {
            json_responses = {
                statusCode : 200
            };
            callback(json_responses);
        }
    }, finalquery);
}

exports.deleteAccountFarmerPage=function(email,callback){

    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection("productDetails").remove({farmerEmail:email
        },function(err,data){
            if(err)
            {
                throw "err";
            }
            else
            {
                var query="CALL deleteFarmer('"+email+"')";

                mysql.fetchData(function(err, results) {
                    if (err) {
                        json_responses = {
                            statusCode : 401
                        };
                        callback(json_responses);
                    } else {
                        //removing the cache for customerHomePage, as we are using pagination,
                        //I am setting the keys for each page for redis, and we wont be getting 'page attribute' here
                        //which is used for pagination
                        //So randomly deleting first 5 keys from the cache
                        for(var page=0;page<5;page++){
                            var keyForRedisForAllProducts=page+":"+"allProducts";
                            client.del(keyForRedisForAllProducts);
                        }
                        json_responses = {
                            statusCode : 200
                        };
                        callback(json_responses);
                    }
                }, query);
            }
        });
    });

}

exports.addVideo= function(farmer,video,callback){
    mongo.connect(mongoSessionConnectURL,function(mydb){
       mydb.collection('farmerIntro').insert({"farmerEmail":farmer,"video":video},function(err,data){
          if(err)
          {
              json_responses = {
                  statusCode : 401
              };
              callback(json_responses);
          }
           else
          {
              json_responses = {
                  statusCode : 200
              };
              callback(json_responses);
          }
       });
    });
};

exports.getVideo = function(farmer,callback){
    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection('farmerIntro').find({"farmerEmail":farmer}).toArray(function(err,data){
           if(err)
           {
               json_responses = {
                   statusCode : 401
               };
               callback(json_responses);
           }
           else
           {
               if(data.length>0)
               {
                   json_responses = {
                       statusCode : 200,
                       result:data
                   };
                   callback(json_responses);
               }
               else
               {
                   json_responses = {
                       statusCode : 200,
                       isMediaPresent:false
                    };
                   callback(json_responses);

               }
           }
        });
    })
}

exports.deleteProductFarmerPage=function(productId,callback){

    //fetching farmers vendor name, otherwise alot of changes needs to be done to pass it from client side

    var query="select vendor from farmers where farmer_id=(select farmer_id from products where product_id=?)";
    var params = [productId];
    var finalquery = mysqlformat.format(query, params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            //Removing the key when farmer deletes a product, so that updated products comes next time
            var keyForRedis=results[0].vendor+":"+"farmerProducts";
            client.del(keyForRedis);
            //removing the cache for customerHomePage, as we are using pagination,
            //I am setting the keys for each page for redis, and we wont be getting 'page attribute' here
            //which is used for pagination
            //So randomly deleting first 5 keys from the cache
            for(var page=0;page<5;page++){
                var keyForRedisForAllProducts=page+":"+"allProducts";
                client.del(keyForRedisForAllProducts);
            }
            mongo.connect(mongoSessionConnectURL,function(mydb){
                mydb.collection("productDetails").remove({productId:productId
                },function(err,data){
                    if(err)
                    {
                        throw "err";
                    }
                    else
                    {
                        var query="CALL deleteProduct('"+productId+"')";

                        mysql.fetchData(function(err, results) {
                            if (err) {
                                json_responses = {
                                    statusCode : 401
                                };
                                callback(json_responses);
                            } else {
                                json_responses = {
                                    statusCode : 200
                                };
                                callback(json_responses);
                            }
                        }, query);
                    }
                });
            });
        }
    }, finalquery);

}



