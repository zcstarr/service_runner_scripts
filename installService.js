// https://codeload.github.com/multi-geth/multi-geth/zip/v1.8.27 // address of our mgeth
const { createWriteStream, existsSync, writeFileSync } = require('fs');
const fs = require('fs');
const { exec } = require('child_process');
const { https, http } = require('follow-redirects');
const yauzl = require("yauzl");
const {promisify} = require('util');

const [,, url] = process.argv;
const ZIPPED_SERVICE_DIR = './services'
const ZIPPED_SERVICE = './services/mgeth.zip';
const SERVICE_BINARY = './services/mgeth';

/** 
 * TODO:
 * Probably breaks when the service files (./mgeth, ./mgeth.zip)
 * aren't pre-gereated, need to handle that.
*/


//cribbed for sake of demonstration
var download = promisify(function(url, dest, cb) {
  var file = createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
})

function loadService(zipURL, writeStream) {
  /*return new Promise((resolve) =>
    https.get(zipURL, response => {
      response.pipe(writeStream);
      response.on('end', () => resolve());
    })
  ).then(() => console.log('finished stream'));
  */
  fs.mkdirSync(ZIPPED_SERVICE_DIR, { recursive: true });
  return download(zipURL, ZIPPED_SERVICE)
}

function writeZipFile(zipURL, func) {
 // fs.mkdirSync(ZIPPED_SERVICE_DIR, { recursive: true });
//  const writeStream = createWriteStream(ZIPPED_SERVICE);
 // if (func && typeof func === 'function') func(ZIPPED_SERVICE);
 return loadService(zipURL)
//  return loadService(zipURL, writeStream);  
}

function downloadService(zipURL) {
  if(existsSync(ZIPPED_SERVICE)) {
    return writeZipFile(zipURL);
  } else {
    return writeZipFile(zipURL, writeFileSync);
  }
}

function unzipService() {
  return new Promise((resolve, reject)=> {
  yauzl.open(ZIPPED_SERVICE, {lazyEntries: true}, (err, zipfile) => {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on('entry', entry => {
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) throw err;
        readStream.on("end", () => zipfile.readEntry());
        readStream.pipe(createWriteStream(SERVICE_BINARY));
      });
    });
    console.log(`chmod +x ${SERVICE_BINARY} && rm ${SERVICE_BINARY}.zip`)
    zipfile.on('end', () => {
      exec(`chmod +x ${ZIPPED_SERVICE_DIR}`)
      exec(`chmod +x ${SERVICE_BINARY} && rm ${SERVICE_BINARY}.zip`)
      resolve(true)
  });
  });
});
}

async function installService(name, url) {
    await downloadService(url)
    await unzipService()
    return true
}

module.exports = {
    installService
}