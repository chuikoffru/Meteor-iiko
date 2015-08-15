Carts = new Mongo.Collection("carts");

Carts.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

Meteor.methods({
  addInCarts : function(cartId, item){
    delete item.$$hashKey;
    delete item._id;
    var exists = Carts.findOne({'cartId' : cartId});
    if(exists) {
      var ups = Carts.findOne({'cartId' : cartId, 'items.id' : item.id});
      if(ups) {
        //Уже есть такой товар в корзине
        Carts.update({'cartId' : cartId, 'items.id' : item.id}, {
          $inc : {
            'items.$.quantity' : +1,
            'items.$.totalPrice' : + item.price,
            total : + item.price
            }
        });
      } else {
        //Нет товара в корзине
        item.quantity = 1;
        item.totalPrice = item.price;
        Carts.update({'cartId' : cartId}, {
          $push : {
            items : item
          },
          $inc : {
            total : + item.price
          }
        });
      }
    } else {
      var data = {
        cartId : cartId,
        items : [],
        total : item.price
      }
      item.quantity = 1;
      item.totalPrice = item.price;
      data.items.push(item);
      Carts.insert(data);
    }
    return true;
  },
  removeItem : function(cartId, item) {
    var ups = Carts.findOne({'cartId' : cartId, 'items.id' : item.id, 'items.quantity' : {$gt : 1}});
    if(ups) {
      //Если есть этот товар в количестве больше 1 шт, то просто убираем одну шт.
      Carts.update({'cartId' : cartId, 'items.id' : item.id}, {
        $inc : {
          "items.$.quantity" : -1,
          total : - item.price
        }
      });
    } else {
      //Если же товар один, просто убираем его из корзины
      Carts.update({'cartId' : cartId, 'items.id' : item.id}, {
        $pull : {items : {id : item.id}},
        $inc : {
          total : - item.price
        }
      });
    }
  },
  clearAllCart : function() {
    if(Carts.remove({})){
      return true;
    } else {
      return false;
    }
  }
});
