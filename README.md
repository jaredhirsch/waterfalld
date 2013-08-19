waterfalld: globally distributed performance monitoring using webpagetest.

data flow: list of urls/browsers -> webpagetest -> HAR files & other JSON data -> document storage -> metrics yay.

it's a `node-cron` cronjob daemonized via the lovely `forever-monitor`.

a mozilla persona friday project, provoked by a conversation on [the mailing list](https://groups.google.com/forum/#!msg/mozilla.dev.identity/D59f9m72eyc/_ogjpnrFyZ8J).

Installing:
* `npm install`
* if you want to store webpagetest output using couchdb: install couch & run couch-setup.js to create the database
* if you're using the public webpagetest.org instance, request an api key

Running:
* specify your **api key** and other server configuration inside `config.json`
* specify the **urls** you want to test inside `urls.json`
* specify the **locations** (location/browser/os combinations) you want (webpagetest.org has [a list of all available locations](http://www.webpagetest.org/getLocations.php)) inside `locations.json`.

Storing test results:
* you can use the filesystem or couchdb without any extra work (see `/transport` for the files) 
* send data wherever you please by creating a custom transport adapter inside `/transport`, implementing the tiny `save(document, test_id)` API, and specifying the custom transport filename inside config.json.

license: apache 2.

pull requests welcome.

TODOs:
* big features:
  * rewrite the readme, lots of new stuff to document
  * add a transport for http (sending to another arbitrary web service)
  * figure out what option to pass to just get the third-party domain load time
  * actually get the data back out of storage & process it (weighted average of load time? run the HAR files through YSlow at command line?)
  * display the data (graphs, tables)
* code stuffs:
  * enable extra wpt options inside config file
  * make sure we can handle multiple runs properly
  * tests, dude. wtf.
  * move libs into a /lib folder
