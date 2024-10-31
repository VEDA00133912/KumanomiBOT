const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError');
const cooldown = require('../events/cooldown');
const { getUserData } = require('../../lib/infouser');
const { getServerInfo } = require('../../lib/infoserver');
const { getBoostLevel } = require('../../lib/boost');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('ユーザーまたはサーバーの情報を表示します')
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
        const { user, avatarURL, joinedAtFormatted, createdAt, displayName, isBoosting, roleCount, nameColor, status, bannerURL} = userData;

        const embed = new EmbedBuilder()
          .setColor('#febe69')
          .setAuthor({ name: displayName, iconURL: avatarURL })
          .setDescription(`${user}'s user information`)
          .setThumbnail(avatarURL)
          .setTimestamp()
          .setFooter({ text: 'Kumanomi | userinfo', iconURL: interaction.client.user.displayAvatarURL() })
          .addFields(
            { name: '🔥 名前', value: user.tag, inline: true },
            { name: '🆔 ID', value: `${user.id}`, inline: true },
            { name: '😎 ステータス', value: status, inline: true },
            { name: '<:user:1292675664368898049> 作成日', value: createdAt, inline: true },
            { name: '<:join:1292646851954085971> 参加日', value: joinedAtFormatted, inline: true },
            { name: '<:booster:1292651469002113067> ブースト', value: isBoosting, inline: true },
            { name: '🔗 ロール数', value: `${roleCount}`, inline: true },
            { name: '🎨 名前の色', value: nameColor.toUpperCase(), inline: true },
            { name: '<:bot:1292648890708791429> アカウント', value: user.bot ? 'BOT' : 'USER', inline: true }
          );
        
        if (bannerURL) {
            embed.setImage(bannerURL);
        }
        
        await interaction.editReply({ embeds: [embed] });
      } else if (subcommand === 'server') {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;
        
        const guild = interaction.guild;
        const serverIconUrl = guild.iconURL({ size: 1024 });
        const defaultIconUrl = `https://cdn.discordapp.com/embed/avatars/1.png`;
        const thumbnailUrl = serverIconUrl || defaultIconUrl;

        const serverInfo = await getServerInfo(guild);
        if (!serverInfo) {
          throw new Error('サーバー情報の取得に失敗しました');
        }

        const { textChannelsCount, voiceChannelsCount, categoryCount, memberCount, bannedCount, emojiCount, bannerURL, roleCount, userCount, botCount, onlineCount, dndCount, idleCount, offlineCount, createdAt } = serverInfo;

        const totalChannelsCount = textChannelsCount + voiceChannelsCount + categoryCount; 
        const boostLevel = getBoostLevel(guild.premiumSubscriptionCount);

        const embed = new EmbedBuilder()
          .setColor('#febe69')
          .setTimestamp()
          .setDescription(`**Information for ${guild.name} (${guild.id})**`)
          .setFooter({ text: 'Kumanomi | serverinfo', iconURL: interaction.client.user.displayAvatarURL() })
          .setThumbnail(thumbnailUrl)
          .addFields(
            { name: '👑 鯖主', value: `<@${guild.ownerId}>`},
            { name: '<:booster:1292651469002113067> ブースト', value: `${guild.premiumSubscriptionCount} Boosts (Level ${boostLevel})`},
            { name: '🚫 BANユーザー数', value: `${bannedCount} Users`},
            { name: '<:discord:1282701795000320082> チャンネル数', value: `Total: ${totalChannelsCount}\n<:text:1282162750524756022> Text: ${textChannelsCount} | <:vc:1282162748884516955> Voice: ${voiceChannelsCount} | 🌲Categories: ${categoryCount}`, inline: false },
            {
              name: '<:user:1292675664368898049> メンバー情報',
              value: `Total: ${memberCount} (User: ${userCount} | BOT: ${botCount})\n<:online:1282208120113987634> : ${onlineCount} | <:dnd:1282208118486601778> : ${dndCount} | <:idle:1282208116783710259> : ${idleCount} | <:offline:1282208115214782476> : ${offlineCount}`,
              inline: false
            },
            { name: '🔗 ロール数', value: `${roleCount} Roles`, inline: true },
            { name: '😎 絵文字数', value: `${emojiCount} Emojis`, inline: true },
            { name: '⚙ 作成日', value: `${createdAt} <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
          );

        if (bannerURL) {
          embed.setImage(bannerURL);
        }

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  }
};
