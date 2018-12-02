const bcrypt = require('bcrypt');
const {
  addUser,
  findUserByUsername,
  findUserById,
  conditionalUpdate,
} = require('./db');
const xss = require('xss');

async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}

async function findByUsername(username) {
  const result = await findUserByUsername(username);

  if (result) {
    return result;
  }

  return null;
}

async function findById(id) {
  if (typeof id !== 'string') {
    return null;
  }

  const result = await findUserById(id);

  if (result) {
    return result;
  }

  return null;
}

async function createUser(username, password, name) {
  const hashedPassword = await bcrypt.hash(password, 11);
  const user = {
    username,
    name,
    password: hashedPassword,
    applications: [],
  };
  const result = await addUser(user);

  return result;
}

async function updateUser(id, password, name) {
  if (!Number.isInteger(Number(id))) {
    return null;
  }

  const isset = f => typeof f === 'string' || typeof f === 'number';

  const fields = [
    isset(password) ? 'password' : null,
    isset(name) ? 'name' : null,
  ];

  let hashedPassword = null;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 11);
  }

  const values = [
    hashedPassword,
    isset(name) ? xss(name) : null,
  ];

  const result = await conditionalUpdate('users', id, fields, values);

  if (!result) {
    return null;
  }

  return result.rows[0];
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
  createUser,
  updateUser,
};
