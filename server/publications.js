
Meteor.publish("settings", function(url){
  return Settings.findOne('settings');
});

Meteor.publish("groups", function(){
  return Groups.find();
});

Meteor.publish("getProductsByCategoryId", function(id){
  return Products.find({parentGroup : id});
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
