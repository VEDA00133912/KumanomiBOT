const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('チケットを作成します')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;
      
      if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({ content: '<:error:1302169165905526805> BOTにチャンネル管理の権限がありません。', ephemeral: true });
    }

      await interaction.deferReply();
      const create = new ButtonBuilder()
        .setCustomId('create')
        .setStyle(ButtonStyle.Primary)
        .setLabel('チケットを作成する');

      const embed1 = createEmbed(interaction)
        .setDescription('チケットを作成するには下のボタンを押してください');

      await interaction.editReply({
        embeds: [embed1],
        components: [new ActionRowBuilder().addComponents(create)],
      });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
