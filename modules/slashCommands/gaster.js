const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
const { convertToGaster } = require('../../lib/gaster');
const { createEmbed } = require('../../lib/embed');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gaster')
    .setDescription('ガスター語に変換')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('変換するテキスト(英数字+記号のみ対応)')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(400)
    ),
  async execute(interaction) {
    const commandName = this.data.name;
    if (cooldown(commandName, interaction)) return;

    await interaction.deferReply({ ephemeral: true });

    try {
      const text = interaction.options.getString('text');

      const gasterText = convertToGaster(text);

      const embed = createEmbed(interaction)
        .setDescription('**ガスター語 変換結果**')
        .addFields(
          { name: '変換後', value: gasterText || 'なし' }
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        slashCommandError(interaction.client, interaction, error);
    }
  }
};
