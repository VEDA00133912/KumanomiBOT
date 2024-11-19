const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('song')
        .setDescription('癖になる')
        .setContexts(0,1,2)
        .setIntegrationTypes(0,1)
        .addSubcommand(subcommand =>
            subcommand
                .setName('kongyo')
                .setDescription('『コンギョ』のリンクを表示します')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sonshi')
                .setDescription('『尊師マーチ』のリンクを表示します')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const commandName = `song ${subcommand}`;
        if (cooldown(commandName, interaction)) return;

        try {
            if (subcommand === 'kongyo') {
                await interaction.reply(':flag_kp: https://www.youtube.com/watch?v=IkOEbH7lawI');
            } else if (subcommand === 'sonshi') {
                await interaction.reply(':woman_tone1_beard:　https://youtu.be/W1iwjWmOkuI?si=QCwRuvBR-FVVsdO5');
            }
        } catch (error) {
           slashCommandError(interaction.client, interaction, error);
        }
    },
};
