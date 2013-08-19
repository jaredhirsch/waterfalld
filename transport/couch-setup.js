var nano = require('nano')(process.env['COUCHDB_URL'] || 'http://localhost:5984'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log;

// TODO only try to create if it doesn't exist
nano.db.create('harfiles', function(err, body, header) {
  if (err == 'Error: The database could not be created, the file already exists.') {
    log('INFO', '"harfiles" couch database already exists');
  } else if (err) {
    log('EMERGENCY', 'Unable to create "harfiles" couch database: ' + err);
  } else { 
    log('INFO', 'Created "harfiles" couch database');
  }
});
