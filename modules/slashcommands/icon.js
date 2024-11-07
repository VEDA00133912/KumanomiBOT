const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('アイコン表示')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('表示したいユーザー')
        .setRequired(false)
    ),

  async execute(interaction) {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;

    await interaction.deferReply();

    const { options, user } = interaction;
    const targetUser = options.getUser('user') || user;

    try {
      const avatarURL = targetUser.displayAvatarURL({
        format: 'png',
        size: 1024,
      });

      const embed = createEmbed(interaction, 'icon')
        .setDescription(`<@${targetUser.id}>**[のアイコン](${avatarURL})**`)
        .setImage(avatarURL);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
