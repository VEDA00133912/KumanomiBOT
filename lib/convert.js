const { generate: generateGenhera } = require('genhera');
const { generate: generateCjp } = require('cjp');
const path = require('path');
const conversionData = require(path.join(__dirname, '..', 'data', 'settings', 'convert.json'));

function convertText(type, text) {
  const conversionFunctions = {
    'rune': () => convertUsingMap(text, conversionData.rune),
    'phoenicia': () => convertUsingMap(text, conversionData.phoenicia),
    'hieroglyphs': () => convertUsingMap(text, conversionData.hieroglyphs),
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

const typeNameMap = {
  rune: 'ルーン文字',
  phoenicia: 'フェニキア文字',
  hieroglyphs: 'ヒエログリフ',
  reverse: '逆読み',
  anagram: 'アナグラム',
  genhera: 'ﾒﾝﾍﾗ文生成',
  cjp: '怪しい日本語生成'
};

module.exports = { convertText, typeNameMap };
