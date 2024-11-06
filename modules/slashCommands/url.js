const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { config } = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const path = require('path');
const { createEmbed } = require('../../lib/embed');
const { isValidUrl, processVirusCheckResults, invalidUrlMessage } = require('../../lib/url');
config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('url')
        .setDescription('URL関連のコマンド')
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1)
        .addSubcommand(subcommand =>
            subcommand.setName('viruscheck')
                .setDescription('URLの危険性を判断します')
                .addStringOption(option => 
                    option.setName('url').setDescription('URLを入力してください').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('extract')
                .setDescription('テキストまたはファイルからURLを抽出します')
                .addStringOption(option => 
                    option.setName('text').setDescription('抽出するテキスト'))
                .addBooleanOption(option =>
                    option.setName('remove').setDescription('重複を削除しますか？'))
                .addBooleanOption(option => 
                    option.setName('domainonly').setDescription('ドメインのみを抽出しますか？'))
                .addAttachmentOption(option => 
                    option.setName('file').setDescription('URLを抽出するファイル')))
        .addSubcommand(subcommand =>
            subcommand.setName('short')
                .setDescription('URLを短縮します')
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('短縮したいURLを入力してください')
                        .setRequired(true))),

    async execute(interaction) {
        const commandName = interaction.commandName + '-' + interaction.options.getSubcommand();
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        if (interaction.options.getSubcommand() === 'viruscheck') {
            await this.virusCheck(interaction);
        } else if (interaction.options.getSubcommand() === 'extract') {
            await this.extractUrls(interaction);
        } else if (interaction.options.getSubcommand() === 'short') {
            await this.shortUrl(interaction);
        }
    },

    async virusCheck(interaction) {
        const url = interaction.options.getString('url');

        if (!isValidUrl(url)) {
            return interaction.reply(invalidUrlMessage());
        }

        const apiKey = process.env.VIRUSTOTAL_API_KEY;

        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('URL Check')
            .setDescription(`Checking the URL: ${url} <a:loading:1302169108888162334>`)
            .setColor('Yellow');

        await interaction.editReply({ embeds: [embed], ephemeral: true });

        try {
            const encodedUrl = Buffer.from(url).toString('base64').replace(/=/g, '');
            const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
                headers: { 'x-apikey': apiKey }
            });

            if (response.status !== 200) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('URL チェック結果')
                    .setDescription(`<:error:1302169165905526805> このサイトは無効です。`)
                    .setColor('Red');

                return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }

            const { detected, clean, unrated } = processVirusCheckResults(response.data);

            let descriptionMessage = '';
            let color = 'Green';

            if (detected.length === 0) {
                descriptionMessage = '<:check:1302169183110565958> このURLは安全です <:check:1302169183110565958>';
            } else if (detected.length <= 2) {
                descriptionMessage = '<:warn:1302169126873206794> このURLは危険な可能性があります <:warn:1302169126873206794>';
                color = 'Yellow';
            } else {
                descriptionMessage = '<:danger:1302169143365341244> このURLは危険である可能性が非常に高いです <:danger:1302169143365341244>';
                color = 'Red';
            }

            const embedResult = new EmbedBuilder()
                .setTitle('URLチェック完了')
                .setFooter({ text: 'Kumanomi | url viruscheck', iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`診断URL: ${url}\n${descriptionMessage}`)
                .setColor(color);

            [...detected, ...clean, ...unrated].slice(0, 25).forEach(result => {
                embedResult.addFields({ name: result.engine, value: result.result || 'clean', inline: true });
            });

            await interaction.editReply({ embeds: [embedResult], ephemeral: true });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const notFoundEmbed = new EmbedBuilder()
                    .setTitle('URL チェック結果')
                    .setDescription('<:error:1302169165905526805> URLが見つかりませんでした。無効なURLの可能性があります。')
                    .setColor('Red');
                
                return interaction.editReply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            slashCommandError(interaction.client, interaction, error);
        }
    },

    async extractUrls(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const text = interaction.options.getString('text');
        const file = interaction.options.getAttachment('file');
        let urls = text ? text.match(/https?:\/\/[^\s]+/g) : [];

        if (file) {
            const fileContent = await (await axios.get(file.url)).data;
            urls = urls.concat(fileContent.match(/https?:\/\/[^\s]+/g) || []);
        }

        if (urls.length) {
            if (interaction.options.getBoolean('domainonly')) urls = urls.map(url => new URL(url).origin);
            if (interaction.options.getBoolean('remove')) urls = [...new Set(urls)];

            const filePath = path.join(__dirname, 'urls.txt');
            fs.writeFileSync(filePath, urls.join('\n'), 'utf8');
            const fileUpload = new AttachmentBuilder(filePath);

            await interaction.editReply({ content: '<:check:1302169183110565958> 抽出完了！', files: [fileUpload], ephemeral: true });
            fs.unlinkSync(filePath);
        } else {
            slashCommandError(interaction.client, interaction, new Error('URLが見つかりませんでした'));
        }
    },

    async shortUrl(interaction) {
        const urlToShorten = interaction.options.getString('url');
        const apiKey = process.env.xgd_API;

        await interaction.deferReply({ ephemeral: true });

        if (!isValidUrl(urlToShorten)) {
            return interaction.editReply(invalidUrlMessage());
        }

        try {
            const response = await axios.get(`https://xgd.io/V1/shorten?url=${encodeURIComponent(urlToShorten)}&key=${apiKey}`);

            if (response.status === 200 && response.data.status === 200) {
                const Url = response.data.shorturl;
                const shortenedUrl = `<${Url}>`;

                const embed = createEmbed(interaction)
                    .setDescription(`<:check:1302169183110565958> 短縮されたURL: ${shortenedUrl}`)
                    .setColor('Green');
                await interaction.editReply({ embeds: [embed], ephemeral: true });
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('URL短縮エラー')
                    .setDescription('<:error:1302169165905526805> 短縮に失敗しました。')
                    .setColor('Red');
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    }
};