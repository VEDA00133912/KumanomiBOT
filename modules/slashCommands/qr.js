const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { isValidUrl } = require('../../lib/url');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qr')
    .setDescription('QRコードの生成を行います')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addStringOption(option =>
      option.setName('url')
        .setDescription('QRに変換したいURLを入力してください')
        .setRequired(true)
    ),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    await interaction.deferReply();
    try {
      const url = interaction.options.getString('url');

      if (!url || !isValidUrl(url)) {
        await interaction.editReply('<:error:1302169165905526805>　無効なURLが入力されました。正しいURLを入力してください。');
        return;
      }

      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=200x200`;

      const embed = createEmbed(interaction)
        .setTitle('<:check:1302169183110565958> QRコードにしました！')
        .addFields({ name: 'URL', value: url })
        .setImage(qrApiUrl);

      await interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
