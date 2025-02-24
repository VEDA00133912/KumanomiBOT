const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { extractMessageData, generateQuote } = require('../../lib/miq.js');
const { isInvalidContent, replyInvalidContent } = require('../../lib/contentCheck.js');
const cooldown = require('../events/cooldown');
const contextMenuError = require('../errors/contextMenuError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Make it a Quote')
        .setType(ApplicationCommandType.Message)
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1),

    async execute(interaction) {
        /*
        await interaction.reply({ content: '<:error:1302169165905526805> 現在Make it a Quoteは使用できません。', ephemeral: true });
        return;
        */
        
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        const message = interaction.targetMessage;

        if (isInvalidContent(message)) {
            return replyInvalidContent(interaction);
        }

        const { username, displayName, text, avatar } = extractMessageData(message);

        try {
            await interaction.deferReply();

            const resultImageUrl = await generateQuote({
                username,
                displayName,
                text,
                avatar,
                color: false,
            });

            const embed = createEmbed(interaction).setImage(resultImageUrl);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            contextMenuError(interaction.client, interaction, error);
        }
    },
};
