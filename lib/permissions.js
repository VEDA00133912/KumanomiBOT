const { EmbedBuilder } = require('discord.js');
const permissionNames = require('../data/settings/permissions'); 

async function checkPermissions(interaction, requiredPermissions) {
    const missingMemberPerms = requiredPermissions.filter(perm => !interaction.member.permissions.has(perm));
    const missingBotPerms = requiredPermissions.filter(perm => !interaction.guild.members.me.permissions.has(perm));

    if (missingMemberPerms.length || missingBotPerms.length) {
        const missingPermsEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<:error:1302169165905526805> 権限エラー')
            .setDescription(
                '権限が不足しているため、この操作を実行できません。\n' +
                (missingMemberPerms.length ? `- あなたに必要な権限\n \`\`\`${missingMemberPerms.map(perm => permissionNames[perm] || perm).join('\n')}\`\`\`` : '') +
                (missingBotPerms.length ? `\n- BOTに必要な権限\n \`\`\`${missingBotPerms.map(perm => permissionNames[perm] || perm).join('\n')}\`\`\`` : '')
            )
            .setFooter({ text: 'Kumanomi | PermissionsError'})
            .setTimestamp();

        await interaction.reply({ embeds: [missingPermsEmbed], ephemeral: true });
        return true;
    }
    return false;
}

module.exports = { checkPermissions };