const { SlashCommandBuilder, ChannelType } = require('discord.js');
const slashCommandError = require('../error/slashCommandError');
const cooldown = require('../events/cooldown');
const { getWebhookClient } = require('../lib/spoofing');
const { validateMessageContent } = require('../lib/invalidContent');
const { checkPermissions } = require('../lib/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spoofing')
    .setDescription('他のユーザーになりすましできるコマンド')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('メンションまたはユーザーIDでユーザーを指定します')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('送信するメッセージ')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('attachment')
        .setDescription('送信する画像'))
    .addStringOption(option =>
      option.setName('nickname')
        .setDescription('ニックネームを指定')),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      await interaction.reply({ content: '<a:loading:1259148838929961012> メッセージ送信準備中...', ephemeral: true });

      if (interaction.channel.type === ChannelType.PublicThread || interaction.channel.type === ChannelType.PrivateThread) {
        return interaction.editReply('<:error:1282141871539490816> スレッドではこのコマンドを実行できません。');
      }

      if (!checkPermissions(interaction)) {
        return interaction.editReply('<:error:1282141871539490816> botにWebhookの管理権限がありません。');
      }

      const targetUser = interaction.options.getUser('target');
      const message = interaction.options.getString('message');
      const attachment = interaction.options.getAttachment('attachment');
      const nickname = interaction.options.getString('nickname');
      const hasError = await validateMessageContent(interaction, message);
      if (hasError) return;

      const webhookClient = await getWebhookClient(interaction.channel, targetUser);
      const displayName = nickname || targetUser.username;
      const avatarURL = targetUser.displayAvatarURL({ format: null, size: 1024 });

      const options = {
        content: message,
        username: displayName,
        avatarURL: avatarURL,
        files: attachment ? [attachment] : []
      };

      await webhookClient.send(options);

      await interaction.editReply('<:check:1282141869387550741> メッセージを送信しました。');
    } catch (error) {
      console.error('Error sending webhook message:', error);
      await slashCommandError(interaction.client, interaction, error);
    }
  },
};
