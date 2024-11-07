const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('BOTの招待リンクを表示します')
        .setContexts(0,1,2)
        .setIntegrationTypes(0,1),

    async execute(interaction) {
        const commandName = this.data.name;
        if (cooldown(commandName, interaction)) return;


        try {
            const embed = createEmbed(interaction)
                .setDescription('**ここから導入できます**\n\n**[招待する！](https://discord.com/oauth2/authorize?client_id=1298829009907355730)**\n\n**[サポートサーバー](https://discord.gg/Ftz4Tcs8tR)**');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
