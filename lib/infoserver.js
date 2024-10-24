const { ChannelType } = require('discord.js');

module.exports.getServerInfo = async (guild) => {
  const textChannelsCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size; 
  const voiceChannelsCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size; 
  const categoryCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size; 
  const memberCount = guild.memberCount; 

  const bans = await guild.bans.fetch();
  const bannedCount = bans.size;

  return {
    textChannelsCount,
    voiceChannelsCount,
    categoryCount,
    memberCount,
    bannedCount,
  };
};
