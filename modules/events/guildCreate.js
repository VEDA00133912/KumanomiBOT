const { EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', '..', 'data', 'settings', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
  name: Events.GuildCreate,
  async execute(guild, client) {
    const joinChannelId = config.joinChannelId; 
    const botNickname = config.nickname || client.user.username; 
    const totalGuilds = client.guilds.cache.size;
    const serverIconUrl = guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/1.png';
    const owner = await guild.fetchOwner();
    const { tag: ownerName, id: ownerId } = owner.user;
    const serverCreationDate = guild.createdAt.toDateString();
    const serverMemberCount = guild.memberCount;

    let embedColor = 'Green';
    let dmStatus = '成功';
    let nicknameStatus = '成功';
    try {
      await guild.members.me.setNickname(botNickname);
    } catch {
      nicknameStatus = '失敗';
    }

    const ownerEmbed = new EmbedBuilder()
      .setTitle('えむBOTの導入ありがとうございます！')
      .setDescription(`**${guild.name}** に導入されました`)
      .addFields(
        { name: '使用方法', value: 'コマンド等の説明は **`/help`** をご覧ください' },
        { name: '問題が発生した時', value: 'なにかお困りの点、ご提案が有りましたら <@1095869643106828289> (ryo_001339) のDMかサポートサーバーでご相談ください' },
        { name: 'サポートサーバー', value: 'https://discord.gg/Ftz4Tcs8tR' }
      )
      .setThumbnail(serverIconUrl)
      .setFooter({ text: 'Emubot | Thanks for the introduction', iconURL: client.user.displayAvatarURL() })
      .setTimestamp()
      .setColor(embedColor);

    try {
      await owner.send({ embeds: [ownerEmbed] });
    } catch {
      dmStatus = '失敗';
      embedColor = 'Red';
    }

    const targetChannel = client.channels.cache.get(joinChannelId);
    if (targetChannel) {
      const joinEmbed = new EmbedBuilder()
        .setTitle(`${guild.name} に参加しました！`)
        .setDescription(`現在 ${totalGuilds} サーバーに導入されています`)
        .addFields(
          { name: '鯖主', value: `<@${ownerId}>\nユーザー名: ${ownerName}\nID: ${ownerId}` },
          { name: 'サーバー人数', value: `${serverMemberCount} 人` },
          { name: 'サーバー作成日', value: serverCreationDate },
          { name: 'DM送信ステータス', value: dmStatus },
          { name: 'ニックネーム変更', value: `変更結果: ${nicknameStatus}` }
        )
        .setThumbnail(serverIconUrl)
        .setFooter({ text: 'Emubot | join', iconURL: client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor(embedColor);

      await targetChannel.send({ embeds: [joinEmbed] });
    } else {
      console.error('指定されたチャンネルが見つかりません。');
    }
  }
};
