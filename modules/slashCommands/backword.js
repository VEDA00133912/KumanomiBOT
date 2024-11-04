const { SlashCommandBuilder } = require('discord.js');
const { convertText } = require('../../lib/convert');
const { validateMessageContent } = require('../../lib/invalidContent');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backword')
    .setDescription('文字列を逆読みします。')
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

      const convertedText = convertText('reverse', text);

      const embed = createEmbed(interaction)
        .setTitle(`逆読みに変換完了！`)
        .setDescription(`\`\`\`${convertedText}\`\`\``);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
