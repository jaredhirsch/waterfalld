var nano = require('nano'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log,

// TODO only try to create if it doesn't exist
nano.db.create('harfiles', function(err, body) {
  if (err) { return log('EMERGENCY', 'Unable to create "harfiles" couch database: ' + err); }
  log('INFO', 'Created "harfiles" couch database');
});
