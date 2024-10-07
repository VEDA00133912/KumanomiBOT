const { ChannelType } = require('discord.js');

module.exports.getServerInfo = async (guild) => {
  const textChannelsCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size; // テキストチャンネル
  const voiceChannelsCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size; // ボイスチャンネル
  const categoryCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size; // カテゴリーチャンネル
  const memberCount = guild.memberCount; // メンバー数

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
