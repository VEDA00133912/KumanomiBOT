const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadTextCommands, loadAdminCommands, loadEvents } = require('./lib/loader');
const setupGlobalErrorHandling = require('./modules/errors/globalError');
const path = require('path');
const { config } = require('dotenv');
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences ] });

client.commands = new Collection();
client.contextMenuCommands = new Collection();

loadCommands(client, path.join(__dirname, 'modules/slashcommands'));
loadCommands(client, path.join(__dirname, 'modules/contextmenus'));
loadTextCommands(client, path.join(__dirname, 'modules/textcommands'));
loadAdminCommands(client, path.join(__dirname, 'modules/admin'));
loadEvents(client, path.join(__dirname, 'modules/events'));

setupGlobalErrorHandling(client);
client.login(process.env.TOKEN);
