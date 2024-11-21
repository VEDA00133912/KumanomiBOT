const { SlashCommandBuilder, userMention } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
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
        .setRequired(true)
    ),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    await interaction.deferReply();

    const { options, user } = interaction;
    const targetUser = options.getUser('user') || user;

    try {
      const member = await interaction.guild?.members.fetch(targetUser.id).catch(() => null);
      const avatarURL = member 
        ? member.displayAvatarURL({ size: 1024 }) 
        : targetUser.displayAvatarURL({ size: 1024 });

      const user = userMention(targetUser.id);
      const embed = createEmbed(interaction, 'icon')
        .setDescription(`${user}**[のアイコン](${avatarURL})**`)
        .setImage(avatarURL);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
