Orders = new Mongo.Collection("orders");

Meteor.methods({
  submitOrder:function(cartId, order, customer, terminals, payments){
    var items = Carts.findOne({cartId : cartId}).items;
    var data = {};
    data.organization = terminals[0].organizationId;
    data.deliveryTerminalId = terminals[0].deliveryTerminalId;
    data.customer = customer;
    data.cartId = cartId;
    data.order = order;
    data.order.items = items;
    data.order.date = moment().format('YYYY-MM-DD hh:mm:ss Z');
    data.order.address.city = terminals[0].address.split(',')[2];
    data.order.phone = customer.phone;
    data.order.paymentItems = {};
    data.order.paymentItems.sum = order.fullSum;
    data.order.paymentItems.paymentType = payments[0];
    data.order.paymentItems.isProcessedExternally = false;
    data.order.address.regionId = "22288a37-3690-4afd-8488-2a9c21881d52";
    var orderId = Orders.insert(data);

     if(Meteor.isServer && orderId){
       IIKO.addOrder(orderId);
     }

     return data;
  }
});
