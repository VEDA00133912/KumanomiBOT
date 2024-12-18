const Cache = require('./cache');

async function loadCommands(client, directory) {
    const commandFiles = await Cache.loadFiles(directory);
    commandFiles.forEach(command => {
        client.commands.set(command.data.name, command);
    });
}

async function loadAdminCommands(client, directory) {
    const adminCommandFiles = await Cache.loadFiles(directory);
    adminCommandFiles.forEach(adminCommand => {
        client.on(adminCommand.name, (...args) => adminCommand.execute(...args, client));
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
    loadAdminCommands,
    loadEvents,
};