const { EmbedBuilder, Events } = require('discord.js');
const { loadSnipeData } = require('../../lib/snipe'); 
const textCommandError = require('../errors/textCommandError');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.content.startsWith('^snipe')) {
            try {
                const snipeData = loadSnipeData();
                const channelId = message.channel.id;

                if (snipeData[channelId]) {
                    const snipe = snipeData[channelId];

                    const embed = new EmbedBuilder()
                        .setColor('#f8b4cb')
                        .setTitle(`${snipe.author.displayName}のメッセージ`)
                        .setDescription(snipe.content || '内容はありません')
                        .setThumbnail(snipe.author.avatarURL) 
                        .setFooter({ text: 'Emubot | snipe', iconURL: client.user.displayAvatarURL() })
                        .setTimestamp(new Date(snipe.timestamp * 1000));

                    await message.channel.send({ embeds: [embed] });
                } else {
                    await message.channel.send('このチャンネルには削除されたメッセージはありません。');
                }
            } catch (error) {
                textCommandError(client, message, error, __filename);
            }
        }
    }
};
