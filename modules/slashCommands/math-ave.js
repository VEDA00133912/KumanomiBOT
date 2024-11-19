const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../lib/embed');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const calculateAverage = require('../../lib/math-ave');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('average')
    .setDescription('指定した数の平均を計算します')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addIntegerOption(option =>
      option.setName('number1').setDescription('1つ目の数').setRequired(true).setMinValue(1).setMaxValue(5000)
    )
    .addIntegerOption(option =>
      option.setName('number2').setDescription('2つ目の数').setRequired(true).setMinValue(1).setMaxValue(5000)
    )
    .addIntegerOption(option =>
      option.setName('number3').setDescription('3つ目の数').setRequired(false).setMinValue(1).setMaxValue(5000)
    )
    .addIntegerOption(option =>
      option.setName('number4').setDescription('4つ目の数').setRequired(false).setMinValue(1).setMaxValue(5000)
    )
    .addIntegerOption(option =>
      option.setName('number5').setDescription('5つ目の数').setRequired(false).setMinValue(1).setMaxValue(5000)
    ),

  async execute(interaction) {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;
    try {
      await interaction.deferReply();
        
      const numbers = [
        interaction.options.getInteger('number1'),
        interaction.options.getInteger('number2'),
        interaction.options.getInteger('number3'),
        interaction.options.getInteger('number4'),
        interaction.options.getInteger('number5')
      ];

      const validNumbers = numbers.filter(n => n !== null);
      const averageResult = calculateAverage(validNumbers);
      const numbersList = validNumbers.map(n => `**${n}**`).join(', ');

      const embed = createEmbed(interaction)
        .setDescription(`${numbersList}${averageResult}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};