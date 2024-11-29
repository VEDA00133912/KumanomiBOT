const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const cleanDomainURL = require('../../lib/whois');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('WHOIS情報の表示')
        .setIntegrationTypes(0, 1)
        .addStringOption(option =>
            option.setName('domain')
                .setDescription('調べたいドメイン')
                .setRequired(true)),

    async execute(interaction) {
        const commandName = this.data.name;
        if (cooldown(commandName, interaction)) return;

        await interaction.deferReply({ ephemeral: true });

        const ip2_API = process.env.ip_API;

        try {
            let domain = interaction.options.getString('domain');
            domain = cleanDomainURL(domain); 

            const response = await axios.get(`https://api.ip2whois.com/v2?key=${ip2_API}&domain=${domain}`);
            const data = response.data;

            const embed = createEmbed(interaction)
            .setDescription(`<:whois:1303923675191447644> WHOIS Lookup for ${domain}`)
            .addFields(
                { name: '作成日', value: data.create_date || 'None' },
                { name: '更新日', value: data.update_date || 'None' },
                { name: '有効期限', value: data.expire_date || 'None' },
                { name: '登録者名', value: data.registrant.name || 'None' },
                { name: '登録者地域', value: data.registrant.city || 'None' },
                { name: 'email', value: data.registrant.email || 'None' }
                );

            await interaction.editReply(
                { embeds: [embed] }
            );
        } catch (error) {
            if (error.response && [400, 404, 401].includes(error.response.status)) {
                await interaction.editReply('<:error:1302169165905526805> 無効なドメインです。');
            } else {
                slashCommandError(interaction.client, interaction, error);
            }
        }
    },
};