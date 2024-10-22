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

module.exports = { generateSuddenDeathText };
