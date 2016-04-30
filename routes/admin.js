var admin = require('../dbServices/adminDAO');

exports.getCustomerRequests = function(msg, callback){
    admin.getCustomerRequests(function(response){
        callback(null, response);
    });
};

exports.getFarmerRequests = function(msg, callback){
    admin.getFarmerRequests(function(response){
       callback(null, response);
    });
};

exports.getProductReviews=function(msg,callback){
    admin.getProductReviews(msg.productId,function(response){
        callback(null, response);
    });
};

exports.getProductRequests = function(msg, callback){
    admin.getProductRequests(function(response){
        callback(null, response);
    });
};

exports.approveFarmer = function(msg, callback){
    admin.approveFarmer(msg.farmer_id, function(response){
        callback(null, response);
    });
};

exports.approveCustomer = function(msg, callback){
    admin.approveCustomer(msg.customer_id, function(response){
        callback(null, response);
    });
};

exports.approveProduct = function(msg, callback){
    admin.approveProduct(msg.product_id, function(response){
        callback(null, response);
    });
};


exports.getRevenuePerDay=function(msg,callback){
    admin.getRevenuePerDay(function(response){
        callback(null, response);
    });
};

exports.getAllFarmers = function(msg, callback){
    admin.getAllFarmers( function(response){
        callback(null, response);
    });
};


exports.getAllProducts = function(msg, callback){
    admin.getAllProducts( function(response){
        callback(null, response);
    });
};


exports.getAllCustomers = function(msg, callback){
    admin.getAllCustomers( function(response){
        callback(null, response);
    });
};

exports.getCustomerRideGraphDetails = function(msg, callback){
    admin.getCustomerRideGraphDetails(msg.ssn, function(response){
        callback(null, response);
    });
};

exports.getDriverRideGraphDetails = function(msg, callback){
    admin.getDriverRideGraphDetails(msg.ssn, function(response){
        callback(null, response);
    });
};

exports.getAreaRideGraphDetails = function(msg, callback){
    admin.getAreaRideGraphDetails(msg.area, function(response){
        callback(null, response);
    });
};

exports.getCustomerBillDetails= function(msg, callback){
    admin.getCustomerBillDetails(msg.ssn, function(response){
        callback(null, response);
    });
};

exports.getBillDetailsById= function(msg, callback){
    admin.getBillDetailsById(msg.billId, function(response){
        callback(null, response);
    });
};

exports.getAdminProfileDetails= function(msg, callback){
    admin.getAdminProfileDetails(function(response){
        callback(null, response);
    });
};


exports.getCustomerById= function(msg, callback){
    admin.getCustomerById(msg.ssn, function(response){
        callback(null, response);
    });
};

exports.getFarmerById= function(msg, callback){
    admin.getFarmerById(msg.ssn, function(response){
        callback(null, response);
    });
};

exports.getProductById= function(msg, callback){
    admin.getProductById(msg.productId, function(response){
        callback(null, response);
    });
};

exports.updateDeliveryStatus= function(msg, callback){
    admin.updateDeliveryStatus(msg.orderId, function(response){
        callback(null, response);
    });
};