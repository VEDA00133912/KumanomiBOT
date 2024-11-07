const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { createEmbed } = require('../../lib/embed');
const { generateUUID } = require('../../lib/uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uuid')
        .setDescription('UUIDを生成します')
        .setContexts(0,1,2)
        .setIntegrationTypes(0,1)
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('生成するUUIDの数')
                .setMinValue(1)
                .setMaxValue(10)
        ),

    async execute(interaction) {
      const commandName = this.data.name;
      if (cooldown(commandName, interaction)) return;

        const count = interaction.options.getInteger('count');
        
        try {
            await interaction.deferReply({ ephemeral: true });

            const uuids = Array.from({ length: count }, () => generateUUID());

            const embed = createEmbed(interaction)
                .setDescription(uuids.map(uuid => `\`\`\`${uuid}\`\`\``).join('\n'));

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            slashCommandError(interaction, error);
        }
    },
};
