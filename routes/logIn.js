var customer = require('../dbServices/customerDAO');
var farmer = require('../dbServices/farmerDAO');
var admin = require('../dbServices/adminDAO');

exports.customerLogin_handle_request=function (msg,callback){
 customer.validateCustomer(msg.username,msg.password,function(response){
     callback(null,response);
 })
}
exports.farmerLogin_handle_request=function (msg,callback){
    console.log(msg);
    farmer.validateFarmer(msg.username,msg.password,function(response){
        callback(null,response);
    })
}

function adminLogIn(message, callback){
    admin.validateAdmin(message.email, message.password, function(response){
        //console.log("sending response");
        callback(null,response);
    });
}



exports.logout = function(req,res)
{
    req.session.destroy();
    res.redirect('/');
};
exports.adminLogIn = adminLogIn;
