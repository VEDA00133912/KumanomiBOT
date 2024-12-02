const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const cooldown = require('../events/cooldown');
const contextMenuError = require('../errors/contextMenuError');
const { generateSuddenDeathText } = require('../../lib/totsu-shi');
const { validateMessageContent } = require('../../lib/invalidContent'); // validateMessageContentをそのまま使用
const { isInvalidContent, replyInvalidContent } = require('../../lib/contentCheck'); // contentCheckを追加でインポート
const { checkNewlinesAndReply } = require('../../lib/newline'); // 改行チェックを読み込み

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('突然の死ジェネレーター')
    .setType(ApplicationCommandType.Message)
    .setIntegrationTypes(0,1),
    
  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    const targetMessage = interaction.targetMessage; 

    // メッセージ内容の検証 (基本的なチェック)
    if (isInvalidContent(targetMessage)) {
      return await replyInvalidContent(interaction); // 無効な内容の場合エラーメッセージを送信
    }

    // 改行のチェック
    const hasNewlineError = await checkNewlinesAndReply(interaction, targetMessage.content);
    if (hasNewlineError) return;

    // 文字数が100以上の場合のチェック
    if (targetMessage.content.length > 50) {
      return await interaction.reply({
        content: '<:error:1302169165905526805> メッセージが50文字を超えています',
        ephemeral: true,
      });
    }

      const hasError = await validateMessageContent(interaction, targetMessage.content);
    if (hasError) return;

    try {
      await interaction.deferReply();

      const generatedText = generateSuddenDeathText(targetMessage.content);
      await interaction.editReply(generatedText);
    } catch (error) {
      await contextMenuError(interaction.client, interaction, error);
    }
  },
};