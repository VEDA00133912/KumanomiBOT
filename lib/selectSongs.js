const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  async getRandomSongs(interaction, commandName, folder, option, count, embedColor) {
    const dataFilePath = path.join(__dirname, '..', 'data', 'randomSongs', folder, `${option}.txt`);

    try {
      const songList = fs.readFileSync(dataFilePath, 'utf8')
        .split('\n')
        .map(song => song.trim())
        .filter(song => song !== '');

      if (songList.length === 0) {
        return interaction.editReply('<:error:1282141871539490816> 指定されたオプションに対応する曲が見つかりませんでした。');
      }

      const selectedSongs = [];
      while (selectedSongs.length < count) {
        const randomSong = songList[Math.floor(Math.random() * songList.length)];
        if (!selectedSongs.includes(randomSong)) {
          selectedSongs.push(randomSong);
        }
      }

      const embed = new EmbedBuilder()
        .setTitle(`ランダム選曲の結果 (${selectedSongs.length} 曲)`)
        .setDescription(selectedSongs.join('\n'))
        .setTimestamp()
        .setFooter({ text: `Emubot | ${commandName}`, iconURL: interaction.client.user.displayAvatarURL() })
        .setColor(embedColor);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      const slashCommandError = require('../modules/errors/slashCommandError');
      slashCommandError(interaction.client, interaction, error);
    }
  }
};