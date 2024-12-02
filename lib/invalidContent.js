const invalidContentChecks = [
  { regex: /@everyone|@here/, error: '<:error:1299263288797827185> everyoneやhereを含めることはできません。' },
  { regex: /<@&\d+>|<@!\d+>|<@?\d+>/, error: '<:error:1299263288797827185> メンションを含めることはできません。' },
  { regex: /(?:https?:\/\/)?(?:discord\.(?:gg|com|me|app)(?:\/|\\)invite(?:\/|\\)?|discord\.(?:gg|me)(?:\/|\\)?)[a-zA-Z0-9]+/, error: '<:error:1299263288797827185> 招待リンクを含むメッセージは送信できません。' },
  { regex: /https?:\/\/[^\s]+/, error: '<:error:1299263288797827185> リンクを送信することはできません。' },
  { regex: /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/, error: '<:error:1299263288797827185> トークンを含めることはできません。' },
  { regex: /\|{4,}/, error: '<:error:1299263288797827185> 連続するスポイラーを含めることはできません。' },
  { regex: /(discord\.com|discord\.gg|invite|https|http)/i, error: '<:error:1299263288797827185> リンクを送信することはできません。' }
];

async function validateMessageContent(interaction, message, commandName) {
  for (const check of invalidContentChecks) {
    if (check.regex.test(message)) {
      if (commandName === 'spoofing') {
        await interaction.editReply({ content: check.error, ephemeral: true });
      } else {
        await interaction.reply({ content: check.error, ephemeral: true });
      }
      return true;
    }
  }
  return false;
}

module.exports = { validateMessageContent };
