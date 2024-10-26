const { Events } = require('discord.js');
const { loadSnipeData, saveSnipeData } = require('../../lib/snipe');
const { removeInvisibleCharacters } = require('../../lib/invisibleRegex');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.partial || message.author.bot) return;

        if (message.embeds.length > 0) {
            return; 
        }

        const hasAttachments = message.attachments.size > 0;
        if (hasAttachments && message.content.trim() === '') {
            return; 
        }

        const cleanContent = removeInvisibleCharacters(message.content);

        if (cleanContent.trim() === '') {
            return; 
        }

        const snipeData = loadSnipeData();
        const channelId = message.channel.id;

        snipeData[channelId] = {
            content: cleanContent,
            author: {
                displayName: message.member ? message.member.displayName : message.author.username,
                avatarURL: message.author.displayAvatarURL({ size: 1024 })
            },
            timestamp: Math.floor(Date.now() / 1000)
        };

        await saveSnipeData(snipeData);

        for (const [channel, data] of Object.entries(snipeData)) {
            if (removeInvisibleCharacters(data.content).trim() === '') {
                delete snipeData[channel];
            }
        }

        await saveSnipeData(snipeData);
    }
};
