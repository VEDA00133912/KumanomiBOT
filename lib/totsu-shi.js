function validateContent(message) {
  const invalidContentChecks = [
    { regex: /@everyone|@here/, error: 'メッセージにeveryoneまたはhereを含めることはできません。' },
    { regex: /<@&\d+>|<@!\d+>|<@?\d+>/, error: 'メッセージにメンションを含めることはできません。' },
    { regex: /https?:\/\/[^\s]+/, error: 'リンクを含むメッセージは送信できません。' }, 
    { regex: /discord(?:\.gg|\.com\/invite)\/[^\s]+/, error: '招待リンクを含むメッセージは送信できません。' }, 
    { regex: /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/, error: 'メッセージにトークンを含めることはできません。' }
  ];

  for (const { regex, error } of invalidContentChecks) {
    if (regex.test(message)) {
      return error;
    }
  }
  return null;
}

function generateSuddenDeathText(str) {
  const count = Math.floor(countWidth(str) / 2) + 2;
  const plus = count > 15 ? 1 : 0;
  const up = '人'.repeat(count + plus);
  const under = '^Y'.repeat(count);
  return `＿${up}＿\n＞　${str.replace(/\n/g, '　＜\n＞　')}　＜\n￣${under}￣`;
}

function countWidth(str) {
  return Array.from(str).reduce((acc, char) => acc + (char.charCodeAt(0) <= 0xff ? 1 : 2), 0);
}

module.exports = { validateContent, generateSuddenDeathText };
