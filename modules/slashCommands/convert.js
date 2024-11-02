const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const { convertText, typeNameMap } = require('../../lib/convert');
const { validateMessageContent } = require('../../lib/invalidContent');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('文字列を指定形式に変換します。')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('変換タイプを選択します。')
        .setRequired(true)
        .addChoices(
          { name: 'ルーン文字', value: 'rune' },
          { name: 'フェニキア文字', value: 'phoenicia' },
          { name: 'ヒエログリフ', value: 'hieroglyphs' },
          { name: '逆読み', value: 'reverse' },
          { name: 'アナグラム', value: 'anagram' },
          { name: 'ﾒﾝﾍﾗ文', value: 'genhera' },
          { name: '怪しい日本語', value: 'cjp' },
        ))
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストの長さ（1〜100文字）を入力してください。')
        .setRequired(true)
        .setMinLength(1)  
        .setMaxLength(100)
    ),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;

      const type = interaction.options.getString('type');
      const text = interaction.options.getString('text');

      if (await validateMessageContent(interaction, text)) return;

      await interaction.deferReply();

      const convertedText = convertText(type, text);

      const embed = createEmbed(interaction)
        .setTitle(`${typeNameMap[type]}に変換完了！`)
        .setDescription(`\`\`\`${convertedText}\`\`\``);

      await interaction.editReply({ embeds: [embed] });
      
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
