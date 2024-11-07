const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { isPrime } = require('../../lib/prime'); 
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prime')
    .setDescription('素数判定')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('素数かどうかを判定したい数')
        .setRequired(true)
        .setMinValue(1)       
        .setMaxValue(9000000000000000)),  
  
  async execute(interaction) {
    try {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;


      await interaction.deferReply();
      const number = interaction.options.getInteger('number');

      const primeResult = isPrime(number);

      const embed = createEmbed(interaction)
        .setTitle('素数判定結果')
        .setFields(
          { name: '入力された数', value: number.toString() },
          { name: '結果', value: primeResult ? '素数です' : number === 57 ? '[グロタンディーク素数](<https://dic.nicovideo.jp/a/グロタンディーク素数>)です' : '素数ではありません' },
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
