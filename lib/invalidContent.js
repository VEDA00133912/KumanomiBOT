const invalidContentChecks = [
  { regex: /@everyone|@here/, error: '<:error:1299263288797827185> everyoneやhereを含めることはできません。' },
  { regex: /<@&\d+>|<@!\d+>|<@?\d+>/, error: '<:error:1299263288797827185> メンションを含めることはできません。' },
  { regex: /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com\/invite)|discordapp\.com\/invite|dsc\.gg|imgur\.com)\/[^\s]+/, error: '<:error:1299263288797827185> 招待リンクやimgurリンクを含むメッセージは送信できません。' },
  { regex: /https?:\/\/[^\s]+/, error: '<:error:1299263288797827185> 一般的なリンクを含むメッセージは送信できません。' },  // 追加部分
  { regex: /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/, error: '<:error:1299263288797827185> トークンを含めることはできません。' },
  { regex: /\|{4,}/, error: '<:error:1299263288797827185> 連続するスポイラーを含めることはできません。' }
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
