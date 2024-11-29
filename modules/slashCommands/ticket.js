const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');
const { checkPermissions } = require('../../lib/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('チケットを作成します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

        const requiredPermissions = [ PermissionFlagsBits.ManageChannels ];
        const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
        if (isMissingPermissions) return;

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
