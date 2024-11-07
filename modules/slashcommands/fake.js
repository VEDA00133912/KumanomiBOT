const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { generateNitroLinks } = require('../../lib/gen-fakenitro'); 
const { generateTokens } = require('../../lib/gen-faketoken'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fake')
    .setDescription('フェイクNitroやトークンの生成')
    .setDMPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName('nitro')
        .setDescription('フェイクのNitroリンクを生成')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('リンクの種類を選択')
            .setRequired(true)
            .addChoices(
              { name: 'Nitroギフト形式', value: 'nitro' },
              { name: 'プロモNitro形式', value: 'promo' }
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('生成する数 (最大10)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('token')
        .setDescription('フェイクのTokenを生成')
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('生成する数 (最大10)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10))),

  async execute(interaction) {
    const commandName = this.data.name;
    if (cooldown(commandName, interaction)) return;

    try {
      const subCommand = interaction.options.getSubcommand();

      if (subCommand === 'nitro') {
        await this.executeNitro(interaction);
      } else if (subCommand === 'token') {
        await this.executeToken(interaction);
      }
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },

  async sendLoadingEmbed(interaction, color, description) {
    const loadingEmbed = new EmbedBuilder()
      .setColor(color)
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: 'Kumanomi | generating...', iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });
  },

  async executeNitro(interaction) {
    await this.sendLoadingEmbed(interaction, '#f47fff', '<a:loading:1302169108888162334> 生成中...');

    const quantity = interaction.options.getInteger('count');
    const type = interaction.options.getString('type');
    const nitroLinks = generateNitroLinks(quantity, type);

    const resultEmbed = new EmbedBuilder()
      .setColor('#f47fff')
      .setTimestamp()
      .setFooter({ text: 'Kumanomi | fake nitro', iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription(`<a:boost:1302168991015506003> **Fake ${type === 'nitro' ? 'Nitro Gift' : 'Promo Nitro'} Links** <a:boost:1302168991015506003>\n${type === 'nitro' ? 'Nitroギフトリンク' : 'プロモNitroリンク'}\n${nitroLinks.join('\n')}`);

    await interaction.editReply({ embeds: [resultEmbed] });
  },

  async executeToken(interaction) {
    await this.sendLoadingEmbed(interaction, '#7289da', '<a:loading:1302169108888162334> 生成中...');

    const quantity = interaction.options.getInteger('count');
    const tokens = generateTokens(interaction.guild.members.cache, quantity); 

    const resultEmbed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle('Token')
      .setTimestamp()
      .setFooter({ text: 'Kumanomi | fake token', iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription(tokens.join('\n'));

    await interaction.editReply({ embeds: [resultEmbed], ephemeral: true });
  },
};
