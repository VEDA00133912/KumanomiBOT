const { EmbedBuilder } = require('discord.js');

async function moderateUsers(interaction, users, action, reason, successColor, actionVerb) {
    const successUsers = [];
    const skippedUsers = [];
    const failedUsers = [];

    const bannedUsers = action === 'unban' ? await interaction.guild.bans.fetch() : null;

    for (const user of users) {
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (action === 'ban' && member && member.bannable) {
            try {
                await interaction.guild.members.ban(user, { reason });
                successUsers.push(`${user.tag} (ID: ${user.id})`);
            } catch (error) {
                failedUsers.push(`${user.tag} (エラー: ${error.message})`);
            }
        } else if (action === 'kick' && member && member.kickable) {
            try {
                await member.kick(reason);
                successUsers.push(`${user.tag} (ID: ${user.id})`);
            } catch (error) {
                failedUsers.push(`${user.tag} (エラー: ${error.message})`);
            }
        } else if (action === 'unban' && bannedUsers && bannedUsers.has(user.id)) {
            try {
                await interaction.guild.members.unban(user.id, reason);
                successUsers.push(`${user.tag} (ID: ${user.id})`);
            } catch (error) {
                failedUsers.push(`${user.tag} (エラー: ${error.message})`);
            }
        } else {
            if (action === 'unban') {
                skippedUsers.push(`${user.tag} (BAN済)`);
            } else if (action === 'kick') {
                skippedUsers.push(`${user.tag} (退出済み)`);
            } else {
                skippedUsers.push(`${user.tag} (未BAN)`);
            }
        }
    }

    const embed = new EmbedBuilder()
        .setColor(successColor)
        .setTitle(`${actionVerb}結果`)
        .addFields(
            { name: '理由', value: reason },
            { name: `${actionVerb}成功`, value: successUsers.join('\n') || 'なし', inline: true },
            { name: `${actionVerb}失敗`, value: failedUsers.join('\n') || 'なし', inline: true },
            { name: '不要', value: skippedUsers.join('\n') || 'なし', inline: true }
        )
        .setFooter({ text: `Kumanomi | ${actionVerb}`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

    return embed;
}

module.exports = moderateUsers;
