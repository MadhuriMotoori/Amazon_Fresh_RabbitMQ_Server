var customer=require('../dbServices/customerDAO');
var order = require('../dbServices/orderDAO');
exports.placeOrder=function(msg,callback){
    order.placeOrder(msg.customer_email,msg.ar_farmerId,msg.ar_productId,msg.ar_price,msg.ar_quantity,msg.total_price,function(results){
        console.log("from orderjs"+results);
        callback(null,results);
    });
};
exports.customerDetails=function(msg,callback){
    customer.getcustomerDetails(msg.customer_email,function(response){
        callback(null,response);
    })
};

exports.getBills=function(msg,callback){
    order.getBills(msg.data,function(response){
        callback(null,response);
    })
};

exports.viewOrders=function(msg,callback){
    order.viewOrders(msg.customer_email,function(response){
        callback(null,response);
    })
}