const { SlashCommandBuilder } = require('discord.js');
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

    const { options, guild, user } = interaction;
    const targetUser = options.getUser('user') || user;
    const member = await guild.members.fetch(targetUser.id);
    
    try {
      const avatarURL = member.avatarURL({ extension: 'png', size: 1024 }) || targetUser.displayAvatarURL({ extension: 'png', size: 1024 });

      const embed = createEmbed(interaction, 'icon')
        .setDescription(`<@${targetUser.id}>**[のアイコン](${avatarURL})**`)
        .setImage(avatarURL);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
