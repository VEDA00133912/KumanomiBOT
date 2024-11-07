const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { checkRedirect } = require('../../lib/redirect');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('redirect')
        .setDescription('指定されたURLのリダイレクト情報を表示します。')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('リダイレクトをチェックするURL')
                .setRequired(true)),
    
    async execute(interaction) {
        const commandName = this.data.name;
        if (cooldown(commandName, interaction)) return;

        try {
            await interaction.deferReply();

            const url = interaction.options.getString('url');
            const redirectResult = await checkRedirect(url);

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTimestamp()
                .setFooter({ text: 'Kumanomi | redirect', iconURL: interaction.client.user.displayAvatarURL() });

            redirectResult.forEach((item, index) => {
                embed.addFields(
                    { name: `リダイレクト先 ${index + 1}`, value: item.url || 'アクセスできません', inline: false }
                );
            });

            return interaction.editReply({ embeds: [embed] });

        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
