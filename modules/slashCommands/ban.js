const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const cooldown = require('../events/cooldown');
const moderateUsers = require('../../lib/moderate');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('指定したユーザーをBANします')
        .addUserOption(option =>
            option.setName('user1').setDescription('BANするユーザー1').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('BANするユーザー2'))
        .addUserOption(option => option.setName('user3').setDescription('BANするユーザー3'))
        .addStringOption(option =>
            option.setName('reason').setDescription('理由（50文字以内）').setMinLength(1).setMaxLength(50))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),


    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
          return interaction.reply({ content: '<:error:1302169165905526805> BOTにBAN権限がありません。', ephemeral: true });
        }
        
        const reason = interaction.options.getString('reason') || '理由なし';
        const users = ['user1', 'user2', 'user3']
            .map(optionName => interaction.options.getUser(optionName))
            .filter(user => user);

        try {
            await interaction.deferReply({ ephemeral: true });
            const embed = await moderateUsers(interaction, users, 'ban', reason, 'Red', 'BAN');
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
