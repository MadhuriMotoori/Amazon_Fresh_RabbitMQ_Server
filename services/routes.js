var logIn = require('../routes/logIn');
var signUp = require('../routes/signUp');
var farmer=require('../routes/farmer');
var customer=require('../routes/customer');
var order=require('../routes/order');
var admin = require('../routes/admin');


exports.handle_request = function(message, callback) {
    console.log("In handle_request"+ message.reqType);
    if(message.reqType === "adminLogin") {
        logIn.adminLogIn(message, callback);
    }
};

exports.signUp_handle_request = function(message, callback) {
    console.log("In handle_request "+ message.reqType);
    if(message.reqType === "checkCustomerSsn"){
        signUp.checkCustomerSSN(message, callback);
    } 
    if(message.reqType === "checkCustomerEmail"){
        signUp.checkCustomerEmail(message, callback);
    }
    if(message.reqType === "createCustomer"){
        signUp.createCustomer(message, callback);
    }
    if(message.reqType === "checkFarmerEmail"){
        signUp.checkFarmerEmail(message, callback);
    }
    if(message.reqType === "createFarmer"){
        signUp.createFarmer(message, callback);
    }
};

exports.products_handle_request=function(message,callback){
    console.log("in products_handle_request"+message.reqType);
    if(message.reqType === "displayAllProducts"){
        farmer.displayProducts(message,callback);
    }
    if(message.reqType ==="getProductInfo"){
        customer.getProductInfo(message,callback);
    }
    if(message.reqType === "getProductsByFarmer"){
        customer.getFarmerProducts(message,callback);
    }
    if(message.reqType === "searchProducts"){
        customer.searchProducts(message,callback);
    }
};

exports.customers_handle_request=function(message,callback){
    console.log("in customers_handle_request"+message.reqType);
    if(message.reqType === "postReview"){
        customer.postReview(message,callback);
    }
    if(message.reqType === "deleteCustomer"){
        customer.deleteCustomer(message,callback);
    }
};



exports.farmers_handle_request=function(message,callback){
    console.log("in farmers_handle_request"+message.reqType);
    if(message.reqType === "getFarmerDetails"){
        farmer.getFarmerDetails(message,callback);
    }
    if(message.reqType === "updateFarmerProfile"){
        farmer.updateFarmerProfile(message,callback);
    }
    if(message.reqType === "farmerAddProduct"){
        farmer.farmerAddProduct(message,callback);
    }
    if(message.reqType === "deleteProductFarmerPage"){
        farmer.deleteProductFarmerPage(message,callback);
    }
    if(message.reqType === "updateProductFarmerPage"){
        farmer.updateProductFarmerPage(message,callback);
    }
    if(message.reqType === "deleteAccountFarmerPage"){
        farmer.deleteAccountFarmerPage(message,callback);
    }
};

exports.orders_handle_request=function(message,callback) {
    console.log("in orders_handle_request" + message.reqType);
    if(message.reqType === "placeOrder"){
        order.placeOrder(message,callback);
    }
    if(message.reqType === "customerDetails"){
        order.customerDetails(message,callback);
    }
    if(message.reqType === "getBills"){
        order.getBills(message,callback);
    }
    if(message.reqType === "viewOrders"){
        order.viewOrders(message,callback);
    }
};

exports.admins_handle_request=function(message,callback) {
    console.log("in admins_handle_request" + message.reqType);
    if(message.reqType === "getCustomerRequests"){
        admin.getCustomerRequests(message, callback);
    }
    if(message.reqType === "getFarmerRequests"){
        admin.getFarmerRequests(message, callback);
    }
    if(message.reqType === "getProductReviews"){
        admin.getProductReviews(message, callback);
    }
    if(message.reqType === "getProductRequests"){
        admin.getProductRequests(message, callback);
    }
    if(message.reqType === "approveFarmer"){
        admin.approveFarmer(message, callback);
    }
    if(message.reqType === "approveCustomer"){
        admin.approveCustomer(message, callback);
    }
    if(message.reqType === "approveProduct"){
        admin.approveProduct(message, callback);
    }
    if(message.reqType === "getRevenuePerDay"){
        admin.getRevenuePerDay(message, callback);
    }
    if(message.reqType === "getAllFarmers"){
        admin.getAllFarmers(message, callback);
    }
    if(message.reqType === "getAllProducts"){
        admin.getAllProducts(message, callback);
    }
    if(message.reqType === "getAllCustomers"){
        admin.getAllCustomers(message, callback);
    }
    if(message.reqType === "getCustomerRideGraphDetails"){
        admin.getCustomerRideGraphDetails(message, callback);
    }
    if(message.reqType === "getDriverRideGraphDetails"){
        admin.getDriverRideGraphDetails(message, callback);
    }
    if(message.reqType === "getAreaRideGraphDetails"){
        admin.getAreaRideGraphDetails(message, callback);
    }
    if(message.reqType === "getCustomerBillDetails"){
        admin.getCustomerBillDetails(message, callback);
    }
    if(message.reqType === "getBillDetailsById"){
        admin.getBillDetailsById(message, callback);
    }
    if(message.reqType === "getAdminProfileDetails"){
        admin.getAdminProfileDetails(message, callback);
    }
    if(message.reqType === "getCustomerById"){
        admin.getCustomerById(message, callback);
    }
    if(message.reqType === "getFarmerById"){
        admin.getFarmerById(message, callback);
    }
    if(message.reqType === "getProductById"){
        admin.getProductById(message, callback);
    }
    if(message.reqType === "updateDeliveryStatus"){
        admin.updateDeliveryStatus(message, callback);
    }
};