//super simple rpc server example
//adding 
var amqp = require('amqp')
	, util = require('util');

var routefile = require('./services/routes')
var logIn=require('./routes/logIn')
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			routefile.handle_request(message, function(err,res){

				console.log("response values"  + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});


cnn.on('ready', function(){
	console.log("listening on signup_queue");

	cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			routefile.signUp_handle_request(message, function(err,res){

				console.log("response values"  + JSON.stringify(res));
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on products_queue");

	cnn.queue('products_queue', function(q){
		console.log("products queue  called");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			routefile.products_handle_request(message, function(err,res){

				console.log("response values"  + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});


cnn.on('ready', function(){
	console.log("listening on customers_queue");

	cnn.queue('customers_queue', function(q){
		console.log("products queue  called");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			routefile.customers_handle_request(message, function(err,res){

				console.log("response values"  + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
cnn.on('ready', function(){
	console.log("listening on orders_queue");

	cnn.queue('orders_queue', function(q){
		console.log("orders queue  called");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			routefile.orders_handle_request(message, function(err,res){

				console.log("response values"  + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
cnn.on('ready', function(){
	console.log("listening on orders_queue");

	cnn.queue('farmers_queue', function(q){
		console.log("farmers queue  called");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			routefile.farmers_handle_request(message, function(err,res){

				console.log("response values"  + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on orders_queue");

	cnn.queue('admin_queue', function(q){
		console.log("admins queue  called");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			routefile.admins_handle_request(message, function(err,res){

				console.log("response values"  + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
	cnn.on('ready', function(){
		console.log("listening on customerslogin_queue");

		cnn.queue('customerLogin_queue', function(q){
			console.log("customerLogin queue  called");
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				logIn.customerLogin_handle_request(message, function(err,res){

					console.log("response values"  + res);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});	
});
cnn.on('ready', function(){
	console.log("listening on farmers login queue");

	cnn.queue('farmerLogin_queue', function(q){
		console.log("farmerLogin queue  called");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			logIn.farmerLogin_handle_request(message, function(err,res){

				console.log("response values"  + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});