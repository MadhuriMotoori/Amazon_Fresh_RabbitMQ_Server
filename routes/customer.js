
var product = require('../dbServices/productDAO');


exports.getProductInfo = function(msg,callback){

    product.productInfo(msg.product_id,function(response){
        callback(null,response);
    });
};

exports.getFarmerProducts = function(msg,callback){
    product.getProducts(msg.farmer_id,msg.page,function( response){
        console.log("rentered" + response);
        callback(null,response);
    });

};

exports.searchProducts = function(msg,callback){
    product.searchProducts(msg.search,msg.page,function(response){
       callback(null,response);
    });
};

exports.postReview = function(msg,callback){
    product.postReview(msg.productRating,msg.comment,msg.productId,msg.customer_email,function(response){
        callback(null,response);
    });
};

exports.deleteCustomer=function(msg,callback){

     customer.deleteCustomer(msg.email,function(response){
        callback(null, response);
     })
};