const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const allowedUserId = '1095869643106828289';
    if (message.author.id !== allowedUserId) {
      return;
    }

    if (message.content.startsWith('^send')) {
      const args = message.content.split(' ');
      const messageId = args[1];

      if (!messageId) {
        return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('<:error:1282141871539490816> メッセージIDを指定してください。')] });
      }

      try {
        const msg = await message.channel.messages.fetch(messageId);
        const messageContent = msg.content;
        const guilds = message.client.guilds.cache;

        const ownerIds = new Set();
        const failedGuilds = [];

        const progressEmbed = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Yellow')
              .setDescription('送信中...')
              .setFooter({ text: 'Emubot | sending...' })
          ]
        });

        const sendPromises = [];
        let successCount = 0;

        for (const [guildId, guild] of guilds) {
          sendPromises.push(
            (async () => {
              try {
                const owner = await guild.fetchOwner();
                if (!ownerIds.has(owner.id)) {
                  ownerIds.add(owner.id);
                  await owner.send(`えむBOT管理人からのお知らせです\n${messageContent}`);
                  successCount++;
                }
              } catch (error) {
                console.error(`Failed to send message to owner of guild ${guildId}:`, error);
                failedGuilds.push(guild.name);
              }
            })()
          );
        }

        await Promise.all(sendPromises);

        await progressEmbed.edit({
          embeds: [
            new EmbedBuilder()
              .setColor('Green')
              .setDescription(
                failedGuilds.length > 0
                  ? `<:check:1282141869387550741> 成功: ${successCount}人\n失敗: ${failedGuilds.length}人\n**失敗したギルド**\n${failedGuilds.join(', ')}`
                  : `<:check:1282141869387550741> 全てのオーナーにメッセージ内容を送信しました。成功: ${successCount}人`
              )
              .setFooter({ text: 'Emubot | completed' })
          ]
        });
      } catch (error) {
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setDescription('<:error:1282141871539490816> 指定されたメッセージIDが無効です。')
          ]
        });
      }
    }
  },
};