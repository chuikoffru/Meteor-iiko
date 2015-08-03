Groups = new Mongo.Collection("groups");

Meteor.publish("groups", function(url){
  return Groups.find();
});
