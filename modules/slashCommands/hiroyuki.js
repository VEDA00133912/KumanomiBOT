const { SlashCommandBuilder } = require('discord.js');
const { generateAudio, deleteAudioFile } = require('../../lib/hiroyuki');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hiroyuki')
    .setDescription('ひろゆきボイスのMP3に変換します')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('ひろゆきに喋らせる内容')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(1000)),

  async execute(interaction) {
    const text = interaction.options.getString('text');
    await interaction.reply('<a:loading:1259148838929961012> 生成中...');

    try {
      const audioFilePath = await generateAudio(text, interaction);
      if (audioFilePath) {
        await interaction.editReply({ content: '<:done:1299263286361063454> 生成完了！', files: [audioFilePath] });
        await deleteAudioFile(audioFilePath);
      }
    } catch (error) {
      await interaction.editReply(error.message);
      setTimeout(async () => {
        await interaction.deleteReply().catch(console.error); 
      }, 5000);
    }
  },
};
