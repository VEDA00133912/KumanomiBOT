const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { getRandomFortune, dailyFortunes, saveFortunes, specialFortune } = require('../../lib/omikuji');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('omikuji')
    .setDescription('おみくじを引けます')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1),

  async execute(interaction) {
    const commandName = this.data.name;
    if (cooldown(commandName, interaction)) return;

    const userId = interaction.user.id;

    if (dailyFortunes[userId]) {
      await interaction.reply('今日のおみくじはもう引きました。また明日引いてください！');
      return;
    }

    try {
      const omikujiembed = createEmbed(interaction)
        .setDescription('<a:omikuji:1302169074083823646> おみくじを引いています...');
      
      await interaction.reply({ embeds: [omikujiembed] });

      const result = getRandomFortune(userId);
      const specialThumbnailPath = path.join(__dirname, '../../data/assets/special.png');

      const embed = createEmbed(interaction)
        .setTitle('<a:omikuji:1302169074083823646> おみくじ結果')
        .setDescription(`今日の<@${userId}>は **${result}** だよ！\nまた明日引いてね！`);

      if (result === specialFortune) {
        embed.setThumbnail('attachment://special.png');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      await interaction.editReply({
        embeds: [embed],
        files: result === specialFortune ? [{
          attachment: specialThumbnailPath,
          name: 'special.png'
        }] : []
      });

      dailyFortunes[userId] = { result };
      saveFortunes();

    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};
