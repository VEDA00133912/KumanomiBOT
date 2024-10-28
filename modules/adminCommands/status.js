const { Events } = require('discord.js');
const textCommandError = require('../errors/textCommandError');

const ADMIN_ID = '1095869643106828289'; 

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const content = message.content.trim();
    
    if (!content.startsWith('^status')) return;

    const args = content.slice('^status'.length).trim().split(/ +/);
    const status = args[0];
    const validStatuses = ['online', 'idle', 'dnd'];

    if (!validStatuses.includes(status)) {
      const reply = await message.reply('<:error:1299263288797827185> 使用できるステータスは `online`, `idle`, `dnd` です。');
      setTimeout(() => reply.delete(), 5000);
      return;
    }

    if (message.author.id !== ADMIN_ID) {
      const reply = await message.reply('<:error:1299263288797827185> コマンドを実行する権限がありません');
      setTimeout(() => reply.delete(), 5000); 
      return;
    }

    try {
      await message.client.user.setStatus(status);
      const reply = await message.reply(`<:done:1299263286361063454> ${status.charAt(0).toUpperCase() + status.slice(1)}に設定しました`);
      setTimeout(() => reply.delete(), 5000);
    } catch (error) {
      textCommandError(client, message, error, __filename);
      const reply = await message.reply('<:error:1299263288797827185> ステータスの設定中にエラーが発生しました。');
      setTimeout(() => reply.delete(), 5000); 
    }
  },
};
