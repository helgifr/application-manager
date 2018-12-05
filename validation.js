const users = require('./users');

const invalidField = (s, maxlen) => {
  if (s !== undefined && typeof s !== 'string') {
    return true;
  }

  if (maxlen && s && s.length) {
    return s.length > maxlen;
  }

  return false;
};
const isEmpty = s => s != null && !s;

async function validateUser({ username, password, name }, patch = false) {
  const validationMessages = [];

  // can't patch username
  if (!patch) {
    const m = 'Username is required, must be at least three letters and no more than 32 characters';
    if (typeof username !== 'string' || username.length < 3 || username.length > 32) {
      validationMessages.push({ field: 'username', message: m });
    }

    const user = await users.findByUsername(username);

    if (user) {
      validationMessages.push({
        field: 'username',
        message: 'Username is already registered',
      });
    }
  }

  if (!patch || password || isEmpty(password)) {
    if (typeof password !== 'string' || password.length < 6) {
      validationMessages.push({
        field: 'password',
        message: 'Password must be at least six letters',
      });
    }
  }

  if (!patch || name || isEmpty(name)) {
    if (typeof name !== 'string' || name.length === 0 || name.length > 64) {
      validationMessages.push({
        field: 'name',
        message: 'Name is required, must not be empty or longar than 64 characters',
      });
    }
  }

  return validationMessages;
}

async function validateApplication({
  company,
  posName,
  date,
  state,
} = {}, patch = false) {
  const messages = [];

  if (!patch || company || isEmpty(company)) {
    if (typeof company !== 'string' || company.length === 0) {
      messages.push({
        field: 'company',
        message: 'Company name is required and must not be empty',
      });
    }
  }

  if (!patch || posName || isEmpty(posName)) {
    if (typeof posName !== 'string' || posName.length === 0) {
      messages.push({
        field: 'posName',
        message: 'Name of position is required and must not be empty',
      });
    }
  }

  if (!patch || date || isEmpty(date)) {
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
      messages.push({
        field: 'date',
        message: 'Date must be in format YYYY-MM-DD',
      });
    }
  }

  if (!patch || state || isEmpty(state)) {
    if (typeof state !== 'object' || state.length === 0) {
      messages.push({
        field: 'state',
        message: 'Ferli is required and must not be empty',
      });
    }
  }

  return messages;
}

module.exports = {
  validateUser,
  invalidField,
  validateApplication,
};
