const { SlashCommandBuilder, ChannelType, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const { getWebhookClient } = require('../../lib/spoofing');
const { validateMessageContent } = require('../../lib/invalidContent');
const { checkPermissions } = require('../../lib/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spoofing')
    .setDescription('他のユーザーになりすましできるコマンド')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('メンションまたはユーザーIDでユーザーを指定します')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('送信するメッセージ')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(100))
    .addAttachmentOption(option =>
      option.setName('attachment')
        .setDescription('送信する画像'))
    .addStringOption(option =>
      option.setName('nickname')
        .setDescription('ニックネームを指定')
        .setMinLength(1)
        .setMaxLength(20)),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      if (interaction.channel.type === ChannelType.PublicThread || interaction.channel.type === ChannelType.PrivateThread) {
        return interaction.reply({ content: '<:error:1302169165905526805> スレッドではこのコマンドを実行できません。', ephemeral: true });
      }

      const requiredPermissions = [PermissionFlagsBits.ManageWebhooks];
      const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
      if (isMissingPermissions) return;

      await interaction.reply({ content: '<a:loading:1302169108888162334> メッセージ送信準備中...', ephemeral: true });

      const targetUser = interaction.options.getUser('target');
      const member = interaction.guild.members.cache.get(targetUser.id);
      const nickname = interaction.options.getString('nickname');
      const forbiddenWords = ['clyde', 'discord'];
      const displayName = nickname || (member?.nickname || targetUser.username);
      const hasForbiddenWords = forbiddenWords.some(word =>
        displayName.toLowerCase().includes(word)
      );

      if (hasForbiddenWords) {
        return interaction.editReply({ content: '<:error:1302169165905526805> ニックネームに使用できない単語が含まれています。' });
      }

      const message = interaction.options.getString('message');
      const attachment = interaction.options.getAttachment('attachment');

      const hasError = await validateMessageContent(interaction, message, commandName);
      if (hasError) return;

      const webhookClient = await getWebhookClient(interaction.channel, targetUser);
      const avatarURL = targetUser.displayAvatarURL({ format: null, size: 1024 });

      const options = {
        content: message,
        username: displayName,
        avatarURL: avatarURL,
        files: attachment ? [attachment] : []
      };

      await webhookClient.send(options);

      await interaction.editReply('<:check:1302169183110565958> メッセージを送信しました。');
    } catch (error) {
      console.error('Error sending webhook message:', error);
      await slashCommandError(interaction.client, interaction, error);
    }
  },
};