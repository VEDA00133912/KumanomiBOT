const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcstatus')
        .setDescription('Minecraftサーバーのステータスを表示します')
        .addStringOption(option => 
            option.setName('ip')
                .setDescription('サーバーのIPアドレス')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('port')
                .setDescription('サーバーのポート番号（省略時は25565）')
                .setRequired(false)),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        const mcServerIp = interaction.options.getString('ip');
        const mcServerPort = interaction.options.getString('port') || '25565';
        const url = `https://mcapi.us/server/status?ip=${mcServerIp}&port=${mcServerPort}`;

        const loadingEmbed = new EmbedBuilder()
            .setColor('#508030')
            .setTitle('サーバーステータスを取得中...')
            .setDescription(`<a:mc:1302169091414687774> サーバーIP: ${mcServerIp}\nポート: ${mcServerPort}`)
            .setFooter({ text: 'Kumanomi | mcstatus', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

    　　　await interaction.reply({ embeds: [loadingEmbed], fetchReply: true });

        try {
            const response = await axios.get(url);
            const data = response.data;

            const status = data.status ? 'オンライン' : 'オフライン';
            const online = data.online.toString();
            const servername = data.server.name || '不明';
            const maxplayer = data.players.max.toString();
            const playerCount = data.players.now.toString();

            const resultEmbed = new EmbedBuilder()
                .setColor('#508030')
                .setTitle(`<a:mc:1302169091414687774> ${mcServerIp}:${mcServerPort} のステータス <a:mc:1302169091414687774>`)
                .addFields(
                    { name: 'ステータス', value: status, inline: true },
                    { name: 'オンライン', value: online, inline: true },
                    { name: 'サーバーのバージョン', value: servername, inline: true },
                    { name: '最大プレイヤー数', value: maxplayer, inline: true },
                    { name: '現在のプレイヤー数', value: playerCount, inline: true }
                )
                .setFooter({ text: 'Kumanomi | mcstatus', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [resultEmbed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    }
};
