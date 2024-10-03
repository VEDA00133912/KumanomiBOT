const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { generateNitroLinks } = require('../../lib/gen-fakenitro'); 
const { generateTokens } = require('../../lib/gen-faketoken'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fake')
    .setDescription('フェイクリンクやトークンを生成する')
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
            .setMaxValue(10)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('token')
        .setDescription('フェイクTokenを生成')
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('生成する数 (最大10)')
            .setRequired(true)
            .setMaxValue(10))),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

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
      .setFooter({ text: 'Emubot | 生成中', iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [loadingEmbed], ephemeral: true });
  },

  async executeNitro(interaction) {
    await this.sendLoadingEmbed(interaction, '#f47fff', '生成中...お待ちください。');

    const quantity = interaction.options.getInteger('count');
    const type = interaction.options.getString('type');
    const nitroLinks = generateNitroLinks(quantity, type);

    const resultEmbed = new EmbedBuilder()
      .setColor('#f47fff')
      .setTimestamp()
      .setFooter({ text: 'Emubot | fake nitro', iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription(`<a:boost:1282164483665428541> **Fake ${type === 'nitro' ? 'Nitro Gift' : 'Promo Nitro'} Links** <a:boost:1282164483665428541>\n${type === 'nitro' ? 'Nitroギフトリンク' : 'プロモNitroリンク'}\n${nitroLinks.join('\n')}`);

    await interaction.editReply({ embeds: [resultEmbed] });
  },

  async executeToken(interaction) {
    await this.sendLoadingEmbed(interaction, '#7289da', '生成中...お待ちください。');

    const quantity = interaction.options.getInteger('count');
    const tokens = generateTokens(interaction.guild.members.cache, quantity); 

    const resultEmbed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle('Token')
      .setTimestamp()
      .setFooter({ text: 'Emubot | faketoken', iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription(tokens.join('\n'));

    await interaction.editReply({ embeds: [resultEmbed], ephemeral: true });
  },
};