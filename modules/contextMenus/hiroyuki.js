const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const { generateAudio, deleteAudioFile } = require('../../lib/hiroyuki');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('ひろゆきのMP3に変換')
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const messageContent = interaction.targetMessage.content;

    if (messageContent.length > 1000) {
      await interaction.reply({ content: '1000字以下にしてください。', ephemeral: true });
      return; 
    }

    await interaction.reply('<a:loading:1259148838929961012> 生成中...');

    try {
      const audioFilePath = await generateAudio(messageContent, interaction);
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
