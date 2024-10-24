const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const { getWebhookClient } = require('../../lib/spoofing');
const { validateMessageContent } = require('../../lib/invalidContent'); 

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

      await interaction.reply({ content: '<a:loading:1259148838929961012> メッセージ送信準備中...', ephemeral: true });

      if (interaction.channel.type === ChannelType.PublicThread || interaction.channel.type === ChannelType.PrivateThread) {
        return interaction.editReply('<:error:1282141871539490816> スレッドではこのコマンドを実行できません。');
      }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageWebhooks)) {
      return interaction.reply({ content: '<:error:1282141871539490816> BOTにウェブフックを管理する権限がありません。', ephemeral: true });
    }

      const targetUser = interaction.options.getUser('target');
      const message = interaction.options.getString('message');
      const attachment = interaction.options.getAttachment('attachment');
      const nickname = interaction.options.getString('nickname');
      const member = interaction.guild.members.cache.get(targetUser.id); 
      const hasError = await validateMessageContent(interaction, message, commandName);
      if (hasError) return;

      const webhookClient = await getWebhookClient(interaction.channel, targetUser);
      
      const displayName = nickname || (member?.nickname || targetUser.displayName);
      const avatarURL = targetUser.displayAvatarURL({ format: null, size: 1024 });

      const options = {
        content: message,
        username: displayName,
        avatarURL: avatarURL,
        files: attachment ? [attachment] : []
      };

      await webhookClient.send(options);

      await interaction.editReply('<:verify:1298523085678448640> メッセージを送信しました。');
    } catch (error) {
      console.error('Error sending webhook message:', error);
      await slashCommandError(interaction.client, interaction, error);
    }
  },
};
