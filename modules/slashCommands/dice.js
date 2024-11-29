const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('多面ダイスを振ります')
        .setIntegrationTypes(0,1)
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('振る個数を指定してください')
                .setMinValue(1)
                .setMaxValue(100))
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('サイコロの最大値を指定してください')
                .setMinValue(1)
                .setMaxValue(1000)),

    async execute(interaction) {
        try {
            const commandName = this.data.name;
            const isCooldown = cooldown(commandName, interaction);
            if (isCooldown) return;
            
            await interaction.deferReply({ ephemeral: true });

            const count = interaction.options.getInteger('count') || 1;
            const max = interaction.options.getInteger('max') || 100;

            const results = [];
            for (let i = 0; i < count; i++) {
                const rollResult = Math.floor(Math.random() * max) + 1;
                results.push(rollResult);
            }

            const resultsString = results.join(', ');

            const embed = createEmbed(interaction)
                .setTitle(`🎲 ${count}d${max} Results`)
                .setDescription(`**${resultsString}**`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
