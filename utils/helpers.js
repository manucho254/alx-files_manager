// Loading the crypto module in node.js
const sha1 = require('sha1');
const fs = require('fs');

function hashPassword(password) {
  return sha1(password);
}

function checkPath(directory) {
  return new Promise((resolve, reject) => {
    fs.access(directory, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory doesn't exist, create it
        fs.mkdir(directory, { recursive: true }, (err) => {
          if (err) {
            reject(err); // Failed to create directory
          } else {
            resolve(); // Directory created successfully
          }
        });
      } else {
        resolve(); // Directory already exists
      }
    });
  });
}

module.exports = { hashPassword, checkPath };
