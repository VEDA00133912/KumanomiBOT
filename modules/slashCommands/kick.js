const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const cooldown = require('../events/cooldown');
const moderateUsers = require('../../lib/moderate');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('指定したユーザーをキックします')
  　　  .setDMPermission(false)
        .addUserOption(option =>
            option.setName('user1').setDescription('キックするユーザー1').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('キックするユーザー2'))
        .addUserOption(option => option.setName('user3').setDescription('キックするユーザー3'))
        .addStringOption(option =>
            option.setName('reason').setDescription('理由（50文字以内）').setMinLength(1).setMaxLength(50))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
          return interaction.reply({ content: '<:error:1302169165905526805> BOTにKick権限がありません。', ephemeral: true });
        }
        
        const reason = interaction.options.getString('reason') || '理由なし';
        const users = ['user1', 'user2', 'user3']
            .map(optionName => interaction.options.getUser(optionName))
            .filter(user => user);

        try {
            await interaction.deferReply({ ephemeral: true });
            const embed = await moderateUsers(interaction, users, 'kick', reason, 'Orange', 'キック');
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
