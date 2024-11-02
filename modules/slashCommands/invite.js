const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('BOTの招待リンクを表示します'),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        try {
            const embed = createEmbed(interaction)
                .setDescription('**ここから導入できます**\n\n**[招待する！](https://discord.com/oauth2/authorize?client_id=1298829009907355730&permissions=1927168912598&integration_type=0&scope=bot+applications.commands)**\n\n**[サポートサーバー](https://discord.gg/Ftz4Tcs8tR)**');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
