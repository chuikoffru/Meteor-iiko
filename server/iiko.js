/*
  author : Chuykov Konstantin
  email : chuikoff.ru@gmail.com
  Meta : Server side function
*/

var config = {
  lifetime : 600000, //10 минут
  host : 'https://iiko.biz:9900/api/0/',
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
  getNomenclature : function(){
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

        result.data.products.forEach(function(product){
          Products.upsert({id : product.id}, product);
        });

        Settings.update('settings', { $set: {
          revision : result.data.revision,
          uploadDate : result.data.uploadDate
        }});

        return {result : true};
    }
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
  syncNomenclature : function(){
     return IIKO.getNomenclature();
  }
});
