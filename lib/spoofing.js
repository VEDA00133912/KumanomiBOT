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

  // webhook.jsonの形式に対応
  let webhookURL = webhooks[channel.id];
  if (!webhookURL) {
    // Webhookが存在しない場合、新規作成時にターゲットユーザーの情報を反映
    const avatarURL = targetUser.displayAvatarURL({ format: null, size: 1024 });
    const createdWebhook = await channel.createWebhook({
      name: targetUser.username,
      avatar: avatarURL,
      reason: 'Spoofing command execution',
    });

    webhookURL = `https://discord.com/api/webhooks/${createdWebhook.id}/${createdWebhook.token}`;

    // webhook.jsonにWebhookURLを保存
    webhooks[channel.id] = webhookURL;
    await fs.writeFile(webhookPath, JSON.stringify(webhooks, null, 2), 'utf8');
  }

  // WebhookClientを作成
  const webhookClient = new WebhookClient({ url: webhookURL });

  return webhookClient;
}

module.exports = { getWebhookClient };
