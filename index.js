// process envs you can set:
//
// CONFIG_FILE = path to config file matching format in config.json.sample.
//               any path compatible with fs.readFileSync works.
//
// URL_FILE = path to config file containing a JSON list of urls to test.
//
// BROWSER_FILE = path to config file containing a JSON list of locations/browsers to use
//
// LOG_LIBRARY = name of the library you use for logging. any package name or
//               library path compatible with require() works.
//               Note that logs pass a syslog level (eg, 'EMERGENCY', 'ALERT')
//               as a first argument, then a message as a second argument. Your
//               logger must accept multiple args (or concat them, whatever).

var fs = require('fs'),
  cronJob = require('cron').CronJob,
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log,
  WebPageTest = require('webpagetest'),
  cfgFile = process.env['CONFIG_FILE'] || './config/config.json',
  urlFile = process.env['URL_FILE'] || './config/urls.json',
  browserFile = process.env['BROWSER_FILE'] || './config/browsers.json',
  config = loadConfig(cfgFile);
  urls = loadConfig(urlFile),
  browsers = loadConfig(browserFile),
  storage = require('./transport/' + (config.transport || 'filesystem')),
  pendingTestsQ = [],
  wpt = new WebPageTest('www.webpagetest.org', config.apikey);

// TODO surely some library exists that thoughtfully loads a file
function loadConfig(configFile) {
  var configFileContents, parsedConfig;
  try {
    configFileContents = fs.readFileSync(configFile);
  } catch (e) {
    return log('EMERGENCY', 'unable to load config file: ' + e);
  }

  try {
    parsedConfig = JSON.parse(configFileContents)
  } catch (e) {
    return log('EMERGENCY', 'unable to parse config file: ' + e);
  }

  return parsedConfig;
}

// add urls X browsers onto pending queue.
function loadTests() {
  urls.forEach(function(url) {
    browsers.forEach(function(browser) {
      var args = [url, {location:browser}, onRunTest];
      log('DEBUG', 'loading onto pendingTestsQ: url: ' + url + ', browser: ' + browser);
      pendingTestsQ.push(args);
    });
  });

  start();
}

// TODO better name? runTests sounds too much like wpt's runTest.
function start() {
  if (pendingTestsQ.length) {
    var next = pendingTestsQ.shift();
    log('INFO', 'Sending a runTest call to the wpt server: ' + next[0] + ', ' + JSON.stringify(next[1]) + ', ' + next[2].name);
    wpt.runTest.apply(wpt, next);
    setTimeout(start, config.request_delay || 15000);
  } else {
    log('INFO', 'All pending tests have been sent to the wpt server.');
  }
}

// wpt.runTest callback
function onRunTest(err, data) {
  if (err) { return log('ERROR', 'failed to run test. error: ' + err); }
  if (data.statusCode != 200) { return log('ERROR', 'non-200 status code in runTest response: ' + data); }
  var id = data.data.testId;
  log('INFO', 'Notified by wpt server that job ' + id + ' has run. Now fetching HAR data.');
  wpt.getHARData(id, onGetHARData(id));
}

// wpt.getHARData callback
function onGetHARData(test_id) {
  return function(err, data) {
    if (err) { return log('ERROR', 'failed to get HAR data for test ' + test_id + '. error: ' + err); }
    log('INFO', 'HAR data received for test job ' + test_id + '. Now writing to disk.');
    // TODO enable other transports than just writing to local disk.
    storage.save(data, test_id);
  };
}

new cronJob(config.cron, function() {
  loadTests()
}, null, true, config.cronTZ);

process.on('uncaughtException', function(err) {
  console.log('ERROR', 'Caught uncaught exception at top level: ' + err);
});
