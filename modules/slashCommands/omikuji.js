const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { getRandomFortune, dailyFortunes, saveFortunes, specialFortune } = require('../../lib/omikuji');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('omikuji')
    .setDescription('おみくじを引けます'),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return; 

    const userId = interaction.user.id;

    if (dailyFortunes[userId]) {
      await interaction.reply('今日のおみくじはもう引きました。また明日引いてください！');
      return;
    }

    try {
      const omikujiembed = new EmbedBuilder()
        .setDescription('<a:ID:omikuji> おみくじを引いています...')
        .setTimestamp()
        .setFooter({ text: 'Emubot | omikuji', iconURL: interaction.client.user.displayAvatarURL() })
        .setColor('#f8b4cb');
      
      await interaction.reply({ embeds: [omikujiembed] });

      const result = getRandomFortune(userId);
      const thumbnailPath = path.join(__dirname, '../../data/assets/omikuji.png');
      const specialThumbnailPath = path.join(__dirname, '../../data/assets/special.png');

      const embed = new EmbedBuilder()
        .setTitle('おみくじ結果')
        .setDescription(`今日の<@${userId}>は **${result}** だよ！\nまた明日引いてね！`)
        .setTimestamp()
        .setFooter({ text: 'Emubot | omikuji', iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(`attachment://${result === specialFortune ? 'special.png' : 'omikuji.png'}`)
        .setColor('#f8b4cb');

      await interaction.editReply({
        embeds: [embed],
        files: [{
          attachment: result === specialFortune ? specialThumbnailPath : thumbnailPath,
          name: result === specialFortune ? 'special.png' : 'omikuji.png'
        }]
      });

      dailyFortunes[userId] = { result };
      saveFortunes();

    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};
