const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const snipeFilePath = path.join(__dirname, '../data/settings/snipe.json');

function initializeSnipeData() {
    saveSnipeData({});
}

const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Tokyo';
rule.hour = 0; 
rule.minute = 0; 

schedule.scheduleJob(rule, () => {
    console.log('snipe.jsonを初期化します。');
    initializeSnipeData();
});

function loadSnipeData() {
    if (fs.existsSync(snipeFilePath)) {
        return JSON.parse(fs.readFileSync(snipeFilePath, 'utf8'));
    }
    return {};
}

function saveSnipeData(data) {
    fs.writeFileSync(snipeFilePath, JSON.stringify(data, null, 4), 'utf8');
}

module.exports = {
    loadSnipeData,
    saveSnipeData
};
