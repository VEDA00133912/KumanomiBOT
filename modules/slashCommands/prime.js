const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { isPrime } = require('../../lib/prime'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prime')
    .setDescription('素数判定')
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('素数かどうかを判定したい数')
        .setRequired(true)
        .setMinValue(1)       
        .setMaxValue(9000000000000000)),  
  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      await interaction.deferReply();
      const number = interaction.options.getInteger('number');

      const primeResult = isPrime(number);

      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setTitle('素数判定結果')
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | prime', iconURL: interaction.client.user.displayAvatarURL() })
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
