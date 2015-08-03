Products = new Mongo.Collection("products");

Meteor.publish("products", function(url){
  return Products.find();
});
