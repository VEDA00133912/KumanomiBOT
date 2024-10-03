const { REST, Routes } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const path = require('path');
config();

const commands = [];

const slashCommandFiles = fs.readdirSync(path.join(__dirname, '..', 'slashCommands')).filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
    const command = require(path.join(__dirname, '..', 'slashCommands', file));
    commands.push(command.data.toJSON());
}

const contextMenuCommandFiles = fs.readdirSync(path.join(__dirname, '..', 'contextMenus')).filter(file => file.endsWith('.js'));
for (const file of contextMenuCommandFiles) {
    const command = require(path.join(__dirname, '..', 'contextMenus', file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
