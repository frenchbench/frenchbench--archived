const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function newUuid() {
  return v4();
}

async function passwordHash(password, saltRounds = 10) {
  return bcrypt.hash(password, saltRounds);
}

async function passwordVerify(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

async function tokenCreate(payload, { signKey, expiry }) {
  const token = jwt.sign(payload, signKey, { expiresIn: expiry });
  console.log('tokenCreate', token);
  return token;
}

async function tokenVerify(token, { signKey }) {
  const decoded = await jwt.verify(token, signKey);
  console.log('tokenVerify', decoded);
  return decoded;
}

module.exports = {
  newUuid,
  passwordHash,
  passwordVerify,
  tokenCreate,
  tokenVerify,
}
