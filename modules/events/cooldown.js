const cooldowns = new Map();

module.exports = (commandName, interaction, cooldownTime = 5000) => { 
    const userId = interaction.user.id;
    const guildId = interaction.guild ? interaction.guild.id : null; 
    const now = Date.now();
    const commandId = interaction.commandId; 

    if (commandName === 'help' && guildId) {
        cooldownTime = 60000; 
        if (!cooldowns.has(commandName)) {
            cooldowns.set(commandName, new Map());
        }

        const guildCooldowns = cooldowns.get(commandName);

        if (guildCooldowns.has(guildId)) {
            const expirationTime = guildCooldowns.get(guildId) + cooldownTime;

            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);

                return interaction.reply({ 
                    content: `<:error:1302169165905526805> </${interaction.commandName}:${commandId}> はクールダウン中です。あと ${timeLeft} 秒後に実行できます。`, 
                    ephemeral: true 
                });
            }
        }

        guildCooldowns.set(guildId, now);
        setTimeout(() => guildCooldowns.delete(guildId), cooldownTime);
        return null;
    }

    // 通常のクールダウン処理
    const extendedCooldownCommands = ['info', 'dice', 'spoofing', 'translate', 'hiroyuki'];
    if (extendedCooldownCommands.includes(commandName)) {
        cooldownTime = 10000;
    }

    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Map());
    }

    const timestamps = cooldowns.get(commandName);

    if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownTime;

        if (now < expirationTime) {
            const timeLeft = ((expirationTime - now) / 1000).toFixed(1);

            return interaction.reply({ 
                content: `<:error:1302169165905526805> </${interaction.commandName}:${commandId}> はクールダウン中です。あと ${timeLeft} 秒後に実行できます。`, 
                ephemeral: true 
            });
        }
    }

    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownTime);
    return null; 
};