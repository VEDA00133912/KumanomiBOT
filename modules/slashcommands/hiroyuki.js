const { SlashCommandBuilder } = require('discord.js');
const { generateAudio, deleteAudioFile } = require('../../lib/hiroyuki');
const cooldown = require('../events/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hiroyuki')
    .setDescription('ひろゆきボイスのMP3に変換します')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addStringOption(option =>
      option.setName('text')
        .setDescription('ひろゆきに喋らせる内容')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(1000)),

  async execute(interaction) {
    const commandName = this.data.name;
    if (cooldown(commandName, interaction)) return;

    
    const text = interaction.options.getString('text');
    await interaction.reply('<a:loading:1302169108888162334> 生成中...');

    try {
      const audioFilePath = await generateAudio(text, interaction);
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
