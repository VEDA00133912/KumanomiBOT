const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../lib/embed');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const primeFactorization = require('../../lib/math-pf');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pf')
    .setDescription('指定された数の素因数分解を行います')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addIntegerOption(option =>
      option
        .setName('number')
        .setDescription('素因数分解したい数を入力してください')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(9999999)
    ),

  async execute(interaction) {
       const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;
    try {
      await interaction.deferReply();
      const number = parseInt(interaction.options.getInteger('number'));

      if (isNaN(number)) {
        throw new Error('無効な数値が入力されました');
      }
      const factors = primeFactorization(number);

      const embed = createEmbed(interaction)
        .setDescription(`**${number}** の素因数分解: ${factors}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};