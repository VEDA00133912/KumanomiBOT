const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');
const { checkPermissions } = require('../../lib/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('チャンネル内の一番最初のメッセージを取得します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;

        const requiredPermissions = [ PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory ];
        const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
        if (isMissingPermissions) return;

      await interaction.deferReply();

      const msg = await interaction.channel.messages.fetch({ after: "0", limit: 1 })
        .then(messages => messages.first());

      if (!msg) {
        return await interaction.editReply({ content: '<:error:1302169165905526805> メッセージが見つかりませんでした。' });
      }

      const embed = createEmbed(interaction)
        .setTitle('チャンネルの一番最初のメッセージ')
        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
        .setDescription(`${msg.url}\n${msg.content || 'メッセージがありません'}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if (error.code === 50001) {
        return interaction.editReply('<:error:1302169165905526805> チャンネルへのアクセス権限がありません');
      }
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
