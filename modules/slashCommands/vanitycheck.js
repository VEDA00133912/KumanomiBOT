const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { extractVanity } = require('../../lib/vanity');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vanitycheck')
        .setDescription('指定されたバニティURLが使用可能かどうか確認します。')
        .addStringOption(option =>
            option.setName('vanityurl')
                .setDescription('確認したいバニティURL')
                .setRequired(true)
        ),
    async execute(interaction) {
          const commandName = this.data.name;
          const isCooldown = cooldown(commandName, interaction);
          if (isCooldown) return;
        
        let vanityURL = interaction.options.getString('vanityurl');

        vanityURL = extractVanity(vanityURL);
        if (!vanityURL) {
            return interaction.reply({ content: '無効なURL形式です。', ephemeral: true });
        }

        const checkingEmbed = new EmbedBuilder()
            .setTitle('バニティURL確認中...')
            .setDescription('<a:loading:1259148838929961012> バニティURLを確認しています...')
            .setColor('Yellow');

        await interaction.reply({ embeds: [checkingEmbed], fetchReply: true });

        try {
            const invite = await interaction.client.fetchInvite(vanityURL, { withCounts: true });

            const successEmbed = new EmbedBuilder()
                .setTitle('このバニティは使用されています')
                .setThumbnail(invite.guild.iconURL()) 
                .addFields(
                    { name: 'バニティURL', value: `https://discord.gg/${vanityURL}` },
                    { name: 'サーバー名', value: invite.guild.name }
                )
                .setColor('Green');

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            if (error.code === 10006) { 
                const errorEmbed = new EmbedBuilder()
                    .setTitle('<:verify:1298523085678448640> このバニティは使用されていません')
                    .setDescription(`このバニティ「${vanityURL}」は使用可能か、無効になっています。`)
                    .setColor('Green');

                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                slashCommandError(interaction.client, interaction, error);
            }
        }
    }
};
