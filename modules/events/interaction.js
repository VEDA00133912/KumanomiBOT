const { Events } = require('discord.js');
const interactionError = require('../errors/interactionError');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.guild) {
            await interaction.reply({ content: '<:error:1299263288797827185> このコマンドはサーバー内でのみ実行可能です。', ephemeral: true });
            return;
        }

        if (interaction.isCommand()) {
            try {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction, client);
            } catch (error) {
                console.error('Error handling slash command interaction:', error);
                interactionError(client, interaction, error);
            }
        } else if (interaction.isContextMenuCommand()) {
            try {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction, client);
            } catch (error) {
                console.error('Error handling context menu interaction:', error);
                interactionError(client, interaction, error);
            }
        }
    },
};
