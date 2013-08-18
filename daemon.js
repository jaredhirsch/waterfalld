var forever = require('forever-monitor'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log;

var child = new (forever.Monitor)('index.js', {
  max: 3,
  silent: false,
  options: []
});

child.on('error', function(err) {
  log('EMERGENCY', 'wpt process has exited with an error: ' + err);
  // TODO send email on exit
});
child.on('exit', function () {
  log('INFO', 'wpt process has exited after 3 restarts');
  // TODO send email on exit
});

child.start();
