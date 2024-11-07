const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping値を測定します。')
        .setContexts(0,1,2)
        .setIntegrationTypes(0,1),

    async execute(interaction) {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;

        try {
            const embed = createEmbed(interaction)
                .setDescription('Pong！🏓')
                .setFields(
                    { name: 'WebSocket Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
                    { name: 'API-Endpoint Ping', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
