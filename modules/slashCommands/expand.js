const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const SETTINGS_FILE = path.join(__dirname, '..', '..', 'data', 'settings', 'msglink.json');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('expand-settings')
        .setDescription('メッセージリンクの展開をオンまたはオフにします。')
        .addStringOption(option =>
            option.setName('on-off')
                .setDescription('オンかオフを選択')
                .setRequired(true)
                .addChoices(
                    { name: 'ON', value: 'true' },
                    { name: 'OFF', value: 'false' },
                )),
    
    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'あなたに管理者権限がありません。', ephemeral: true });
        }

        const status = interaction.options.getString('on-off') === 'true';
        let settings = {};

        try {
            await interaction.deferReply({ ephemeral: true });

            if (fs.existsSync(SETTINGS_FILE)) {
                try {
                    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
                    settings = JSON.parse(data);
                } catch (error) {
                    await interaction.followUp({ content: '<:error:1282141871539490816> 設定ファイルの読み込み中にエラーが発生しました。', ephemeral: true });
                    slashCommandError(interaction.client, interaction, error);
                }
            }

            const currentStatus = settings[interaction.guild.id];

            if (currentStatus === status) {
                const embed = new EmbedBuilder()
                    .setTitle('設定変更')
                    .setDescription(`<:error:1282141871539490816> すでに${status ? 'ON' : 'OFF'}になっています。`)
                    .setColor(status ? 'Green' : 'Red')
                    .setTimestamp();

                return interaction.followUp({ embeds: [embed] });
            }

            settings[interaction.guild.id] = status;

            try {
                fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
            } catch (error) {
                await interaction.followUp({ content: '<:error:1282141871539490816> 設定の保存中にエラーが発生しました。', ephemeral: true });
                await sendErrorLog(interaction.client, error, interaction.commandName, __filename);
            }

            const embed = new EmbedBuilder()
                .setDescription(`<:check:1282141869387550741> **メッセージリンクの展開は ${status ? 'ON' : 'OFF'} になりました。**`)
                .setColor(status ? 'Green' : 'Red')
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
