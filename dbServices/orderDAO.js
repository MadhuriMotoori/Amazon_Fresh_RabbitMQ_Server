/**
 * Created by raghu on 4/23/2016.
 */
var mysql = require('../routes/mysql');
exports.placeOrder=function(customer_email,ar_farmerId,ar_productId,ar_price,ar_quantity,total_price,callback){
  console.log(customer_email+' '+ ar_farmerId+' '+ar_productId+' '+ ar_price+' '+ar_quantity+' '+total_price);

    var query = "set @order_id=0; call place_order(@order_id,'"+customer_email+"','"+ar_productId+"','"+ar_farmerId+"','"+ar_quantity+"','"+ar_price+"','"+total_price + "'); select @order_id";
 // var query="call PROC_TEST('"+customer_email+"','"+ar_productId+"','"+ar_farmerId+"','"+ar_quantity+"','"+ar_price+"')";
  console.log(query);
  mysql.fetchData(function(err,results){
      console.log(results);
      console.log(results[2][0].o_order_id);
      callback(JSON.stringify(results[2][0].o_order_id));
  },query);


};
exports.getBills=function(order_id,callback){
    console.log(order_id+"calling from bills");
    var query="select b.bill_id,t.trip_id ,o.order_id,o.product_id ,o.quantity,o.price,p.name from bills b,trips t,orders_products o,products p where o.order_id="+order_id+" and b.trip_id=t.trip_id and t.order_id=o.order_id and t.gen_farmer_id=o.gen_farmer_id and p.product_id=o.product_id";
    mysql.fetchData(function(err,results){
        console.log(results);
        callback(results);
    },query);
};
exports.viewOrders=function(customer_email,callback){
    var query="select order_id,order_status,order_placed_date  from customer_orders where customer_id=(select customer_id from customers where email='"+customer_email+"')";
    console.log(query);
    mysql.fetchData(function(err,results){
        console.log(results);
        callback(results);
    },query);

};