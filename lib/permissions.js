const { EmbedBuilder } = require('discord.js');
const permissionNames = require('../data/settings/permissions'); 

const commandsRequiringUserPerms = [
    'create role', 
    'create channel', 
    'otherCommand'
];

async function checkPermissions(interaction, requiredPermissions) {
    const mainCommandName = interaction.commandName;
    let subCommandName;

    try {
        subCommandName = interaction.options.getSubcommand();
    } catch {
        subCommandName = null;
    }

    const fullCommandName = subCommandName ? `${mainCommandName} ${subCommandName}` : mainCommandName;
    const isUserPermsCheckRequired = commandsRequiringUserPerms.includes(fullCommandName);

    const missingMemberPerms = isUserPermsCheckRequired 
        ? requiredPermissions.filter(perm => !interaction.member.permissions.has(perm)) 
        : [];
    const missingBotPerms = requiredPermissions.filter(perm => !interaction.guild.members.me.permissions.has(perm));

    if (missingMemberPerms.length || missingBotPerms.length) {
        const missingMemberPermsText = missingMemberPerms.length 
            ? `- あなたに必要な権限\n\`\`\`\n${missingMemberPerms.map(perm => permissionNames[perm] || perm).join('\n')}\n\`\`\`` 
            : '';
        const missingBotPermsText = missingBotPerms.length 
            ? `- BOTに必要な権限\n\`\`\`\n${missingBotPerms.map(perm => permissionNames[perm] || perm).join('\n')}\n\`\`\`` 
            : '';

        const missingPermsEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<:error:1302169165905526805> 権限エラー')
            .setDescription(
                '権限が不足しているため、この操作を実行できません。\n' +
                missingMemberPermsText + missingBotPermsText
            )
            .setFooter({ text: 'Kumanomi | PermissionsError' })
            .setTimestamp();

        await interaction.reply({ embeds: [missingPermsEmbed], ephemeral: true });
        return true;
    }

    return false;
}

module.exports = { checkPermissions };
