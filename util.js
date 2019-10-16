function leftpad(value, length) {
  let newValue = value.toString();
  while (newValue.length < length) {
    newValue = `0${newValue}`;
  }
  return newValue;
}

function compare(array1, array2) {
  if (array1.length !== array2.length) return false;
  let equal = true;
  for (let i = 0; i < array1.length; i += 1) {
    if (array1[i] !== array2[i]) {
      equal = false;
      break;
    }
  }
  return equal;
}

module.exports = {
  leftpad,
  compare,
};
