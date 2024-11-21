const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, roleMention, channelMention } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');
const createEmoji = require('../../lib/createEmoji'); 
const { checkPermissions } = require('../../lib/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('新規作成します。')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.CreateGuildExpressions)
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('新しいロールを作成します。')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('作成するロールの名前')
                        .setRequired(true)
                        .setMinLength(1)
                        .setMaxLength(100))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('作成するロールの色（カラーコードで指定）')
                        .setRequired(false)
                        .setMinLength(1)
                        .setMaxLength(7)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('新しいチャンネルを作成します。')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('作成するチャンネルのタイプ')
                        .setRequired(true)
                        .addChoices(
                            { name: 'テキスト', value: ChannelType.GuildText.toString() },
                            { name: 'ボイス', value: ChannelType.GuildVoice.toString() }
                        ))
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('作成するチャンネルの名前')
                        .setRequired(true)
                        .setMinLength(1)
                        .setMaxLength(100))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('チャンネルの説明')
                        .setMinLength(1)
                        .setMaxLength(1024)
                        .setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('emoji')
                .setDescription('新しい絵文字を作成します。')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('絵文字の名前')
                        .setRequired(true)
                        .setMinLength(1)
                        .setMaxLength(30))
                .addAttachmentOption(option =>
                    option.setName('image')
                        .setDescription('絵文字にする画像ファイル')
                        .setRequired(true)
                )),
    
    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'role') {
                       
                const requiredPermissions = [ PermissionFlagsBits.ManageRoles ];
                const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
                if (isMissingPermissions) return;
                
                const name = interaction.options.getString('name');
                const color = interaction.options.getString('color');
                const roleCount = interaction.guild.roles.cache.size;

                if (roleCount >= 250) {
                    return interaction.reply({ content: '<error:1299263288797827185> ロールの作成上限のため、実行できませんでした。', ephemeral: true });
                }

                const creatingEmbed = createEmbed(interaction)
                    .setTitle('ロール作成中...')
                    .setDescription(`<a:loading:1259148838929961012> ロール **\`${name}\`**を作成しています...`);

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const createdRole = await interaction.guild.roles.create({
                    name: name,
                    color: color ? color.toUpperCase() : null,
                });

                const role = roleMention(createdRole.id);
                const completeEmbed = new EmbedBuilder()
                .setColor(color ? color.toUpperCase() : '#99AAB5') 
                .setTitle('<:done:1299263286361063454> 作成完了!')
                .setTimestamp()
                .setFooter({ text: 'Kumanomi | role create', iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`作成したロール: ${role}`);

                await interaction.editReply({ embeds: [completeEmbed] });

            } else if (subcommand === 'channel') {
                const name = interaction.options.getString('name');
                const description = interaction.options.getString('description');
                const type = interaction.options.getString('type');

                const requiredPermissions = [ PermissionFlagsBits.ManageChannels ];
                const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
                if (isMissingPermissions) return;

                const creatingEmbed = createEmbed(interaction)
                    .setTitle('チャンネル作成中...')
                    .setDescription(`<a:loading:1259148838929961012> チャンネル **\`${name}\`**を作成しています...`);

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const createdChannel = await interaction.guild.channels.create({
                    name: name,
                    type: type,
                    topic: description
                });

                const channel = channelMention(createdChannel.id);
                const completeEmbed = createEmbed(interaction)
                    .setTitle('<:done:1299263286361063454> 作成完了!')
                    .setDescription(`作成したチャンネル: ${channel}`);

                await interaction.editReply({ embeds: [completeEmbed] });
            } else if (subcommand === 'emoji') {
                const name = interaction.options.getString('name');
                const attachment = interaction.options.getAttachment('image');

                const requiredPermissions = [ PermissionFlagsBits.CreateGuildExpressions, PermissionFlagsBits.ManageGuildExpressions ];
                const isMissingPermissions = await checkPermissions(interaction, requiredPermissions);
                if (isMissingPermissions) return;

                const creatingEmbed = createEmbed(interaction)
                    .setTitle('絵文字作成中...')
                    .setDescription(`<a:loading:1259148838929961012> 絵文字 **\`${name}\`**を作成しています...`);

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const createdEmoji = await createEmoji(interaction.guild, name, attachment);

                const completeEmbed = createEmbed(interaction)
                    .setTitle('<:done:1299263286361063454> 作成完了!')
                    .setDescription(`作成した絵文字: <:${createdEmoji.name}:${createdEmoji.id}>`);

                await interaction.editReply({ embeds: [completeEmbed] });
            }

        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
