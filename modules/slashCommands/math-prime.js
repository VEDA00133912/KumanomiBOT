const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { createEmbed } = require('../../lib/embed');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const isPrime = require('../../lib/math-prime');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prime')
    .setDescription('指定した数が素数かどうかを判定します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('素数かどうかを判定したい数')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(999999999)
    ),

  async execute(interaction) {
    const commandName = this.data.name;
    if (cooldown(commandName, interaction)) return;
    await interaction.deferReply();
    
    try {
      const number = interaction.options.getInteger('number');
      const primeResult = isPrime(number);

      const embed = createEmbed(interaction)
        .setFields(
          { name: '入力された数', value: number.toString() },
          { name: '結果', value: primeResult ? '素数です' : number === 57 ? '[グロタンディーク素数](<https://dic.nicovideo.jp/a/グロタンディーク素数>)です' : '素数ではありません' }
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};