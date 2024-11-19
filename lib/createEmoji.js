const axios = require('axios');

module.exports = async function createEmoji(guild, name, attachment) {
    const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const emoji = await guild.emojis.create({
        attachment: imageBuffer,
        name: name
    });

    return emoji;
};
