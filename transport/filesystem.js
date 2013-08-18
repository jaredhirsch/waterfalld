var fs = require('fs'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log;

module.exports = {
  save: function(doc, id) {
    fs.writeFile('./harfiles/' + id + '.har', doc, function(err) {
      (err) ? log('EMERGENCY', 'unable to write results file for test ' + id + '. error: ' + err)
        : log('INFO', 'HAR data written to disk for test job ' + id + '.')
    });
  }
};
