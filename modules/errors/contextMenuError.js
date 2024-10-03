const { EmbedBuilder } = require('discord.js');
const config = require('../../data/settings/config.json');

module.exports = async function handlecontextMenuError(client, interaction, error) {
    try {
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({
                content: `<:error:1282141871539490816> **${interaction.commandName}** の実行中にエラーが発生しました。`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `<:error:1282141871539490816> **${interaction.commandName}** の実行中にエラーが発生しました。`,
                ephemeral: true
            });
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
        .setFooter({ text: `Emubot | contextMenuError`, iconURL: client.user.displayAvatarURL() });

    const errorChannelId = config.errorLogChannelId;
    const errorChannel = client.channels.cache.get(errorChannelId);

    if (errorChannel) {
        await errorChannel.send({ embeds: [errorEmbed] });
    } else {
        console.error('エラーログチャンネルが見つかりません。');
    }

    console.error(`${interaction.commandName}実行中にエラーが発生しました:`, error);
};
