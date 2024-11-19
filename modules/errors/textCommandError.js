const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require('../../data/settings/config.json');

module.exports = async function handletextCommandError(client, message, error, fileName) {
    try {
        const replyMessage = await message.reply({
            content: '<:error:1302169165905526805> エラーが発生しました',
            allowedMentions: { repliedUser: false } 
        });

        setTimeout(() => {
            replyMessage.delete().catch(console.error);
        }, 5000);

        const FileName = path.basename(fileName);

        const errorEmbed = new EmbedBuilder()
            .setTitle(`Error: ${error.name}`)
            .setColor('Red')
            .setDescription(`**${FileName}**の実行中にエラーが発生しました。`)
            .addFields(
                { name: 'Error', value: `\`\`\`${error.message}\`\`\`` },
                { name: 'command', value: FileName, inline: true },
                { name: 'server', value: message.guild.name, inline: true },
                { name: 'channel', value: message.channel.name, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Kumanomi | textCommandError', iconURL: client.user.displayAvatarURL() });

        const errorChannelId = config.errorLogChannelId;
        const errorChannel = client.channels.cache.get(errorChannelId);

        if (errorChannel) {
            await errorChannel.send({ embeds: [errorEmbed] });
        } else {
            console.error('エラーログチャンネルが見つかりません。');
        }

        console.error(`${FileName} テキストコマンド実行中にエラーが発生しました:`, error);
    } catch (followUpError) {
        console.error('エラーハンドリングの実行中にエラーが発生しました:', followUpError);
    }
};
