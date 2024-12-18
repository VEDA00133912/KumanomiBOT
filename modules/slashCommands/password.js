const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const generatePasswords = require('../../lib/password');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('password')
        .setDescription('指定した長さのパスワードを生成します')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(0)
        .addIntegerOption(option =>
            option.setName('length')
                .setDescription('パスワードの長さを1から64の範囲で指定')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(64))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('生成するパスワードの個数（最大10個）')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        try {
            const length = interaction.options.getInteger('length');
            const count = interaction.options.getInteger('count');

            const creatingEmbed = createEmbed(interaction)
                .setTitle('パスワード生成中...')
                .setDescription('<a:loading:1259148838929961012> パスワードを生成しています...');

            await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

            const passwords = generatePasswords(length, count);

            const resultEmbed = createEmbed(interaction)
                .setTitle('生成されたパスワード')
           　　 .setDescription(passwords.map(password => `\`\`\`${password}\`\`\``).join('\n'));

            await interaction.editReply({ embeds: [resultEmbed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};