// Loading the crypto module in node.js
const sha1 = require('sha1');

function hashPassword(password) {
  return sha1(password);
}
module.exports = { hashPassword };
