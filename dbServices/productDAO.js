/**
 * Created by raghu on 4/22/2016.
 */
//moved to farmerDAO
var mongoSessionConnectURL = "mongodb://localhost:27017/amazonfresh";
var mongo = require('../routes/mongo');
var mysql = require('../routes/mysql');
var mysqlformat = require('mysql');

var redis = require("redis"),
    client = redis.createClient();

//To uncomment for dynamic pricing after the modules are placed
/*var amazon = require('amazon-product-api');
clientAmazon = amazon.createClient({
    awsId: "AKIAICIC7POTRIMQA7VA",
    awsSecret: "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",
    awsTag: "vaibhav.agrawal0289"
});*/

//TODO:akash->@raghu  we need to retrieve farmer_id like we did with productid
//TODO validation for corner cases yet to be done
exports.addProduct=function(farmeremail,name,price,description,image,callback){

    //var keyForRedis=farmer+":"+"farmerProducts";

    //changed
    var query="SET @product_id=0;SET @out_farmer_id='';SET @out_farmer_gen_id=0;SET @out_farmer_vendor='';CALL new_procedure(@product_id,@out_farmer_id,@out_farmer_gen_id,@out_farmer_vendor,'"+name+"','"+price+"','"+description+"','"+farmeremail+"'); SELECT @product_id;SELECT @out_farmer_id;SELECT @out_farmer_gen_id;SELECT @out_farmer_vendor";

    mysql.fetchData(function(err, results) {
        if (err)
        {
            json_responses = {statusCode : 401};
            callback(json_responses);
        }
        else
        {
            console.log(results.length);
            console.log(results);
            console.log(results[4][0].product_id);
            console.log(results[5][0].out_farmer_id);
            console.log(results[6][0].out_farmer_gen_id);
            console.log(results[7][0].out_farmer_vendor);

            var farmer=results[7][0].out_farmer_vendor;
            var keyForRedis=farmer+":"+"farmerProducts";
            //Removing the cache for the respective farmer when new product is added
            client.del(keyForRedis);

            //removing the cache for customerHomePage, as we are using pagination,
            //I am setting the keys for each page for redis, and we wont be getting 'page attribute' here
            //which is used for pagination
            //So randomly deleting first 5 keys from the cache
            for(var page=0;page<5;page++){
                var keyForRedisForAllProducts=page+":"+"allProducts";
                client.del(keyForRedisForAllProducts);
            }

            if(results.length > 0) {
                mongo.connect(mongoSessionConnectURL,function(mydb){
                    mydb.collection("productDetails").insert({
                                                                "productId":results[4][0].product_id,
                                                                "image":image,
                                                                "productName":name,
                                                                "productPrice":price,
                                                                "productDescription":description,
                                                                "farmerEmail":farmeremail,
                                                                "farmer_id":results[5][0].out_farmer_id,
                                                                "farmer_gen_id":results[6][0].out_farmer_gen_id,
                                                                "productVendor":results[7][0].out_farmer_vendor,
                                                                "status": "no",
                                                                "rnd_no":Math.floor(Math.random()*19),
                                                                "metadata":[results[4][0].product_id.toString(),
                                                                            name,
                                                                            results[7][0].out_farmer_vendor.toString()
                                                                           ],
                                                                "reviews":[]

                        },function(err,data){
                        console.log(image);
                        if(err)
                        {
                           throw "err";
                        }
                        else
                        {
                            json_responses = {statusCode : 200};
                            callback(json_responses);
                        }
                    });
                });

               // callback(results[1][0].product_id);
            } else {
                callback(null);
            }

        }
    }, query);
};

//TODO validation for corner cases


exports.getProducts=function(farmer,page,callback){



        mongo.connect(mongoSessionConnectURL,function(mydb){
            mydb.collection("productDetails").find({"productVendor":farmer},{"_id":0}).skip(parseInt(page*4)).limit(4).toArray(function(err,data){
                if(err)
                {
                    throw "error";
                }
                else
                {
                    if(data)
                    {   console.log(JSON.stringify(data));

                        //Setting the data in redis cache
                        //client.set(keyForRedis,JSON.stringify(data),function(){
                            json_responses = {statusCode :200,result:data};
                            callback(json_responses);
                       // });
                        /*json_responses = {statusCode :200,result:data};
                         callback(json_responses);*/
                    }
                }
            })
        });
    };

exports.allProducts=function(page,callback){
    //For competitive pricing
    //Since we need to change the Date in the amazon-api library commenting this code for now

    /*var amazonproductId="B013KTYFYO";
    clientAmazon.itemLookup({
        idType: 'UPC',
        itemId: amazonproductId,
        responseGroup: 'ItemAttributes,Offers,Images'
    }, function (err, results, response) {
        if (err) {
            console.log(err);
        } else {
            var amazonPrice=results[0].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
            amazonPrice=amazonPrice.substring(1);
            mongo.connect(mongoSessionConnectURL,function(mydb){
                mydb.collection("productDetails").update({"productId" : amazonproductId},{$set:{amazonPrice:amazonPrice}},function(err,data){
                    if(err)
                    {
                        throw "error";
                    }
                    else
                    {
                        intialCustomerHomePage(page,callback);
                    }
                })
            });
        }
    });*/

    //To remove when above code is uncommented
    intialCustomerHomePage(page,callback);
};


