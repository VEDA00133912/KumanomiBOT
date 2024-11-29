const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('IP情報の表示')
        .setIntegrationTypes(0,1)
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('調べたいIP')
                .setRequired(true)),

    async execute(interaction) {

        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        const ip2_API = process.env.ip_API;
        const ip = interaction.options.getString('ip');
        await interaction.deferReply({ ephemeral: true });

        try {
            const response = await axios.get(`https://api.ip2location.io/?key=${ip2_API}&ip=${ip}`);
            const data = response.data;

            const embed = createEmbed(interaction)
            
            .setDescription(`<:ip:1303923661136461830> IP Lookup for ${ip}`)
            .addFields(
                { name: '国', value: data.country_name || 'None', inline: true },
                { name: '地域', value: data.region_name || 'None', inline: true },
                { name: '都市', value: data.city_name || 'None', inline: true },
                { name: '緯度', value: data.latitude ? data.latitude.toString() : 'None', inline: true },
                { name: '経度', value: data.longitude ? data.longitude.toString() : 'None', inline: true },
                { name: 'タイムゾーン', value: data.time_zone || 'None', inline: true },
                { name: 'ASN', value: data.asn || 'None', inline: true },
                { name: 'ISP', value: data.isp || 'None', inline: true }
                );

            await interaction.editReply(
                { embeds: [embed] }
            );
        } catch (error) {
            if (error.response && [400, 404, 401].includes(error.response.status)) {
                await interaction.editReply('<:error:1282141871539490816> 無効なIPです。正しい形式のIPアドレスを入力してください。');
            } else {
                slashCommandError(interaction.client, interaction, error);
            }
        }
    },
};
