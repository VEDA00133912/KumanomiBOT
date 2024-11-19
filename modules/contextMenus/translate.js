const { ApplicationCommandType, EmbedBuilder, ContextMenuCommandBuilder } = require('discord.js');
const { translater } = require('../../lib/translate');  
const { validateMessageContent } = require('../../lib/invalidContent'); 
const contextMenuError = require('../errors/contextMenuError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('英語に翻訳')
    .setType(ApplicationCommandType.Message)
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1),

  async execute(interaction) {

    const text = interaction.targetMessage.content; 

    const hasInvalidContent = await validateMessageContent(interaction, text);  
    if (hasInvalidContent) return; 

    try {
　    await interaction.deferReply();  
      const targetLanguage = 'en';  
      const translatedText = await translater(text, 'ja', targetLanguage);  

      const embed = createEmbed(interaction)
        .setDescription('**翻訳しました！**' + '\n' + '```\n' + `${translatedText}` + '\n```');

      await interaction.editReply({ embeds: [embed] });  
    } catch (error) {
        contextMenuError(interaction.client, interaction, error);
    }
  },
};
