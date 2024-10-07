const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const snipeFilePath = path.join(__dirname, '../data/settings/snipe.json');

function initializeSnipeData() {
    saveSnipeData({});
}

const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Tokyo';
rule.hour = 0; // 毎日0時に実行
rule.minute = 0; // 毎分0分に実行

// スケジュールを設定
schedule.scheduleJob(rule, () => {
    console.log('snipe.jsonを初期化します。');
    initializeSnipeData();
});

// Snipeデータを読み込む
function loadSnipeData() {
    if (fs.existsSync(snipeFilePath)) {
        return JSON.parse(fs.readFileSync(snipeFilePath, 'utf8'));
    }
    return {};
}

// Snipeデータを保存する
function saveSnipeData(data) {
    fs.writeFileSync(snipeFilePath, JSON.stringify(data, null, 4), 'utf8');
}

module.exports = {
    loadSnipeData,
    saveSnipeData
};
