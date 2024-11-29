const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const { saveTimer, startTimer, validateTime } = require('../../lib/timer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('指定した時間後に通知するタイマーを起動します。')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('分を指定してください。')
        .setRequired(true)
        .setMinValue(0) 
        .setMaxValue(60) 
    )
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('秒を指定してください。')
        .setRequired(false)
        .setMinValue(0) 
        .setMaxValue(60) 
    ),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      const minutes = interaction.options.getInteger('minutes');
      const seconds = interaction.options.getInteger('seconds') || 0;

      const totalSeconds = (minutes * 60) + seconds;

      await interaction.reply(`タイマーを ${minutes} 分 ${seconds} 秒で起動します。`);
      saveTimer(interaction.user.id, interaction.channel.id, totalSeconds);
      startTimer(interaction, minutes, seconds, totalSeconds);
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
