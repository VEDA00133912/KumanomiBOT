const axios = require('axios');

// リダイレクトをチェックする関数
async function checkRedirect(url) {
    try {
        // APIを呼び出してリダイレクト情報を取得
        const response = await axios.get(`https://ntool.online/api/redirectChecker?url=${encodeURIComponent(url)}`);

        // レスポンスが空の場合はエラーメッセージを返す
        if (!response.data.length) {
            return { error: "取得に失敗しました。サイトに到達できていない可能性があります。" };
        }

        // 結果をリダイレクト先のURLのみを含む形で整形
        const result = response.data.map((item, index) => ({
            url: item.url
        }));

        // 結果を返す
        return result;

    } catch (error) {
        console.error(error);
        return { error: "API呼び出し中にエラーが発生しました。" };
    }
}

module.exports = {
    checkRedirect
};
