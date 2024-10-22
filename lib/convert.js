const { generate: generateGenhera } = require('genhera');
const { generate: generateCjp } = require('cjp');
const path = require('path');
const conversionData = require(path.join(__dirname, '..', 'data', 'settings', 'convert.json'));

function getInvalidReason(text) {
  const prohibitedPatterns = [
    { regex: /^<@!?(\d+)>$/, message: 'メンションが含まれているため、変換できません。' }, 
    { regex: /^<@&(\d+)>$/, message: 'ロールメンションが含まれているため、変換できません。' }, 
    { regex: /(https?:\/\/)?(www\.)?(discord\.(gg|com|app\.com)\/invite\/\w+)/g, message: 'Discord招待リンクが含まれているため、変換できません。' }, 
    { regex: /(https?:\/\/[^\s]+)/g, message: 'リンクが含まれているため、変換できません。' }, 
    { regex: /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g, message: 'トークンが含まれているため、変換できません。' }, 
    { regex: /@everyone|@here/, message: '@everyone または @here が含まれているため、変換できません。' },
  ];
  if (text.length > 400) {
    return 'テキストが400文字を超えているため、変換できません。';
  }

  for (const pattern of prohibitedPatterns) {
    if (pattern.regex.test(text)) {
      return pattern.message;
    }
  }
  return null;
}

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

module.exports = { getInvalidReason, convertText, typeNameMap };
