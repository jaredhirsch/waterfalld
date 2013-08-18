var nano = require('nano')(process.env['COUCHDB_URL'] || 'http://localhost:5984'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log,
  db = nano.use('harfiles');

module.exports = {
  save: function(doc, id) {
    db.insert(doc, id, function(err,body) {
      (err) ? log('EMERGENCY', 'unable to insert doc: ' + id)
        : log('INFO', 'inserted doc into DB: ' + id)
    });
  }
}
