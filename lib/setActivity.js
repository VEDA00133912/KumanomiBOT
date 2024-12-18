const { ActivityType, PresenceUpdateStatus } = require('discord.js');

async function setActivity(client) {
  try {
    await client.user.setStatus(PresenceUpdateStatus.Online); 
    await client.user.setActivity({ 
      name: "/help || ping: 72ms", 
      type: ActivityType.Custom 
    });
    console.log('Bot status and activity set successfully.');
  } catch (error) {
    console.error('Failed to set bot status or activity:', error.message);
  }
}

module.exports = setActivity;