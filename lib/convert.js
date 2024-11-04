const { generate: generateGenhera } = require('genhera');
const { generate: generateCjp } = require('cjp');
const runeMap = require('../data/settings/rune');

function convertText(type, text) {
  const conversionFunctions = {
    'rune': () => convertUsingMap(text, runeMap),
    'reverse': () => text.split('').reverse().join(''),
    'anagram': () => text.split('').sort(() => Math.random() - 0.5).join(''),
    'genhera': () => generateGenhera(text),
    'cjp': () => generateCjp(text),
  };

  return conversionFunctions[type] ? conversionFunctions[type]() : 'エラーが発生しました。';
}

function convertUsingMap(text, map) {
  return text.toUpperCase().split('').map(char => map[char] || char).join('');
}

module.exports = { convertText };
