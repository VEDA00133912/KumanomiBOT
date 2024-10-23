const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadTextCommands, loadAdminCommands, loadEvents } = require('./lib/loader');
const path = require('path');
const { config } = require('dotenv');
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessagePolls] });

client.commands = new Collection();
client.contextMenuCommands = new Collection();

loadCommands(client, path.join(__dirname, 'modules/slashCommands'));
loadCommands(client, path.join(__dirname, 'modules/contextMenus'));
loadTextCommands(client, path.join(__dirname, 'modules/textCommands'));
loadAdminCommands(client, path.join(__dirname, 'modules/adminCommands'));
loadEvents(client, path.join(__dirname, 'modules/events'));

client.login(process.env.TOKEN);
