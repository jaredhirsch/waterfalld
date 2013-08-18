var nano = require('nano')(process.env['COUCHDB_URL'] || 'http://localhost:5984'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log,
  db = nano.use('harfiles');

module.exports = {
  save: function(doc) {
    db.insert(doc, function(err,body) {
      if (err) { log('EMERGENCY', 'unable to insert doc: ' + err); }
      log('DEBUG', 'inserted doc into DB: ' + body);
    });
  }
}
