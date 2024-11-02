const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { translater } = require('../../lib/translate');
const { validateMessageContent } = require('../../lib/invalidContent');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('日本語を他言語に翻訳します。')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('翻訳したいテキストを入力してください。')
        .setRequired(true)
        .setMinLength(1)  
        .setMaxLength(200) 
    )
    .addStringOption(option =>
      option.setName('language')
        .setDescription('翻訳したい言語を選択してください。')
        .setRequired(true)
        .addChoices(
          { name: '英語', value: 'en' },
          { name: '中国語', value: 'zh-cn' },
          { name: '韓国語', value: 'ko' },
          { name: 'ロシア語', value: 'ru' }
        )
    ),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    const text = interaction.options.getString('text');
    const targetLanguage = interaction.options.getString('language');

    const hasInvalidContent = await validateMessageContent(interaction, text);
    if (hasInvalidContent) return; 

    try {
      await interaction.deferReply();

      const translatedText = await translater(text, 'ja', targetLanguage);

      const embed = createEmbed(interaction)
        .setDescription('**翻訳しました！**' + '\n' + '```\n' + `${translatedText}` + '\n```');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
