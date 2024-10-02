const { Client, GatewayIntentBits, Collection } = require('discord.js');
const setupGlobalErrorHandling = require('./modules/errors/globalError');
const { loadCommands, loadTextCommands, loadEvents } = require('./lib/loader');
const path = require('path');
const { config } = require('dotenv');
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.contextMenuCommands = new Collection();

loadCommands(client, path.join(__dirname, 'modules/slashCommands'));
loadCommands(client, path.join(__dirname, 'modules/contextMenus'));
loadTextCommands(client, path.join(__dirname, 'modules/textCommands'));
loadEvents(client, path.join(__dirname, 'modules/events'));

setupGlobalErrorHandling(client);
client.login(process.env.TOKEN);