function intialCustomerHomePage(page,callback){
    var keyForRedis=page+":"+"allProducts";
    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection("productDetails").find({"status" : "yes"},{"_id":0}).sort({"rnd_no":1}).skip(parseInt(page*20)).limit(20).toArray(function(err,data){
            if(err)
            {
                throw "error";
            }
            else
            {
                if(data.length>0)
                {
                    client.set(keyForRedis,JSON.stringify(data),function() {
                        json_responses = {statusCode: 200, result: data};
                        callback(json_responses);
                    });
                }
                else
                {
                    console.log("empty result");
                    json_responses={statusCode:200,result:"",message:"no more products"};
                    callback(json_responses);
                }
            }
        })
    });
}

exports.searchProducts = function(key,page,callback){
    console.log("hell");
    var query = {status:"yes",metadata: new RegExp(key,'i')};
  mongo.connect(mongoSessionConnectURL,function(mydb){
      mydb.collection("productDetails").find(query,{"_id":0}).skip(parseInt(page*2)).limit(2).toArray(function(err,data){
          if(err)
          {
             throw "err";
          }
          else
          {
              if(data.length>0)
              {
                console.log(JSON.stringify(data)) ;
                  json_responses = {statusCode:200,result:data,defaultMsg:false};
                  callback(json_responses);
              }
              else
              {    json_responses={statusCode:200,defaultMsg:true};
                  callback(json_responses)
              }
          }
      });
  });
};

exports.productInfo=function(productid,callback){

    mongo.connect(mongoSessionConnectURL,function(mydb){
       mydb.collection('productDetails').find({"productId":parseInt(productid)}).toArray(function(err,data){
          if(err)
          {
              throw "err";
              //TODO handle response code while validation
          }
          else
          {
              if(data)
                {
                    console.log(JSON.stringify(data));
                    json_responses = {statusCode :200,result:data};
                    callback(json_responses);
                }
          }
       });
    });
};

exports.updateProductFarmerPage=function(productId,name,price,description,image,callback){

    //fetching farmers vendor name, otherwise alot of changes needs to be done to pass it from client side
    var query="select vendor from farmers where farmer_id=(select farmer_id from products where product_id=?)";
    var params = [productId];
    var fetchVendorName = mysqlformat.format(query, params);

    mysql.fetchData(function(err, results) {
        if (err) {
            throw err;
        } else {
            //Removing the key when farmer updates a product, so that updated products comes next time
            var keyForRedis=results[0].vendor+":"+"farmerProducts";
            client.del(keyForRedis);
            //removing the cache for customerHomePage, as we are using pagination,
            //I am setting the keys for each page for redis, and we wont be getting 'page attribute' here
            //which is used for pagination
            //So randomly deleting first 5 keys from the cache
            for(var page=0;page<5;page++){
                var keyForRedisForAllProducts=page+":"+"allProducts";
                client.del(keyForRedisForAllProducts);
            }
            //changed
            var query="UPDATE products set name=?, price=?, description=? where product_id=?";
            var params = [name,price,description,productId];
            var finalquery = mysqlformat.format(query, params);

            mysql.fetchData(function(err, results) {
                if (err)
                {
                    json_responses = {statusCode : 401};
                    callback(json_responses);
                }
                else
                {
                    mongo.connect(mongoSessionConnectURL,function(mydb){
                        mydb.collection("productDetails").update({productId:productId},{$set:{
                            "image":image,
                            "productName":name,
                            "productPrice":price,
                            "productDescription":description
                        }},function(err,data){
                            if(err)
                            {
                                throw "err";
                            }
                            else
                            {
                                json_responses = {statusCode : 200};
                                callback(json_responses);
                            }
                        });
                    });
                }
            }, finalquery);

        }
    }, fetchVendorName);




};

exports.getProuctAverageRating=function(callback){
    var querystring=[
        {$match:{"reviews.rating":{$ne:null}}},
        {$project:{"productName":1,"reviews.rating":1}},
        {$unwind:"$reviews"},
        {$group:{
            _id: "$productName",
            avgRating: { $avg: "$reviews.rating"}

        }}
    ];
    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection('productDetails').aggregate(querystring).toArray(function(err,data){
            if(err)
            {
                throw "err";
                //TODO handle response code while validation
            }
            else
            {
                if(data)
                {
                    console.log(JSON.stringify(data));
                    json_responses = {statusCode :200,result:data};
                    callback(json_responses);
                }
            }
        });
    });
};

exports.postReview = function(rating,comment,productId,customer,callback){
    console.log("inside DAO chek");
    mongo.connect(mongoSessionConnectURL,function(mydb){
        mydb.collection('productDetails').update({"productId":productId},{$push:{"reviews":{"customer":customer,"rating":parseInt(rating),"comment":comment}}},false,true,function(err,data){
          if(err)
          {
            throw err;
          }
          else
          {
                  console.log(data);
                json_responses = {statusCode :200};
                callback(json_responses);

          }
      });
  });
};


