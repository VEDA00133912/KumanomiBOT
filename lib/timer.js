const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const timersFilePath = path.join(__dirname, '..', 'data', 'settings', 'timers.json');

function saveTimer(userId, channelId, totalSeconds) {
  const timers = loadTimers();
  timers[userId] = { channelId, timeLeft: totalSeconds, startTime: Date.now() };
  fs.writeFileSync(timersFilePath, JSON.stringify(timers, null, 2));
}

function removeTimer(userId) {
  const timers = loadTimers();
  delete timers[userId];
  fs.writeFileSync(timersFilePath, JSON.stringify(timers, null, 2));
}

function loadTimers() {
  if (fs.existsSync(timersFilePath)) {
    return JSON.parse(fs.readFileSync(timersFilePath, 'utf8'));
  }
  return {};
}

function resumeTimers(client) {
  const timers = loadTimers();
  Object.keys(timers).forEach(async (userId) => {
    const timer = timers[userId];
    const elapsedTime = Math.floor((Date.now() - timer.startTime) / 1000);
    const remainingTime = timer.timeLeft - elapsedTime;

    if (remainingTime > 0) {
      setTimeout(async () => {
        const channel = await client.channels.fetch(timer.channelId);
        const embed = createTimerEmbed(Math.floor(timer.timeLeft / 60), timer.timeLeft % 60);
        channel.send({ content: `<@${userId}>`, embeds: [embed] });
        removeTimer(userId);
      }, remainingTime * 1000);
    } else {
      removeTimer(userId);
    }
  });
}

function startTimer(interaction, minutes, seconds, totalSeconds) {
  setTimeout(() => {
    const embed = createTimerEmbed(minutes, seconds, interaction);
    interaction.channel.send({ content: `${interaction.user}`, embeds: [embed] });
    removeTimer(interaction.user.id);
  }, totalSeconds * 1000);
}

function createTimerEmbed(minutes, seconds, interaction) {
  return new EmbedBuilder()
    .setColor('#f8b4cb')
    .setTitle('時間になりました')
    .setTimestamp()
    .setFooter({ text: 'Emubot | timer', iconURL: interaction.client.user.displayAvatarURL() })
    .setDescription(`${minutes}分${seconds}秒が経過しました！`);
}

function validateTime(minutes, seconds) {
  return minutes >= 0 && minutes <= 60 && seconds >= 0 && seconds < 60;
}

module.exports = {
  saveTimer,
  removeTimer,
  loadTimers,
  resumeTimers,
  startTimer,
  createTimerEmbed,
  validateTime,
};
