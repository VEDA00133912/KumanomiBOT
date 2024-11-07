const { SlashCommandBuilder } = require('discord.js');
const { convertText } = require('../../lib/convert');
const { validateMessageContent } = require('../../lib/invalidContent');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('menhera')
    .setDescription('文字列をメンヘラ文に変換します。')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください。')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(400)
    ),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;

      const text = interaction.options.getString('text');
      if (await validateMessageContent(interaction, text)) return;

      await interaction.deferReply();

      const convertedText = convertText('genhera', text);

      const embed = createEmbed(interaction)
        .setTitle(`ﾒﾝﾍﾗ文に変換完了！`)
        .setDescription(`\`\`\`${convertedText}\`\`\``);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
