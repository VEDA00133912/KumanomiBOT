const fs = require('fs').promises;
const path = require('path');
const { WebhookClient } = require('discord.js');

const webhookPath = path.join(__dirname, '../data/settings/webhook.json');

async function getWebhookClient(channel, targetUser) {
  let webhooks = {};
  try {
    const webhookData = await fs.readFile(webhookPath, 'utf8');
    webhooks = JSON.parse(webhookData);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  let webhookURL = webhooks[channel.id];
  if (!webhookURL) {
    let avatarURL;

    try {
      // サーバー内のメンバー情報を取得
      const guildMember = await channel.guild.members.fetch(targetUser.id);
      avatarURL = guildMember.displayAvatarURL({ extension: 'png', size: 1024 });
    } catch (err) {
      if (err.code === 10007) {
        // サーバーにユーザーが存在しない場合 (DiscordAPIError: Unknown Member)
        avatarURL = targetUser.displayAvatarURL({ extension: 'png', size: 1024 });
      } else {
        throw err; // 他のエラーは再スロー
      }
    }

    const createdWebhook = await channel.createWebhook({
      name: targetUser.username,
      avatar: avatarURL,
      reason: 'Spoofing command execution',
    });

    webhookURL = `https://discord.com/api/webhooks/${createdWebhook.id}/${createdWebhook.token}`;

    webhooks[channel.id] = webhookURL;
    await fs.writeFile(webhookPath, JSON.stringify(webhooks, null, 2), 'utf8');
  }

  const webhookClient = new WebhookClient({ url: webhookURL });

  return webhookClient;
}

module.exports = { getWebhookClient };
