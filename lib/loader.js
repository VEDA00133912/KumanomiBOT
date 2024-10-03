const Cache = require('./cache');

async function loadCommands(client, directory) {
    const commandFiles = await Cache.loadFiles(directory);
    commandFiles.forEach(command => {
        client.commands.set(command.data.name, command);
    });
}

async function loadTextCommands(client, directory) {
    const textCommandFiles = await Cache.loadFiles(directory);
    textCommandFiles.forEach(textCommand => {
        client.on(textCommand.name, (...args) => textCommand.execute(...args, client));
    });
}

async function loadEvents(client, directory) {
    const eventFiles = await Cache.loadFiles(directory);
    eventFiles.forEach(event => {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    });
}

module.exports = {
    loadCommands,
    loadTextCommands,
    loadEvents,
};
