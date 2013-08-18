var forever = require('forever-monitor'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log,
  maxRestarts = 3; // TODO extract config file code so we can do "config.maxRestarts" here

var child = new (forever.Monitor)('index.js', {
  max: maxRestarts,
  silent: false,
  options: []
});

child.on('start', function() { log('INFO', 'forever-monitor starting wpt process') });
child.on('restart', function() { log('INFO', 'forever-monitor restarting wpt process') });
child.on('stop', function() { log('INFO', 'forever-monitor caught stop signal, shutting down wpt process.') })

child.on('error', function(err) {
  log('EMERGENCY', 'forever-monitor detected wpt process threw an error: ' + err);
  // TODO send email on exit
});
child.on('exit', function () {
  // TODO does this emit 'exit' under any other circumstances?
  log('INFO', 'forever-monitor detected wpt process has exited the max number of times (' + maxRestarts + '), exiting instead of restarting.');
  // TODO send email on exit
});

child.start();
