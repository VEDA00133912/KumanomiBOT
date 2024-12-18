const { Events, PermissionFlagsBits } = require('discord.js');
const twemojiRegex = require('twemoji-parser/dist/lib/regex').default;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const targetEmoji = '😶‍🌫️';
    const deleteDelay = 5 * 60* 1000;

    if (message.author.bot) return;

    if (!message.guild || !message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return;
    }

    if (message.content.startsWith(targetEmoji)) {
      const contentWithoutEmoji = message.content.slice(targetEmoji.length).trim();

      if (/[^\p{Extended_Pictographic}\s]/gu.test(contentWithoutEmoji)) {
        setTimeout(async () => {
          try {
            await message.delete();
            console.log(`Deleted message from ${message.author.tag}: ${message.content}`);
          } catch (error) {
            console.error(`Failed to delete message: ${error}`);
          }
        }, deleteDelay);
        return; 
      }

      const serverEmojiRegex = /(<a?)?:\w+:(\d{18}>)?/g;
      const serverEmojis = contentWithoutEmoji.match(serverEmojiRegex);

      if (serverEmojis && serverEmojis.length > 0) {
        return; 
      }

      const mathEmojis = contentWithoutEmoji.match(twemojiRegex);

      if (mathEmojis && contentWithoutEmoji === mathEmojis.join('')) {
        return;
      }

      setTimeout(async () => {
        try {
          await message.delete();
          console.log(`Deleted message from ${message.author.tag}: ${message.content}`);
        } catch (error) {
          console.error(`Failed to delete message: ${error}`);
        }
      }, deleteDelay);
    }
  },
};
