const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('アイコン表示')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('表示したいユーザー')
        .setRequired(false)
    ),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    await interaction.deferReply();

    const { options, user, guild } = interaction;
    const targetUser = options.getUser('user') || user;

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
        .setColor('#febe69');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
