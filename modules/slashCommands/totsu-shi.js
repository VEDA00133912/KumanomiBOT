const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { generateSuddenDeathText } = require('../../lib/totsu-shi');
const { validateMessageContent } = require('../../lib/invalidContent'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('totsu-shi')
    .setDescription('突然の死ジェネレーターです')
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
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;
      
      const input = interaction.options.getString('content');

      const hasError = await validateMessageContent(interaction, input);
      if (hasError) return; 
      
      try {
      await interaction.deferReply();

      const generatedText = generateSuddenDeathText(input);
      await interaction.editReply(generatedText);
    } catch (error) {
      await slashCommandError(interaction.client, interaction, error);
    }
  },
};
