var mysqlformat = require('mysql');
var mongo = require('../routes/mongo');
var mysql = require('../routes/mysql');
var mongoSessionConnectURL = "mongodb://localhost:27017/amazonfresh";

exports.validateAdmin = function(email, password, callback){
    var query = "select * from admin where email = ?";
    var params = [email];
    var finalquery = mysqlformat.format(query, params);
    
    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if(results.length == 1){
                    if(results[0].password == password){
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

exports.getCustomerRequests = function(page, callback){
    var query = "select * from customers where status ='no' order by customer_id asc limit " + parseInt(page* 10) + ", 10";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length >0){
            json_responses = {
                statusCode: 200,
                customers : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No pending customer approval requests"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getFarmerRequests = function(page, callback){
    var query = "select * from farmers where status ='no' order by farmer_id asc limit " + parseInt(page * 10) + ",10";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length >0){
            json_responses = {
                statusCode: 200,
                farmers : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No pending farmer approval requests"
            }
        }
        callback(json_responses);
    }, query);
};

exports.approveFarmer = function(farmer_id, callback){
    var query = "update farmers  set status=? where farmer_id = ?";
    var params =['yes', farmer_id];
    var finalquery = mysqlformat.format(query, params);
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else {
            json_responses = {
                statusCode: 200
            }
        }
        callback(json_responses);
    }, finalquery);
};

exports.approveCustomer = function(customer_id, callback){
    var query = "update customers  set status=? where customer_id = ?";
    var params =['yes', customer_id];
    var finalquery = mysqlformat.format(query, params);
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else {
            json_responses = {
                statusCode: 200
            }
        }
        callback(json_responses);
    }, finalquery);
};

exports.getRevenuePerDay=function(callback){
  var query="select date_format(date(order_placed_date),'%d-%m-%y') as order_placed_date,sum(price_total) as total_price from customer_orders where date(order_placed_date)>=date '2012-11-02' group by order_placed_date";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else {
            if(results){
                callback(results);
            }

        }

    },query);
};


exports.getProductRequests = function(page, callback){

    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection("productDetails").find({"status": "no"},{"_id":0}).skip(parseInt(page*4)).limit(4).toArray(function(err,data){
            if(err)
            {
                throw "error";
            }
            else
            {
                if(data.length == 0)
                {
                    json_responses = {
                        statusCode: 201,
                        message: "No pending product approval requests"
                    }
                    callback(json_responses);
                } else {
                    json_responses = {
                        statusCode: 200,
                        products : data
                    }
                    callback(json_responses);
                }
            }
        })
    });
};

exports.getProductReviews=function(id,callback){
    mongo.connect(mongoSessionConnectURL,function(mydb) {
        mydb.collection("productDetails").find({"productId": id}, {"_id": 0}).toArray(function (err, data) {
            if (err) {
                json_responses = {
                    statusCode: 401,
                    message: "Database error"
                }
            }
            else {
                if (data.length == 0) {

                    json_responses = {
                        statusCode: 201,
                        message: "No product available for given id"
                    }

                } else {
                    json_responses = {
                        statusCode: 200,
                        product: data
                    }

                }

            };
            callback(json_responses);
        });
    });
};

exports.approveProduct = function(product_id, callback){

    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection("productDetails").update({"productId": product_id},{$set:{"status": "yes"}}, function(err,data){
            if(err)
            {
                json_responses = {
                    statusCode: 401,
                    message: "Database error"
                }
            }
            else
            {
                if(data.nModified == 1){
                    json_responses = {
                        statusCode: 200
                    }
                }
            }
            callback(json_responses);

        })
    });
};


exports.getAllFarmers = function(page, callback){
    var query = "select * from farmers where status ='yes' order by farmer_id asc limit " + parseInt(page * 10) + ",10;";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length >0){
            json_responses = {
                statusCode: 200,
                farmers : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No farmers in the system"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getAllCustomers = function(page, callback){


    var query = "select * from customers where status ='yes' order by customer_id asc limit " + parseInt(page* 10) + ", 10;";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length >0){
            json_responses = {
                statusCode: 200,
                customers : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No customers in the system approval"
            }
        }
        callback(json_responses);
    }, query);
};



