Settings = new Mongo.Collection("iiko");

Meteor.publish("settings", function(url){
  return Settings.findOne('settings');
});
