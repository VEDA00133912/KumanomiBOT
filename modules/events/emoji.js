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
        return; // 文字列が含まれていれば処理を終了
      }

      // サーバー絵文字（カスタム絵文字）の検出
      const serverEmojiRegex = /(<a?)?:\w+:(\d{18}>)?/g;
      const serverEmojis = contentWithoutEmoji.match(serverEmojiRegex);

      if (serverEmojis && serverEmojis.length > 0) {
        // サーバー絵文字が含まれている場合は削除対象外
        return; // サーバー絵文字やアニメーション絵文字のみの場合は削除しない
      }

      // メッセージからUnicode絵文字を検出
      const mathEmojis = contentWithoutEmoji.match(twemojiRegex);

      // Unicode絵文字のみで構成されている場合も削除対象外
      if (mathEmojis && contentWithoutEmoji === mathEmojis.join('')) {
        return; // Unicode絵文字のみの場合は削除しない
      }

      // その他の場合は削除対象
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