exports.getAllProducts = function(page, callback){

    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection("productDetails").find({"status": "yes"},{"_id":0}).skip(parseInt(page*4)).limit(4).toArray(function(err,data){
            if(err)
            {
                throw "error";
            }
            else
            {
                if(data.length == 0)
                {
                    json_responses = {
                        statusCode: 201,
                        message: "No products in the system"
                    }
                    callback(json_responses);
                } else {
                    json_responses = {
                        statusCode: 200,
                        products : data
                    }
                    callback(json_responses);
                }
            }
        })
    });
};


exports.getCustomerRideGraphDetails = function(customer_ssn, callback){
    var query = "select srclat, srclong, deslat, deslong from trips where order_id in (select order_id from customer_orders " +
        "where customer_id= "+ customer_ssn + ");";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No orders placed by this customer"
            }
        }
        callback(json_responses);
    }, query);
};

exports.getDriverRideGraphDetails = function(driver_ssn, callback){
    var query = "select srclat, srclong, deslat, deslong from trips where driver_id= '"+ driver_ssn + "'" ;
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No trips handled by this driver"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getAllRideGraphDetails = function(callback){
    var query = "select srclat, srclong, deslat, deslong from trips " ;
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No trips avaiable"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getAreaRideGraphDetails = function(area, callback){
    var query = "select srclat, srclong, deslat, deslong from trips where descity = '" + area + "'";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No orders placed from this city"
            }
        }
        callback(json_responses);
    }, query);
};



exports.getCustomerBillDetails = function(ssn, callback){
    var query = "select bill_id from bills where trip_id in(select trip_id from trips where" +
        " order_id in (select order_id from customer_orders where customer_id = "+ ssn + "))";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No bills available for this customer"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getBillDetailsById = function(id, callback){
    var query ="select b.bill_id, b.bill_date, t.trip_id ,o.order_id,o.product_id ,o.quantity,o.price,p.name, c.firstname as " +
        "customerfirstname, c.lastname as customerlastname, c.address1 as customeraddress1, c.address2 as customeraddress2, " +
        "c.city as customercity, c.zipcode as customerzipcode, f.firstname as farmerfirstname, f.lastname as farmerlastname," +
        " f.address1 as farmeraddress1,f.address2 as farmeraddress2, f.city as farmercity, f.zipcode as farmerzipcode from " +
        "bills b,trips t,orders_products o,products p, customers c, farmers f, customer_orders as co where bill_id = " + id + " and" +
        " b.trip_id=t.trip_id and t.order_id=o.order_id and t.gen_farmer_id=o.gen_farmer_id and p.product_id=o.product_id " +
        "and co.order_id =t.order_id and co.customer_id = c.customer_id and f.gen_id=t.gen_farmer_id ";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No bills available with this id"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getAdminProfileDetails = function(callback){
    var query = "select * from admin where email = 'admin@gmail.com' ";
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No admin available for the system"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getCustomerById = function(ssn, callback){
    var query = "select * from customers where customer_id = " + ssn;
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No customer available for given ssn"
            }
        }
        callback(json_responses);
    }, query);
};

exports.getFarmerById = function(ssn, callback){
    var query = "select * from farmers where farmer_id = " + ssn;
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.length > 0){
            json_responses = {
                statusCode: 200,
                results : results
            }
        } else if(results.length == 0){
            json_responses = {
                statusCode: 201,
                message: "No farmer available for given ssn"
            }
        }
        callback(json_responses);
    }, query);
};


exports.getProductById = function(id, callback) {
    mongo.connect(mongoSessionConnectURL, function (mydb) {
        mydb.collection("productDetails").find({"productId": id}, {"_id": 0}).toArray(function (err, data) {
            if (err) {
                json_responses = {
                    statusCode: 401,
                    message: "Database error"
                }
            }
            else {
                if (data.length == 0) {
                    json_responses = {
                        statusCode: 201,
                        message: "No product available for given id"
                    }

                } else {
                    json_responses = {
                        statusCode: 200,
                        product: data
                    }

                }

            };
            callback(json_responses);
        });
    });
};


exports.updateDeliveryStatus = function(id, callback){
    var query = "update customer_orders set order_status = 'DELIVERED' where order_id = " + id;
    mysql.fetchData(function(err, results){
        if(err){
            json_responses = {
                statusCode: 401,
                message: "Database error"
            }
        } else if(results.affectedRows == 1){
            json_responses = {
                statusCode: 200,

            }
        } else {
            json_responses = {
                statusCode: 201,
                message: "No order available for given id"
            }
        }
        callback(json_responses);
    }, query);
};