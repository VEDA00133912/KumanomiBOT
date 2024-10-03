const { Events } = require('discord.js');
const { loadSnipeData, saveSnipeData } = require('../../lib/snipe');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (!message.partial) {
            const snipeData = loadSnipeData();
            const channelId = message.channel.id;

            snipeData[channelId] = {
                content: message.content,
                author: {
                    displayName: message.member ? message.member.displayName : message.author.username, 
                    avatarURL: message.author.displayAvatarURL({ size: 1024 })
                },
                timestamp: Math.floor(Date.now() / 1000)
            };
            await saveSnipeData(snipeData); 
        }
    }
};
