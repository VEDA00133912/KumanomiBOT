const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { validateContent, generateSuddenDeathText } = require('../../lib/totsu-shi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('totsu-shi')
    .setDescription('突然の死ジェネレーターです')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('生成する内容')
        .setRequired(true)
        .setMinLength(1)  
        .setMaxLength(100) 
    ),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    try {
      await interaction.deferReply();

      const input = interaction.options.getString('content');

      const validationError = validateContent(input);
      if (validationError) {
        await interaction.editReply(validationError);
        return;
      }

      const generatedText = generateSuddenDeathText(input);
      await interaction.editReply(generatedText);
    } catch (error) {
      await slashCommandError(interaction.client, interaction, error);
    }
  },
};
