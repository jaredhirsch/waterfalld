var nano = require('nano'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log,
  server = nano(process.env['COUCHDB_URL'] || 'http://localhost:5984'),
  db = server.use('harfiles');

module.exports = {
  save: function(doc) { db.insert(doc, function(err,body) {
    if (err) { log('EMERGENCY', 'unable to insert doc: ' + err); }
    log('DEBUG', 'inserted doc into DB: ' + body);
  });
}
