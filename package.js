Package.describe({
  name: 'chuikoff:iiko',
  version: '0.0.2',
  summary: 'API IIKO integration',
  git: 'https://github.com/chuikoffru/Meteor-iiko',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['http', 'mongo'], ['server', 'client']);
  api.use('chuikoff:image-saver', 'server');
  api.addFiles(['models/settings.js', 'server/iiko.js', 'server/startup.js', 'server/publications.js'], 'server');
  api.addFiles(['models/orders.js', 'models/groups.js', 'models/products.js', 'models/carts.js', 'models/marketing.js', 'models/payments.js', 'models/terminals.js'],['server', 'client']);
  api.export('IIKO', 'server');
  api.export(['Products', 'Groups', 'Carts', 'Marketing', 'Payments', 'Terminals', 'Orders'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('chuikoff:iiko');
  api.addFiles('iiko-tests.js');
});
