const axios = require('axios');

async function checkRedirect(url) {
    try {
        const response = await axios.get(`https://ntool.online/api/redirectChecker?url=${encodeURIComponent(url)}`);

        if (!response.data.length) {
            return { error: "取得に失敗しました。サイトに到達できていない可能性があります。" };
        }

        const result = response.data.map((item, index) => ({
            url: item.url
        }));

        return result;

    } catch (error) {
        console.error(error);
        return { error: "API呼び出し中にエラーが発生しました。" };
    }
}

module.exports = {
    checkRedirect
};
