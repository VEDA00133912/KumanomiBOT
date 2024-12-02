const axios = require('axios');

/**
 * メッセージ情報を抽出
 * @param {Message} message Discordのメッセージオブジェクト
 * @returns {Object} 抽出されたデータ
 */
function extractMessageData(message) {
    const displayName = message.member
        ? message.member.displayName
        : message.author.username;
    const username = message.author.username;
    const text = message.content;
    const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });

    return { displayName, username, text, avatar };
}

/**
 * 引用画像を生成
 * @param {Object} params 生成用パラメータ
 * @returns {string} 生成された画像のURL
 */
async function generateQuote({ username, displayName, text, avatar, color }) {
    const payload = {
        username,
        display_name: displayName,
        text,
        avatar,
        color,
    };

    try {
        const response = await axios.post('https://api.voids.top/fakequote', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.url; // 生成された画像URLを返す
    } catch (error) {
        console.error('Error generating quote:', error);
        throw new Error('Failed to generate quote');
    }
}

module.exports = { extractMessageData, generateQuote };