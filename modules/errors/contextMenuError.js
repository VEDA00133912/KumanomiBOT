const { EmbedBuilder, DiscordAPIError } = require('discord.js'); // DiscordAPIErrorをインポート
const config = require('../../data/settings/config.json');

module.exports = async function handleContextMenuError(client, interaction, error) {
    try {
        const errorMessage = `<:error:1299263288797827185> **${interaction.commandName}** の実行中にエラーが発生しました。`;

        if (error instanceof DiscordAPIError && error.code === 10062) {
            const message = await interaction.channel.send({
                content: errorMessage
            });
            setTimeout(() => message.delete().catch(console.error), 5000); 
        } else {
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({
                    content: errorMessage,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: errorMessage,
                    ephemeral: true
                });
            }
        }
    } catch (followUpError) {
        console.error('followupメッセージの送信に失敗しました:', followUpError);
    }

    const errorEmbed = new EmbedBuilder()
        .setTitle(`Error: ${error.name}`)
        .setColor('Red')
        .setDescription(`**${interaction.commandName}**の実行中にエラーが発生しました`)
        .addFields(
            { name: 'Error', value: `\`\`\`${error.message}\`\`\`` },
            { name: 'Command', value: `${interaction.commandName}`, inline: true },
            { name: 'Server', value: interaction.guild ? interaction.guild.name : 'N/A', inline: true },
            { name: 'Channel', value: `${interaction.channel.name}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Kumanomi | contextMenuError`, iconURL: client.user.displayAvatarURL() });

    const errorChannelId = config.errorLogChannelId;
    const errorChannel = client.channels.cache.get(errorChannelId);

    if (errorChannel) {
        await errorChannel.send({ embeds: [errorEmbed] });
    } else {
        console.error('エラーログチャンネルが見つかりません。');
    }

    console.error(`${interaction.commandName}実行中にエラーが発生しました:`, error);
};
