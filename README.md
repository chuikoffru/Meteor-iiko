#Библиотека для работы с API IIKO
Синхронизируйте коллекции товаров и категорий с сервером IIKO, отправляйте заказы прямо в терминал IIko. Библиотека написана по [документации IikoDelivery](http://api.iiko.ru/Instruct.aspx).
Пакетом создаются 3 коллекции: Products, Groups, Iiko. Первые два доступны на клиенте, последний используется только на сервере для хранения
токена, время его жизни, информации о компании, терминалах, и.т.д.

## Установка
```
meteor add chuikoff:iiko
```

##Использование
После установки, создайте  файл iiko.js в папке ./server, и добавьте следующий код:

<pre>
IIKO.initialize({
  login : 'YOUR_LOGIN',
  password : 'YOUR_PASSWORD'
});
</pre>

Теперь каждый раз при загрузке сервера, будет происходить инициализация, соединение с сервером IIKO,  и получение токена.
Для того, чтобы получить номенклатуру, и записать ее в коллекции Products и Groups, необходимо [вызвать метод syncNomenclature](http://docs.meteor.com/#/full/meteor_call), либо на сервере инициировать функцию IIKO.getNomenclature().

##Angular-Meteor
Я писал для себя на Angular-Meteor, поэтому покажу пример использования на Ангуляре.
<pre>
angular.module('chuikoffRu').controller('ProductsController', ['$scope', '$meteor', '$stateParams', function($scope, $meteor, $stateParams){

  $scope.categoryId = $stateParams.id;

  $meteor.subscribe("groups").then(function(){
    $scope.group = $meteor.object(Groups, {id : $stateParams.id}, false)
  });

  $meteor.autorun($scope, function() {
      if ($scope.getReactively('categoryId')) {
        $meteor.subscribe("getProductsByCategoryId", $scope.categoryId).then(function(){
          $scope.products = $meteor.collection(Products, false);
        });
      }
  });

  angular.module('chuikoffRu').controller('MenuController', ['$scope', '$meteor', function($scope, $meteor){
    $scope.categories = $meteor.collection(Groups, false).subscribe("groups");
  }]);
</pre>

В ProductsController получаем одну категорию и товары к ней, а в MenuController получаем все категории.
