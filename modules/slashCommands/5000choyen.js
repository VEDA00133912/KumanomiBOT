const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('5000choyen')
    .setDescription('5000兆円欲しい!!風の画像生成')
    .addStringOption(option =>
      option.setName('top')
        .setDescription('上部文字列')
        .setMinLength(1)  
        .setMaxLength(30)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('bottom')
        .setDescription('下部文字列')
        .setMinLength(1)  
        .setMaxLength(30)
        .setRequired(true)),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      await interaction.deferReply();
      const top = interaction.options.getString('top');
      const bottom = interaction.options.getString('bottom');

      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setFooter({ text:'Emubot | 5000choyen', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setImage(`https://gsapi.cbrx.io/image?top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&type=png`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
