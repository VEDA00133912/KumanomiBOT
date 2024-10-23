const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qr')
    .setDescription('QRコードの生成を行います')
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

      if (!url) {
        await interaction.editReply('<:error:1282141871539490816>　QRコードに変換したいURLを入力してください。');
        return;
      }

      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=200x200`;

      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setTitle('<:verify:1298523085678448640> QRコードにしました！')
        .addFields({ name: 'URL', value: url })
        .setTimestamp()
        .setFooter({ text: 'Emubot | qr', iconURL: interaction.client.user.displayAvatarURL() })
        .setImage(qrApiUrl);

      await interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};