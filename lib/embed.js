const { EmbedBuilder } = require('discord.js');

module.exports = {
  createEmbed(interaction, title) {
    return new EmbedBuilder()
      .setColor('#febe69')
      .setTimestamp()
      .setFooter({ text: `Kumanomi | ${title}`, iconURL: interaction.client.user.displayAvatarURL() });
  },
};
