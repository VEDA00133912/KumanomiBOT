const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const cooldown = require('../events/cooldown');
const moderateUsers = require('../../lib/moderate');
const slashCommandError = require('../errors/slashCommandError');
const { checkPermissions } = require('../../lib/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('指定したユーザーのBAN解除をします')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(0)
        .addUserOption(option =>
            option.setName('user1').setDescription('解除するユーザー1').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('解除するユーザー2'))
        .addUserOption(option => option.setName('user3').setDescription('解除するユーザー3'))
        .addStringOption(option =>
            option.setName('reason').setDescription('理由（50文字以内）').setMinLength(1).setMaxLength(50))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        const requiredPermissions = [ PermissionFlagsBits.BanMembers ];
        const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
        if (isMissingPermissions) return;
        
        const reason = interaction.options.getString('reason') || '理由なし';
        const users = ['user1', 'user2', 'user3']
            .map(optionName => interaction.options.getUser(optionName))
            .filter(user => user);

        try {
            await interaction.deferReply({ ephemeral: true });
            const embed = await moderateUsers(interaction, users, 'unban', reason, 'Green', 'unBAN');
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
