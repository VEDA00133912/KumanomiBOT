const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embedbuilder')
    .setDescription('埋め込みメッセージを作成します')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1),

  async execute(interaction) {
    try {
      const modal = new ModalBuilder()
        .setCustomId('createEmbedModal')
        .setTitle('埋め込みを作成します');

      const titleInput = new TextInputBuilder()
        .setCustomId('titleInput')
        .setLabel('埋め込みのタイトル(必須)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100); 

      const descriptionInput = new TextInputBuilder()
        .setCustomId('descriptionInput')
        .setLabel('埋め込みの内容(必須)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(400); 

      const colorInput = new TextInputBuilder()
        .setCustomId('colorInput')
        .setLabel('埋め込みの色 [例:#00FFFF](任意)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const footerInput = new TextInputBuilder()
        .setCustomId('footerInput')
        .setLabel('フッターの内容 (任意)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setMaxLength(100); 

      modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(descriptionInput),
        new ActionRowBuilder().addComponents(colorInput),
        new ActionRowBuilder().addComponents(footerInput)
      );

      await interaction.showModal(modal);
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
