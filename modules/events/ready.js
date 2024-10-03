const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const configPath = path.join(__dirname, '..', '..', 'data', 'settings', 'config.json');

module.exports = {
  name: Events.ClientReady, 
  once: true,
  async execute(client) {
    let config;
    try {
      config = JSON.parse(await fs.readFile(configPath, 'utf8')); 
    } catch (error) {
      console.error('Error reading config file:', error.message);
      return;
    }

    const nickname = config.nickname;

    if (nickname) {
      const guildPromises = client.guilds.cache.map(async (guild) => {
        try {
          await guild.members.me.setNickname(nickname);
        } catch (error) {
          console.error(`Failed to change nickname in guild: ${guild.name}`, error.message);
        }
      });
      await Promise.all(guildPromises); 
      console.log('All nickname changes attempted.');
    } else {
      console.warn('No nickname found in the config file.');
    }

    try {
      await client.user.setStatus(PresenceUpdateStatus.Online); 
      await client.user.setActivity({ 
        name: "/help || ping: 39ms", 
        type: ActivityType.Custom 
      });
      console.log('Bot status and activity set successfully.');
    } catch (error) {
      console.error('Failed to set bot status or activity:', error.message);
    }

    console.log(`${client.user.tag} is ready!);
  },
};
