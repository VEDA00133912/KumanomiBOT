const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const fortuneFilePath = path.join(__dirname, '../data/settings/omikuji.json');

const fortunes = ["大吉", "中吉", "小吉", "吉", "末吉", "凶", "大凶"];
const specialFortune = "わんだほーい！";

let dailyFortunes = {};

if (fs.existsSync(fortuneFilePath)) {
  dailyFortunes = JSON.parse(fs.readFileSync(fortuneFilePath, 'utf-8'));
}

const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Tokyo';
rule.hour = 21;
rule.minute = 9;

schedule.scheduleJob(rule, () => {
  dailyFortunes = {};
  saveFortunes();
});

function saveFortunes() {
  fs.writeFileSync(fortuneFilePath, JSON.stringify(dailyFortunes, null, 2), 'utf-8');
}

function getRandomFortune(userId) {
  let result = '';
  do {
    const random = Math.random();
    if (random < 0.01) {
      result = specialFortune;
    } else {
      result = fortunes[Math.floor(Math.random() * fortunes.length)];
    }
  } while (dailyFortunes[userId]?.result === result);

  return result;
}

module.exports = {
  fortunes,
  specialFortune,
  dailyFortunes,
  saveFortunes,
  getRandomFortune,
};
