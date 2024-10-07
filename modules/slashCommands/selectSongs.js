const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const random = require('../../lib/selectSongs'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('select')
    .setDescription('曲を選択します。')
    .addSubcommand(subcommand =>
      subcommand
        .setName('taiko')
        .setDescription('太鼓の達人の曲をランダムに選択します。')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します。')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: '★10', value: 'level10' },
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します。')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('maimai')
        .setDescription('maimaiの曲をランダムに選択します。')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します。')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: 'オリジナルのみ', value: 'maimai' },
              { name: '宴譜面のみ', value: 'utage' },
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します。')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('chunithm')
        .setDescription('チュウニズムの曲をランダムに選択します。')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します。')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: 'オリジナルのみ', value: 'original' },
              { name: 'WE譜面&ULTIMAのみ', value: 'weul' },
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します。')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('prsk')
        .setDescription('プロセカの曲をランダムに選択します。')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します。')
            .setRequired(true)
            .addChoices(
              { name: 'MASTER', value: 'master' },
              { name: 'APPEND', value: 'append' },
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します。')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ongeki')
        .setDescription('オンゲキの曲をランダムに選択します。')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します。')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: 'オンゲキジャンル', value: 'ongeki' },
              { name: 'LUNATICのみ', value: 'lunatic' },
              { name: 'ReMASTERのみ', value: 'remaster' },
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します。')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const commandName = subcommand;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    const option = interaction.options.getString('action');
    const count = interaction.options.getInteger('count');
    const embedColor = subcommand === 'taiko' ? '#ff7c04' : 
                       subcommand === 'maimai' ? '#58bcf4' : 
                       subcommand === 'chunithm' ? '#fffc3c' : 
                       subcommand === 'prsk' ? '#34ccbc' : 
                       subcommand === 'ongeki' ? '#dccaf6' : 
                       '#f8b4cb'; 
    const loadingMessage = '<a:loading:1259148838929961012> 選曲中...';

    const embedLoading = new EmbedBuilder()
      .setDescription(loadingMessage)
      .setColor(embedColor);

    await interaction.reply({ embeds: [embedLoading] });

    setTimeout(async () => {
      await random.getRandomSongs(interaction, commandName, subcommand, option, count, embedColor);
    }, 1000); 
  },
};
