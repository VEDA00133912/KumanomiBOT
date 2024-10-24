async function getUserData(interaction) {
    const user = interaction.options.getUser('target');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const avatarURL = member?.displayAvatarURL({ size: 1024 }) || user.displayAvatarURL({ size: 1024 });

    const joinedAt = member ? member.joinedAt : null;
    const createdAt = user.createdAt ? `<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>` : 'unknown';
    const joinedAtFormatted = joinedAt ? `<t:${Math.floor(joinedAt.getTime() / 1000)}:R>` : '未参加';

    const displayName = member?.displayName || user.username;
    const isBoosting = member?.premiumSince ? 'Yes' : 'No';
    const roleCount = member ? member.roles.cache.size - 1 : 'ロールなし';
    const nameColor = member?.roles?.highest?.color ? `#${member.roles.highest.color.toString(16)}` : '#ffffff';

    return { user, member, avatarURL, joinedAt, createdAt, joinedAtFormatted, displayName, isBoosting, roleCount, nameColor };
}

module.exports = { getUserData };
