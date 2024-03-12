// Loading the crypto module in node.js
const crypto = require('crypto');

function hashPassword(password) {
  // creating hash object
  const hash = crypto.createHash('sha1');
  // passing the data to be hashed
  const data = hash.update(password, 'utf-8');

  // return hash password
  return data.digest('hex');
}

module.exports = { hashPassword };
