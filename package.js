Package.describe({
  name: 'chuikoff:iiko',
  version: '0.0.1',
  summary: 'API IIKO integration',
  git: 'https://github.com/chuikoffru/Meteor-iiko',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['http', 'mongo'], ['server', 'client']);
  api.use('chuikoff:image-saver', 'server');
  api.addFiles(['models/settings.js', 'server/iiko.js', 'server/startup.js', 'server/publications.js'], 'server');
  api.addFiles(['models/groups.js', 'models/products.js', 'models/carts.js'],['server', 'client']);
  //api.addFiles('client/iiko.js', 'client');
  api.export('IIKO', 'server');
  api.export(['Products', 'Groups', 'Carts'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('chuikoff:iiko');
  api.addFiles('iiko-tests.js');
});
