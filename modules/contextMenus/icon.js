const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const contextMenuError = require('../errors/contextMenuError');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('アイコン表示')
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    await interaction.deferReply();

    const { targetUser, guild } = interaction; 

    try {
      const guildMember = await guild.members.fetch(targetUser.id);
      const avatarURL = guildMember.displayAvatarURL({
        format: 'png',
        size: 1024,
      });

      const embed = new EmbedBuilder()
        .setDescription(`<@${targetUser.id}>**[のアイコン](${avatarURL})**`)
        .setImage(avatarURL)
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | icon', iconURL: interaction.client.user.displayAvatarURL() })
        .setColor('#f8b4cb');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      contextMenuError(interaction.client, interaction, error);
    }
  },
};
