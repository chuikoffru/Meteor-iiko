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
  api.addFiles(['server/iiko.js'],['server']);
  //api.addFiles(['client/iiko.js'],['client']);
  api.addFiles(['models/groups.js', 'models/products.js', 'models/settings.js'], 'server');
  api.export('IIKO', ['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('chuikoff:iiko');
  api.addFiles('iiko-tests.js');
});
