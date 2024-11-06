const axios = require('axios');

async function getUserPublicFlags(userId) {
    try {
        const response = await axios.get(`https://japi.rest/discord/v1/user/${userId}`);
        return response.data.data.public_flags_array;
    } catch (error) {
        console.error('バッジ情報の取得中にエラーが発生しました:', error);
        return []; 
    }
}

module.exports = getUserPublicFlags;
