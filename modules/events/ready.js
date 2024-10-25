const { Events } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const { setActivity } = require('../../lib/setActivity'); 
const configPath = path.join(__dirname, '..', '..', 'data', 'settings', 'config.json');

module.exports = {
  name: Events.ClientReady, 
  once: true,
  async execute(client) {
    let config;
    try {
      config = JSON.parse(await fs.readFile(configPath, 'utf8')); 
    } catch (error) {
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

    await setActivity(client);

    console.log(`${client.user.tag} is ready.`);
  },
};
