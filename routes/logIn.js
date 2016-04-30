var customer = require('../dbServices/customerDAO');
var farmer = require('../dbServices/farmerDAO');
var admin = require('../dbServices/adminDAO');

function customerLogIn(req, res,next){
    var passport=require('passport');
    require('./passport')(passport);
    console.log(req.body.username);
    console.log(req.body);
    passport.authenticate('customerlogin', function(err,user, info) {
        console.log(user);
        if(err) {
            return next(err);
        }
        if(!user) {
            return res.redirect('/');
        }
        if(user.statusCode==401){
            return res.send(user);

        }
        else{
            req.login(user, {session:false}, function(err) {
                if(err) {
                    return next(err);
                }
                console.log(user);
                req.session.customer = user;
                console.log("session initialized");
                //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                return res.send("success");
            });
        }
    })(req, res, next);
}

function farmerLogIn(req, res,next){
    var passport=require('passport');
    require('./passport')(passport);
    console.log(req.body.username);
    console.log(req.body);
    passport.authenticate('Farmerlogin', function(err,user, info) {
        console.log(user);
        if(err) {
            return next(err);
        }

        if(!user) {
            return res.redirect('/');
        }
        if(user.statusCode==401){
            return res.send(user);

        }
        else{
            req.login(user, {session:false}, function(err) {
                if(err) {
                    return next(err);
                }
                console.log(user);
                req.session.farmer = user;
                console.log("session initialized");
                //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                return res.send("success");
            });
        }
    })(req, res, next);
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
exports.customerLogIn = customerLogIn;
exports.farmerLogIn = farmerLogIn;
exports.adminLogIn = adminLogIn;
