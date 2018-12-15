const users = require('./users');

const { compare } = require('./util');

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

function validateProcess(process) {
  const possibleProcesses = [
    ['Bið athugun'],
    ['Neitun'],
    ['Viðtal'],
    ['Viðtal', 'Neitun'],
    ['Viðtal', 'Boð í starf'],
    ['Viðtal', 'Annað viðtal'],
    ['Viðtal', 'Annað viðtal', 'Neitun'],
    ['Viðtal', 'Annað viðtal', 'Boð í starf'],
  ];

  for (let i = 0; i < possibleProcesses.length; i += 1) {
    if (compare(possibleProcesses[i], process)) return true;
  }

  return false;
}

async function validateApplication({
  company,
  posName,
  date,
  process,
} = {}, patch = false) {
  const messages = [];

  if (!patch || company || isEmpty(company)) {
    if (typeof company !== 'string' || company.length === 0) {
      messages.push({
        field: 'company',
        message: 'Heiti á fyrirtæki er krafist og má ekki vera tómt',
      });
    }
  }

  if (!patch || posName || isEmpty(posName)) {
    if (typeof posName !== 'string' || posName.length === 0) {
      messages.push({
        field: 'posName',
        message: 'Stöðuheiti er krafist og má ekki vera tómt',
      });
    }
  }

  if (!patch || date || isEmpty(date)) {
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
      messages.push({
        field: 'date',
        message: 'Dagsetning Þarf að vera gild',
      });
    }
  }

  if (!patch || process || isEmpty(process)) {
    if (typeof process !== 'object' || process.length === 0 || !validateProcess(process)) {
      messages.push({
        field: 'process',
        message: 'Ferli er krafist og verður að vera gilt',
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
