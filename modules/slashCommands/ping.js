const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping値を測定します。'),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        try {
            const embed = new EmbedBuilder()
                .setColor('#febe69')
                .setTitle('くまのみ｜Ping 🏓')
                .setDescription('Ping値')
                .setTimestamp()
                .setFooter({ text: 'Kumanomi | Ping', iconURL: interaction.client.user.displayAvatarURL() })
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
