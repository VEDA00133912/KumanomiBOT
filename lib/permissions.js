const { EmbedBuilder } = require('discord.js');
const permissionNames = require('../data/settings/permissions'); 

// ユーザー権限を確認する必要がある特定のコマンドとサブコマンドの組み合わせ
const commandsRequiringUserPerms = [
    'create role', // サブコマンドを含む場合
    'create channel', 
    'create emoji'
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

    const userMember = interaction.member;
    if (!userMember) {
        console.error('User member information is missing. Interaction:', interaction);
        await interaction.reply({ 
            content: '<:error:1302169165905526805> ユーザーの情報を取得できませんでした。', 
            ephemeral: true 
        });
        return true;
    }

    const botMember = interaction.guild?.members?.me;
    if (!botMember) {
        console.error('Bot member information is missing. Guild ID:', interaction.guild?.id);
        await interaction.reply({ 
            content: '<:error:1302169165905526805> BOTの情報を取得できませんでした。', 
            ephemeral: true 
        });
        return true;
    }

    const missingMemberPerms = isUserPermsCheckRequired 
        ? requiredPermissions.filter(perm => !userMember.permissions.has(perm)) 
        : [];
    const missingBotPerms = requiredPermissions.filter(perm => !botMember.permissions.has(perm));

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
