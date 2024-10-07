// userinfo, serverinfo
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const { getUserData } = require('../../lib/infouser');
const { getServerInfo } = require('../../lib/infoserver');
const { getBoostLevel } = require('../../lib/boost');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('情報を表示します')
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('ユーザー情報を表示します')
        .addUserOption(option => option.setName('target').setDescription('表示するユーザーを選択')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('サーバー情報を表示します')),

  async execute(interaction) {
    const commandName = this.data.name;
    const isCooldown = cooldown(commandName, interaction);
    if (isCooldown) return;

    try {
      await interaction.deferReply();

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'user') {
        const targetUser = interaction.options.getUser('target');
        const userData = await getUserData(interaction, targetUser);
        const { user, avatarURL, joinedAtFormatted, createdAt, displayName, isBoosting, roleCount, nameColor } = userData;

        const embed = new EmbedBuilder()
          .setColor('#f8b4cb')
          .setAuthor({ name: user.tag, iconURL: avatarURL })
          .setDescription(`${user}'s user information`)
          .setThumbnail(avatarURL)
          .setTimestamp()
          .setFooter({ text: 'Emubot | userinfo', iconURL: interaction.client.user.displayAvatarURL() })
          .addFields(
            { name: '🔥 Name', value: user.tag, inline: true },
            { name: '🆔 ID', value: `${user.id}`, inline: true },
            { name: '✍️ NickName', value: displayName || 'なし', inline: true },
            { name: '<:user:1292675664368898049> Account Created', value: createdAt, inline: true },
            { name: '<:join:1292646851954085971> Server Joined', value: joinedAtFormatted, inline: true },
            { name: '<:booster:1292651469002113067> ServerBoosting', value: isBoosting, inline: true },
            { name: '🔗 RoleCount', value: `${roleCount}`, inline: true },
            { name: '🎨 Name Color', value: nameColor.toUpperCase(), inline: true },
            { name: '<:bot:1292648890708791429> AccountType', value: user.bot ? 'BOT' : 'USER', inline: true }
          );

        await interaction.editReply({ embeds: [embed] });
      } else if (subcommand === 'server') {
        const guild = interaction.guild;
        const serverIconUrl = guild.iconURL({ size: 1024 });
        const defaultIconUrl = `https://cdn.discordapp.com/embed/avatars/1.png`;
        const thumbnailUrl = serverIconUrl || defaultIconUrl;

        const serverInfo = await getServerInfo(guild);
        if (!serverInfo) {
          throw new Error('サーバー情報の取得に失敗しました');
        }

        const { textChannelsCount, voiceChannelsCount, categoryCount, memberCount, bannedCount } = serverInfo;
        const totalChannelsCount = textChannelsCount + voiceChannelsCount + categoryCount; 
        const boostLevel = getBoostLevel(guild.premiumSubscriptionCount);

        const embed = new EmbedBuilder()
          .setColor('#f8b4cb')
          .setTimestamp()
          .setDescription(`**Information for ${guild.name} (${guild.id})**`)
          .setFooter({ text: 'Emubot | serverinfo', iconURL: interaction.client.user.displayAvatarURL() })
          .setThumbnail(thumbnailUrl)
          .addFields(
            { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
            { name: '<:booster:1292651469002113067> Boosts', value: `${guild.premiumSubscriptionCount} Boosts (Level ${boostLevel})`, inline: true },
            { name: '🚫 Banned Users', value: `${bannedCount} Users`, inline: true },
            { name: '<:discord:1282701795000320082> Channels & Members', value: `Total: ${totalChannelsCount} | <:text:1282162750524756022> Text: ${textChannelsCount} | <:vc:1282162748884516955> Voice: ${voiceChannelsCount} | 🌲Categories: ${categoryCount}\n<:user:1292675664368898049> Members: ${memberCount}` },
            { name: '⚙ Server Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
            { name: '<:mod:1292676375429382155> Verification Level', value: `${guild.verificationLevel}`, inline: true }
          );

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};
