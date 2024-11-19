function isValidUrl(string) {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}([\/\w .-]*)*\/?$/;
    return urlPattern.test(string);
}

function processVirusCheckResults(data) {
    const results = Object.entries(data.data.attributes.last_analysis_results || {}).map(([engine, result]) => ({
        engine,
        result: result.result,
        category: result.category,
    }));

    const detected = results.filter(r => r.result !== 'clean' && r.result !== 'unrated');
    const clean = results.filter(r => r.result === 'clean');
    const unrated = results.filter(r => r.result === 'unrated').slice(0, 5);

    return { detected, clean, unrated };
}

function invalidUrlMessage() {
    return '<:error:1302169165905526805> 無効なURLです。正しい形式で入力してください。';
}

module.exports = { isValidUrl, processVirusCheckResults, invalidUrlMessage };