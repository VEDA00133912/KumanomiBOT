const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const googleSearch = require('../../lib/google');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('情報を検索します')
    .addSubcommand(subcommand =>
      subcommand
        .setName('gif')
        .setDescription('指定したワードに関するGIFを送信します')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('検索したいワード')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('google')
        .setDescription('Google検索を行います')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('検索ワード')
            .setRequired(true))),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const query = interaction.options.getString('query');
    const commandName = `search-${subcommand}`;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    await interaction.deferReply();
    
    try {
      if (subcommand === 'gif') {
        const apiKey = process.env.tenorAPI;
        const response = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${apiKey}&random=true`);
        const gifUrl = response.data.results[0].media_formats.gif.url;

      const embed = createEmbed(interaction)
          .setTitle(`${query}のGIFです！`)
          .setImage(gifUrl);

        await interaction.editReply({ embeds: [embed] });

      } else if (subcommand === 'google') {
        const searchResults = await googleSearch(query);

        if (searchResults.length === 0) {
          return interaction.editReply('検索結果が見つかりませんでした。');
        }

      const embed = createEmbed(interaction)
          .setDescription(`Google検索結果: **${query}**`);
        
        searchResults.forEach(result => {
          embed.addFields({ name: result.title, value: result.link });
        });

        await interaction.editReply({ embeds: [embed] });
      }
      
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
