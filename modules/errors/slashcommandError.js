const { EmbedBuilder, DiscordAPIError } = require('discord.js');
const config = require('../../data/settings/config.json');

module.exports = async function handleSlashCommandError(client, interaction, error) {
    try {
        const commandId = interaction.commandId;

        if (error instanceof DiscordAPIError && error.code === 10062) {
            const errorMessage = await interaction.channel.send({
                content: `<:error:1302169165905526805> </${interaction.commandName}:${commandId}> の実行中にエラーが発生しました。`
            });
            setTimeout(() => errorMessage.delete().catch(console.error), 5000);
        } else {
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({
                    content: `<:error:1302169165905526805> </${interaction.commandName}:${commandId}> の実行中にエラーが発生しました。`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `<:error:1302169165905526805> </${interaction.commandName}:${commandId}> の実行中にエラーが発生しました。`,
                    ephemeral: true
                });
            }
        }
    } catch (followUpError) {
        console.error('followupメッセージの送信に失敗しました:', followUpError);
        try {
            const errorMessage = await interaction.channel.send({
                content: `<:error:1302169165905526805> ${interaction.commandName} コマンドの実行中にエラーが発生しました。`
            });
            setTimeout(() => errorMessage.delete().catch(console.error), 5000);
        } catch (sendError) {
            console.error('メッセージの送信にも失敗しました:', sendError);
        }
    }

    const errorEmbed = new EmbedBuilder()
        .setTitle(`Error: ${error.name}`)
        .setColor('Red')
        .setDescription(`**/${interaction.commandName}** の実行中にエラーが発生しました`)
        .addFields(
            { name: 'Error', value: `\`\`\`${error.message}\`\`\`` },
            { name: 'Command', value: `${interaction.commandName}`, inline: true },
            { name: 'Server', value: interaction.guild ? interaction.guild.name : 'DM', inline: true },
            { name: 'Channel', value: interaction.channel ? interaction.channel.name : 'DM', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Kumanomi | slashCommandError`, iconURL: client.user.displayAvatarURL() });

    const errorChannelId = config.errorLogChannelId;
    const errorChannel = client.channels.cache.get(errorChannelId);

    if (errorChannel) {
        await errorChannel.send({ embeds: [errorEmbed] });
    } else {
        console.error('エラーログチャンネルが見つかりません。');
    }
    console.error(`/${interaction.commandName}実行中にエラーが発生しました:`, error);
};
