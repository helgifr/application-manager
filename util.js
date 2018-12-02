function leftpad(value, length) {
  let newValue = value.toString();
  while (newValue.length < length) {
    newValue = `0${newValue}`;
  }
  return newValue;
}

module.exports = {
  leftpad,
};
