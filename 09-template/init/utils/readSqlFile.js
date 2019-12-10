const fs = require('fs');

function readSqlFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'binary', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = readSqlFile;
