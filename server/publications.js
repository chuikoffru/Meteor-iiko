Meteor.publish("groups", function(){
  return Groups.find({}, {fields : {
    isDeleted : 0, tags : 0, additionalInfo : 0
  }});
});

Meteor.publish("marketing", function(argument){
  return Marketing.find({}, {fields : {
    id : 1, name : 1
  }});
});

Meteor.publish("payments", function(argument){
  return Payments.find();
});

Meteor.publish("terminals", function(argument){
  return Terminals.find();
});

Meteor.publish("carts", function(cartId){
  return Carts.find({cartId : cartId});
});

Meteor.publish("getProductsByCategoryId", function(id){
  return Products.find({parentGroup : id}, {fields : {
    id : 1, name : 1, description : 1, price : 1, type : 1, weight : 1, images : 1, isIncludedInMenu : 1, order : 1, parentGroup : 1, code : 1
  }});
});

Meteor.publish("hotProducts", function(limit){
  return Products.find({
    price : {
      $gte : 100,
      $lte : 500
    }
  },{
    sort : {
      order : 1
    },
    limit : limit
  });
});
