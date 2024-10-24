const { EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '..', '..', 'data', 'settings', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
  name: Events.GuildDelete,
  async execute(guild, client) {
    const joinChannelId = config.joinChannelId; 
    const totalGuilds = client.guilds.cache.size; 

    try {
      const targetChannel = client.channels.cache.get(joinChannelId);
      const avatarURL = client.user.displayAvatarURL({ format: 'png', size: 1024 });

      if (targetChannel) {
        const leaveEmbed = new EmbedBuilder()
          .setTitle(`${guild.name} を脱退しました`)
          .setDescription(`現在 ${totalGuilds} サーバーに導入されています`)
          .setThumbnail(avatarURL) 
          .setFooter({ text: 'Kumanomi | leave', iconURL: avatarURL })
          .setTimestamp() 
          .setColor('Red'); 

        await targetChannel.send({ embeds: [leaveEmbed] });
      }
    } catch (error) {
      console.error('脱退通知エラーです:', error);
    }
  }
};
