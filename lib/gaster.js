const { charMap } = require('../data/settings/gaster');

function convertToGaster(input) {
  return input
    .split('')
    .map(char => charMap[char] || char) 
    .join('');
}

module.exports = { convertToGaster };