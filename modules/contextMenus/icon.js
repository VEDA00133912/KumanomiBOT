const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const cooldown = require('../events/cooldown');
const contextMenuError = require('../errors/contextMenuError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('アイコン表示')
    .setType(ApplicationCommandType.User)
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    await interaction.deferReply();

    const targetUser = interaction.targetUser;

    try {
      const member = await interaction.guild?.members.fetch(targetUser.id).catch(() => null);
      const avatarURL = member 
        ? member.displayAvatarURL({ size: 1024 }) 
        : targetUser.displayAvatarURL({ size: 1024 });

      const embed = createEmbed(interaction)
        .setDescription(`<@${targetUser.id}>**[のアイコン](${avatarURL})**`)
        .setImage(avatarURL);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      contextMenuError(interaction.client, interaction, error);
    }
  },
};