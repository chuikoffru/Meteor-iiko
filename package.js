Package.describe({
  name: 'chuikoff:iiko',
  version: '0.0.1',
  summary: 'API IIKO integration',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('iiko.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('chuikoff:iiko');
  api.addFiles('iiko-tests.js');
});
