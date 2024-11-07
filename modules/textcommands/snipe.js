const { EmbedBuilder, Events } = require('discord.js');
const { loadSnipeData } = require('../../lib/snipe'); 
const textCommandError = require('../errors/textcommandError');

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
                        .setColor('#febe69')
                        .setDescription(snipe.content || '内容はありません')
                        .setAuthor({ name: snipe.author.displayName, iconURL: snipe.author.avatarURL })
                        .setFooter({ text: 'Kumanomi | snipe', iconURL: client.user.displayAvatarURL() })
                        .setTimestamp(new Date(snipe.timestamp * 1000));

                    await message.reply({ 
                        embeds: [embed], allowedMentions: { repliedUser: false } 
                    });
                } else {
                    const replyMessage = await message.reply({
                        content: '<:error:1302169165905526805> このチャンネルには削除されたメッセージはありません。', allowedMentions: { repliedUser: false } 
                    });
                    setTimeout(() => {
                        replyMessage.delete().catch(console.error);
                    }, 5000); 
                }
            } catch (error) {
                textCommandError(client, message, error, __filename);
            }
        }
    }
};
