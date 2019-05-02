// https://codeload.github.com/multi-geth/multi-geth/zip/v1.8.27 // address of our mgeth
const { https } = require('follow-redirects');
const { createWriteStream, existsSync, writeFileSync } = require('fs');
const { exec } = require('child_process');
const yauzl = require("yauzl");

const [,, url] = process.argv;
const ZIPPED_SERVICE = './services/mgeth.zip';
const SERVICE_BINARY = './services/mgeth';

/** 
 * TODO:
 * Probably breaks when the service files (./mgeth, ./mgeth.zip)
 * aren't pre-gereated, need to handle that.
*/

function loadService(zipURL, writeStream) {
  return new Promise((resolve) =>
    https.get(zipURL, response => {
      response.pipe(writeStream);
      response.on('end', () => resolve());
    })
  );
}

function downloadService(zipURL) {
  if(existsSync(ZIPPED_SERVICE)) {
    const writeStream = createWriteStream(ZIPPED_SERVICE);
    return loadService(zipURL, writeStream);
  } else {
    const writeStream = createWriteStream(ZIPPED_SERVICE);
    writeFileSync(ZIPPED_SERVICE);
    return loadService(zipURL, writeStream);
  }
}

function unzipService() {
  yauzl.open(ZIPPED_SERVICE, {lazyEntries: true}, (err, zipfile) => {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on('entry', entry => {
      if (/\/$/.test(entry.fileName)) {
        zipfile.readEntry();
      } else {
        zipfile.openReadStream(entry, (err, readStream) => {
          if (err) throw err;
          readStream.on("end", () => zipfile.readEntry());
          readStream.pipe(createWriteStream(SERVICE_BINARY));
        });
      }
    });
    zipfile.on('end', () => exec(`chmod +x ${SERVICE_BINARY} && rm ${SERVICE_BINARY}.zip`));
  });
}

if (require.main === module) {
  downloadService(url).then(() => unzipService());
} else {
  module.exports = {
    downloadService,
    unzipService,
  };
}