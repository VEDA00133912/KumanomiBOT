const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const { generateAudio, deleteAudioFile } = require('../../lib/hiroyuki');
const cooldown = require('../events/cooldown');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('ひろゆきのMP3に変換')
    .setType(ApplicationCommandType.Message)
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1),

  async execute(interaction) {
    const commandName = this.data.name;
    if (cooldown(commandName, interaction)) return;

      
    const messageContent = interaction.targetMessage.content;

    if (messageContent.length > 1000) {
      await interaction.reply({ content: '<:error:1302169165905526805>1000字以下にしてください。', ephemeral: true });
      return; 
    }

    await interaction.reply('<a:loading:1302169108888162334> 生成中...');

    try {
      const audioFilePath = await generateAudio(messageContent, interaction);
      if (audioFilePath) {
        await interaction.editReply({ content: '<:check:1302169183110565958> 生成完了！', files: [audioFilePath] });
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
