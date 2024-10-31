const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const crypto = require('crypto');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hash')
    .setDescription('テキストをハッシュ化します。')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('ハッシュ化したいテキスト')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(400)),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      await interaction.deferReply({ ephemeral: true });
      const text = interaction.options.getString('text');
      const hash = crypto.createHash('sha256').update(text).digest('hex');

      const embed = new EmbedBuilder()
        .setDescription(`ハッシュ化しました！\n\`\`\`${hash}\`\`\``)
        .setColor('#febe69')
        .setFooter({ text: 'Kumanomi | hash', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
