const invalidContentChecks = [
  { regex: /@everyone|@here/, error: '<:error:1282141871539490816> メッセージに@everyoneまたは@hereを含めることはできません。' },
  { regex: /<@&\d+>|<@!\d+>|<@?\d+>/, error: '<:error:1282141871539490816> メッセージにロールメンションまたはユーザーメンションを含めることはできません。' },
  { regex: /.{501,}/, error: '<:error:1282141871539490816> メッセージが500文字を超えています。' },
  { regex: /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com\/invite)|discordapp\.com\/invite|dsc\.gg|imgur\.com)\/[^\s]+/, error: '<:error:1282141871539490816> 招待リンクやimgurリンクを含むメッセージは送信できません。' },
  { regex: /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/, error: '<:error:1282141871539490816> メッセージにトークンを含めることはできません。' },
  { regex: /\|{4,}/, error: '<:error:1282141871539490816> メッセージに連続するスポイラーを含めることはできません。' }
];

async function validateMessageContent(interaction, message) {
  for (const check of invalidContentChecks) {
    if (check.regex.test(message)) {
      await interaction.editReply(check.error);
      return true; 
    }
  }
  return false; 
}

module.exports = { validateMessageContent };
