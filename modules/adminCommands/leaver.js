const { Events, EmbedBuilder } = require('discord.js');
const textCommandError = require('../errors/textCommandError');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const allowedUserId = '1095869643106828289';

    if (!message.content.startsWith('^leaver')) return;

    if (message.author.id !== allowedUserId) {
      return message.reply('<:error:1302169165905526805> このコマンドを実行する権限がありません。');
    }

    const args = message.content.split(' ');

    if (args.length < 2) {
      return message.reply('<:error:1302169165905526805> サーバーIDを指定してください。');
    }

    const guildId = args[1];
    const guild = message.client.guilds.cache.get(guildId);

    if (!guild) {
      return message.reply(`<:error:1302169165905526805> ${guildId} のサーバーが見つかりませんでした`);
    }

    const initialEmbed = new EmbedBuilder()
      .setTitle('サーバー退出コマンドが実行されました')
      .setDescription(`<a:loading:1302169108888162334> **${guild.name}** から退出中です...`)
      .setTimestamp()
      .setFooter({ text: 'Kumanomi | leaving', iconURL: message.client.user.displayAvatarURL() })
      .setColor('Yellow');

    const replyMessage = await message.reply({ embeds: [initialEmbed] });

    try {
      await guild.leave();

      const successEmbed = new EmbedBuilder()
        .setTitle('サーバー退出完了')
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | leaver', iconURL: message.client.user.displayAvatarURL() })
        .setDescription(`<:check:1302169183110565958> **${guild.name}** から正常に退出しました`)
        .setColor('Green');

      await replyMessage.edit({ embeds: [successEmbed] });
    } catch (error) {
      textCommandError(message.client, message, error, __filename);
      const errorEmbed = new EmbedBuilder()
        .setTitle('<:error:1302169165905526805> サーバー退出エラー')
        .setDescription(`**${guild.name}** から退出できませんでした`)
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | leaveError', iconURL: message.client.user.displayAvatarURL() })
        .setColor('Red');

      await replyMessage.edit({ embeds: [errorEmbed] });
    }
  },
};
