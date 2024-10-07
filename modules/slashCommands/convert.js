const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { getInvalidReason, convertText, typeNameMap } = require('../../lib/convert');

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
          { name: 'ﾒﾝﾍﾗ文生成', value: 'genhera' },
          { name: '怪しい日本語生成', value: 'cjp' },
        ))
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください。')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;
      
      const type = interaction.options.getString('type');
      const text = interaction.options.getString('text');

      const invalidReason = getInvalidReason(text);
      if (invalidReason) {
        await interaction.reply({ content: invalidReason, ephemeral: true });
        return;
      }

      await interaction.deferReply();

      const convertedText = convertText(type, text);

      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setTitle(`${typeNameMap[type]}に変換完了！`)
        .setDescription(`\`\`\`${convertedText}\`\`\``)
        .setTimestamp()
        .setFooter({ text: `Emubot | convert ${typeNameMap[type]}`, iconURL: interaction.client.user.displayAvatarURL() });

      await interaction.editReply({ embeds: [embed] });
      
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
