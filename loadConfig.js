
var fs = require('fs'),
  log = process.env['LOG_LIBRARY'] ? require(process.env['LOG_LIBRARY']) : console.log;

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

module.exports = loadConfig;
