const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('メッセージを削除します')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('削除したいメッセージの数')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)),

  async execute(interaction) {
      const commandName = this.data.name;
      const isCooldown = cooldown(commandName, interaction);
      if (isCooldown) return;
    
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: '<:error:1302169165905526805> BOTにメッセージを管理する権限がありません。', ephemeral: true });
    }
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ReadMessageHistory)) {
      return interaction.reply({ content: '<:error:1302169165905526805> BOTにメッセージ履歴を読む権限がありません。', ephemeral: true });
    }
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ViewChannel)) {
      return interaction.reply({ content: '<:error:1302169165905526805> BOTにチャンネルを見る権限がありません。', ephemeral: true });
    }

    const count = interaction.options.getInteger('count');
    const channel = interaction.channel;

    try {
      const inProgressEmbed = new EmbedBuilder()
        .setColor('Yellow') 
        .setDescription(`<a:loading:1302169108888162334> 削除中...`)
        .setFooter({ text: 'Kumanomi | deleting...', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [inProgressEmbed], ephemeral: true });

      const messages = await channel.messages.fetch({ limit: count });

      const twoWeeksAgo = Date.now() - 1209600000;
      const oldMessages = messages.filter(m => m.createdTimestamp < twoWeeksAgo);
      
      if (oldMessages.size > 0) {
        await interaction.editReply({ embeds: [inProgressEmbed.setTitle('削除失敗').setDescription('<:error:1299263288797827185> 2週間以上前のメッセージが含まれているため削除できません。')] });
        return; 
      }

      const deletedMessages = await channel.bulkDelete(messages, true);

      const completedEmbed = new EmbedBuilder()
        .setColor('Green') 
        .setDescription(`<:check:1302169183110565958> 削除したメッセージ数: ${deletedMessages.size}`)
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | deleted', iconURL: interaction.client.user.displayAvatarURL() });

      await interaction.editReply({ embeds: [completedEmbed], ephemeral: true });

    } catch (error) {
      slashCommandError(interaction.client, interaction, error);
    }
  },
};
