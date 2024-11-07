const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { generateSuddenDeathText } = require('../../lib/totsu-shi');
const { validateMessageContent } = require('../../lib/invalidContent'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('totsu-shi')
    .setDescription('突然の死ジェネレーターです')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addStringOption(option =>
      option.setName('content')
        .setDescription('生成する内容')
        .setRequired(true)
        .setMinLength(1)  
        .setMaxLength(100) 
    ),

  async execute(interaction) {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;

    try {
      await interaction.deferReply();
      const input = interaction.options.getString('content');

      const hasError = await validateMessageContent(interaction, input);
      if (hasError) return; 

      const generatedText = generateSuddenDeathText(input);
      await interaction.editReply(generatedText);
    } catch (error) {
      await slashCommandError(interaction.client, interaction, error);
    }
  },
};
