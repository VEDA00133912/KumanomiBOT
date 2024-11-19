const { SlashCommandBuilder } = require('discord.js');
const { convertText } = require('../../lib/convert');
const { validateMessageContent } = require('../../lib/invalidContent');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rune')
    .setDescription('文字列をルーン文字に変換します。')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください(ひらがな、カタカナ、アルファベット対応)')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(100)),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      const text = interaction.options.getString('text');
      if (await validateMessageContent(interaction, text)) return;

      await interaction.deferReply();

      const convertedText = convertText('rune', text);

      const embed = createEmbed(interaction)
        .setTitle(`ルーン文字に変換完了！`)
        .setDescription(`\`\`\`${convertedText}\`\`\``);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};