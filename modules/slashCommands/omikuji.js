const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
        .setFooter({ text: 'Kumanomi | omikuji', iconURL: interaction.client.user.displayAvatarURL() })
        .setColor('#febe69');
      
      await interaction.reply({ embeds: [omikujiembed] });

      const result = getRandomFortune(userId);

      const embed = new EmbedBuilder()
        .setTitle('おみくじ結果')
        .setDescription(`今日の<@${userId}>は **${result}** だよ！\nまた明日引いてね！`)
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | omikuji', iconURL: interaction.client.user.displayAvatarURL() })
        .setColor('#febe69');

      await interaction.editReply({
        embeds: [embed]
      });

      dailyFortunes[userId] = { result };
      saveFortunes();

    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};
