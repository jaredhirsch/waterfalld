var forever = require('forever-monitor'),
  nodemailer = require('nodemailer'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log,
  loadConfig = require('./loadConfig'),
  cfgFile = process.env['CONFIG_FILE'] || './config/config.json',
  config = loadConfig(cfgFile),
  maxRestarts = config.maxRestarts;

// set up SES, SMTP, or Sendmail connection
if (config.mailService) {
  var mailTransport = nodemailer.createTransport(config.mailService.type, config.mailService.options);
  // set up the mail message: to, from, and subject prefix
  var cronMailOptions = config.mailOptions;
}
function mail(subj, msg) {
  if (!config.mailService) { return; }
  cronMailOptions.subject += subj;
  cronMailOptions.text = msg;
  mailTransport.sendMail(cronMailOptions);
}

var child = new (forever.Monitor)('index.js', {
  max: maxRestarts,
  silent: false,
  options: []
});
child.on('start', function() { log('INFO', 'forever-monitor starting wpt process') });
child.on('restart', function() { log('INFO', 'forever-monitor restarting wpt process') });
child.on('stop', function() { log('INFO', 'forever-monitor caught stop signal, shutting down wpt process.') })
child.on('error', function(err) {
  var msg = 'forever-monitor detected wpt process threw an error: ' + err;
  log('EMERGENCY', msg);
  mail('EMERGENCY: wpt daemon error', msg);
});
child.on('exit', function () {
  // TODO does this emit 'exit' under any other circumstances?
  log('INFO', 'forever-monitor detected wpt process has exited the max number of times (' + maxRestarts + '), exiting instead of restarting.');
  mail('INFO: wpt daemon exited', msg);
});

child.start();
