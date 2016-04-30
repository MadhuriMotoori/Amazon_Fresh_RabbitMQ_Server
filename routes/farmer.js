var farmer = require('../dbServices/farmerDAO');
var product = require('../dbServices/productDAO');

exports.displayProducts = function(msg,callback){
    product.allProducts(function(response){
        callback(null,response);
    });

};

exports.getFarmerDetails = function(msg,callback){
    farmer.getFarmer(msg.farmer_email, function(response){
        callback(null,response);
    });
};

exports.updateFarmerProfile=function(msg,callback){
    farmer.updateProfile(msg.farmer_email,msg.firstname,msg.lastname,msg.address1,msg.address2,msg.city
        ,msg.state,msg.zipcode,msg.phone_number, function(response){
            callback(null,response);
        });
};

exports.farmerAddProduct=function(msg,callback){

    product.addProduct(msg.farmer_email,msg.name,msg.price,msg.description,msg.image,function(response){
        callback(null,response);
    });
};

exports.deleteAccountFarmerPage=function(msg,callback){
    farmer.deleteAccountFarmerPage(msg.email,function(response){
        callback(null,response);
    });
};

exports.deleteProductFarmerPage=function(msg,callback){

    farmer.deleteProductFarmerPage(msg.productId,function(response){
        callback(null,response);
    });
};

exports.updateProductFarmerPage=function(msg,callback){

    
    product.updateProductFarmerPage(msg.productId,msg.name,msg.price,msg.description,msg.image,function(response){
        callback(null,response);
    });
};
