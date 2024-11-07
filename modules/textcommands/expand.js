const { EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const SETTINGS_FILE = path.join(__dirname, '..', '..', 'data', 'settings', 'expand.json');
const BLACKLIST_FILE = path.join(__dirname, '..', '..', 'data', 'settings', 'blacklist.json');
const CONFIG_FILE = path.join(__dirname, '..', '..', 'data', 'settings', 'config.json');
const textCommandError = require('../errors/textcommandError');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;

    const urls = message.content.match(/https:\/\/(?:canary\.|ptb\.)?discord\.com\/channels\/\d+\/\d+\/\d+/g);
    if (!urls) return;

    let settings = {};
    if (fs.existsSync(SETTINGS_FILE)) {
      try {
        settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      } catch (error) {
        textCommandError(client, message, error, __filename);
      }
    }

    const shouldExpandLinks = settings[message.guild.id] ?? true;
    if (!shouldExpandLinks) return;

    let blacklist = [];
    if (fs.existsSync(BLACKLIST_FILE)) {
      try {
        blacklist = JSON.parse(fs.readFileSync(BLACKLIST_FILE, 'utf8'));
        if (!Array.isArray(blacklist)) {
          blacklist = [];
        }
      } catch (error) {
        textCommandError(client, message, error, __filename);
      }
    }

    let config = {};
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      } catch (error) {
        textCommandError(client, message, error, __filename);
      }
    }

    const userLinkCount = (message.guild.linkCount || new Map()).get(message.author.id) || 0;
    const currentTime = Date.now();

    if (message.guild.linkTimestamp) {
      const timestamp = message.guild.linkTimestamp.get(message.author.id) || 0;
      if (currentTime - timestamp > 5000) {
        message.guild.linkCount.set(message.author.id, 1);
        message.guild.linkTimestamp.set(message.author.id, currentTime);
      } else {
        message.guild.linkCount.set(message.author.id, userLinkCount + 1);
      }
    } else {
      message.guild.linkCount = new Map();
      message.guild.linkCount.set(message.author.id, 1);
      message.guild.linkTimestamp = new Map();
      message.guild.linkTimestamp.set(message.author.id, currentTime);
    }

    if (message.guild.linkCount.get(message.author.id) >= 3) {
      if (!blacklist.includes(message.author.id)) {
        blacklist.push(message.author.id);
        fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(blacklist, null, 2));

        const channel = client.channels.cache.get(config.blacklistChannelId);
        if (channel) {
          const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('ユーザーがブラックリストに追加されました')
            .addFields(
              { name: 'ユーザー名', value: message.author.tag, inline: true },
              { name: 'ユーザーID', value: message.author.id, inline: true }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();

          channel.send({ embeds: [embed] });
        }
      }
      return;
    }

    for (const url of urls) {
      const [guildId, channelId, messageId] = url.split('/').slice(-3);
      if (blacklist.includes(message.author.id)) return;

      try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) continue;

        const channel = guild.channels.cache.get(channelId);
        if (!channel || !channel.isTextBased()) continue;

        const fetchedMessage = await channel.messages.fetch(messageId);
        if (!fetchedMessage) continue;

        const { content, embeds, attachments, author, createdTimestamp } = fetchedMessage;
        const displayName = guild.members.cache.get(author.id)?.displayName || author.tag;

        const embed = new EmbedBuilder()
          .setColor(0xf8b4cb)
          .setTimestamp(createdTimestamp)
          .setFooter({ text: 'Emubot | Expand', iconURL: message.client.user.displayAvatarURL() })
          .setAuthor({ name: displayName, iconURL: author.displayAvatarURL() });

        if (content) {
          embed.setDescription(content);
        }

        if (attachments.size) {
          if (attachments.size === 1 && attachments.first().contentType?.startsWith('image/')) {
            const attachment = attachments.first();
            embed.setImage(attachment.proxyURL);
          } else {
            embed.addFields({ name: 'ファイル', value: `${attachments.size}件のファイルがあります。` });
          }
        }

        if (embeds.length) {
          embed.addFields({ name: 'Embed', value: `${embeds.length}件のEmbedがあります。` });
        }

        message.channel.send({ embeds: [embed] });

      } catch (error) {
        textCommandError(client, message, error, __filename);
      }
    }
  }
};
