/*
  author : Chuykov Konstantin
  email : chuikoff.ru@gmail.com
  Meta : Server side function
*/

var config = {
  lifetime : 600000, //10 минут
  host : 'https://iiko.biz:9900/api/0/',
  teenpng : ''
}
var uri = {
  auth : 'auth/access_token',
  organization : 'organization/list',
  terminal : 'deliverySettings/getDeliveryTerminals',
  nomenclature : 'nomenclature/'
}

IIKO = {
  initialize : function(settings) {
      //Устанавливаем конфигурации
      config.login = settings.login;
      config.password = settings.password;
      config.teenpng = settings.teenpng;

      ImageSaver.key = config.teenpng;

      //Проверяем истек ли срок токена
      if(!this.getMaxLifeTime()) {
        this.getToken();
      }
  },
  getTokenTimeActive : function ()  {
    lasttime = Settings.findOne('settings').lifetime;
    return lasttime + config.lifetime;
  },
  getMaxLifeTime : function () {
    return this.getTokenTimeActive > new Date().getTime();
  },
  setToken : function(token) {
    //Записываем новый токен
    Settings.update('settings', { $set : {
      lifetime : new Date().getTime(),
      token : token
    }});
    //Проверяем есть ли в базе организации, если нет, получаем и добавляем.
    if(!Settings.findOne('settings').companies) {
      this.getOrganizationList();
    }
    //Проверяем есть ли в базе терминалы, если нет, получаем и добавляем.
    if(!Settings.findOne('settings').terminals) {
      this.getTerminals();
    }
  },
  getOrganizationList: function() {
      token = Settings.findOne('settings').token;
      var result = HTTP.get(config.host + uri.organization, {
            params: {
              access_token: token
            }
      });
      if (result.error) {
          throw result.error;
      } else {
        Settings.update('settings', { $set: {companies : result.data}});
      }
  },
  getTerminals : function(){
    info = Settings.findOne('settings');
    var result = HTTP.get(config.host + uri.terminal, {
          params: {
            access_token: info.token,
            organization : info.companies[0].id
          }
    });
    if (result.error) {
        throw result.error;
    } else {
      Settings.update('settings', { $set: {terminals : result.data}});
    }
  },
  getNomenclatureProducts : function(){
    info = Settings.findOne('settings');
    var result = HTTP.get(config.host + uri.nomenclature + info.companies[0].id, {
          params: {
            access_token: info.token
          }
    });
    if (result.error) {
         return result.error;
    } else {
      if(result.data)
        result.data.products.forEach(function(product){
          Products.upsert({id : product.id}, product);
        });

        this.downloadProductsImages(_.pluck(result.data.products, 'images'));

        Settings.update('settings', { $set: {
          revision : result.data.revision,
          uploadDate : result.data.uploadDate
        }});

        return result.data.products;
    }
  },
  getNomenclatureGroups : function(){
    info = Settings.findOne('settings');
    var result = HTTP.get(config.host + uri.nomenclature + info.companies[0].id, {
          params: {
            access_token: info.token
          }
    });
    if (result.error) {
         return result.error;
    } else {
      if(result.data)
        result.data.groups.forEach(function(group){
          group.subCategories = _.where(result.data.groups, {parentGroup : group.id});
          Groups.upsert({id : group.id}, group);
        });

        this.downloadGroupsImages(_.pluck(result.data.groups, 'images'));

        Settings.update('settings', { $set: {
          revision : result.data.revision,
          uploadDate : result.data.uploadDate
        }});

        return result.data.groups;
    }
  },
  downloadProductsImages : function(products){
    var path = process.env.PWD + '/public/images/products/';
    if(products.length > 0) {
      products.forEach(function(images, index){
        if(images.length > 0) {
          _.each(images, function(image){
            ImageSaver.download(image.imageUrl, path + image.imageId + '.png', {
              width : 400
            }, function(){
              return console.log('Image ' + image.imageId + ' uploaded');
            });
          });
        }
      });
    }
  },
  downloadGroupsImages : function(groups){
    var path = process.env.PWD + '/public/images/categories/';
    if(groups.length > 0) {
      groups.forEach(function(images, index){
        if(images.length > 0) {
          _.each(images, function(image){
            ImageSaver.download(image.imageUrl, path + image.imageId + '.png', {
              width : 200, height : 124
            }, function(){
              return console.log('Image ' + image.imageId + ' uploaded');
            });
          });
        }
      });
    }
  },
  testImage : function(){
    var path = process.env.PWD + '/public/images/categories/';
    ImageSaver.download('http://docs.meteor.com/logo.png', path +  'test.png', {
      width : 200, height : 124
    }, function(){
      return console.log('Image test uploaded');
    });
  },
  getToken : function () {
      var result = HTTP.get(config.host + uri.auth, {
            params: {
              user_id: config.login,
              user_secret : config.password
      }});
      if (result.error) {
          throw result.error;
      } else {
        this.setToken(result.data);
      }
  }
};

Meteor.methods({
  syncCategories : function(){
     return IIKO.getNomenclatureGroups();
  },
  syncProducts : function(){
    return IIKO.getNomenclatureProducts();
  },
  testImage : function(){
    return IIKO.testImage();
  }
});
