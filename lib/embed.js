const { EmbedBuilder } = require('discord.js');

module.exports = {
  createEmbed(interaction) {
    const commandName = interaction.commandName;

    let fullCommandName = commandName;
    if (interaction.options.getSubcommand(false)) {
      const subCommandName = interaction.options.getSubcommand();
      fullCommandName = `${commandName} ${subCommandName}`;
    }

    return new EmbedBuilder()
      .setColor('#febe69')
      .setTimestamp()
      .setFooter({ text: `Kumanomi | ${fullCommandName}`, iconURL: interaction.client.user.displayAvatarURL() });
  },
};