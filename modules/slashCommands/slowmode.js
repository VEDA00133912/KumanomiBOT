const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const { createEmbed } = require('../../lib/embed');
const { checkPermissions } = require('../../lib/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('低速モードを設定します')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .addIntegerOption(option => 
            option.setName('時間')
                .setDescription('低速の時間を選択してください')
                .addChoices(
                    { name: '解除 (0秒)', value: 0 },  
                    { name: '5秒', value: 5 },
                    { name: '10秒', value: 10 },
                    { name: '15秒', value: 15 },
                    { name: '30秒', value: 30 },
                    { name: '1分', value: 60 },
                    { name: '2分', value: 120 },
                    { name: '5分', value: 300 },
                    { name: '10分', value: 600 },
                    { name: '15分', value: 900 },
                    { name: '1時間', value: 3600 },
                    { name: '2時間', value: 7200 },
                    { name: '6時間', value: 21600 }
                )
                .setRequired(true)),
    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        const requiredPermissions = [ PermissionFlagsBits.ManageChannels ];
        const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
        if (isMissingPermissions) return;
       
        const duration = interaction.options.getInteger('時間');

        try {
            await interaction.deferReply({ ephemeral: true });

            await interaction.channel.setRateLimitPerUser(duration);
            
            const successEmbed = createEmbed(interaction)
                .setDescription(`低速を${duration}秒に設定しました。`);
            
            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};