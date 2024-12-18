const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadAdminCommands, loadEvents } = require('./lib/loader');
const setupGlobalErrorHandling = require('./modules/errors/globalError');
const path = require('path');
const { config } = require('dotenv');
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers
/*, GatewayIntentBits.GuildPresences*/ ] });

client.commands = new Collection();
client.contextMenuCommands = new Collection();

loadCommands(client, path.join(__dirname, 'modules/slashCommands'));
loadCommands(client, path.join(__dirname, 'modules/contextMenus'));
loadAdminCommands(client, path.join(__dirname, 'modules/adminCommands'));
loadEvents(client, path.join(__dirname, 'modules/events'));

setupGlobalErrorHandling(client);
client.login(process.env.TOKEN);
