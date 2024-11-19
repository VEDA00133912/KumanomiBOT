const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { getPackageInfo } = require('../../lib/npm');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('npm')
    .setDescription('指定されたnpmパッケージの情報を取得します')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addStringOption(option =>
      option.setName('package')
        .setDescription('情報を取得するパッケージ名')
        .setRequired(true)),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;

      await interaction.deferReply();

      const packageName = interaction.options.getString('package');
      const packageInfo = await getPackageInfo(packageName);

      const embed = createEmbed(interaction)
        .setTitle(`NPMパッケージ情報: ${packageInfo.name}`)
        .setURL(`https://npmjs.com/package/${packageInfo.name}`)
        .setImage('https://ul.h3z.jp/nhWmdmz0.png')
        .addFields(
          { name: '名前', value: packageInfo.name, inline:true },
          { name: '最新', value: `v${packageInfo.version}`, inline:true },
          { name: 'ライセンス', value: packageInfo.license, inline:true },
          { name: '制作者', value: packageInfo.author },
          { name: 'ホームページ', value: packageInfo.homepage || 'なし' },
          { name: 'リポジトリ', value: packageInfo.repository || 'なし' },
          { name: 'Last publish', value: packageInfo.lastPublish }
        );

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      if (error.message === '指定されたパッケージが見つかりませんでした') {
        await interaction.editReply({ content: error.message });
      } else {
        slashCommandError(interaction.client, interaction, error);
      }
    }
  },
};