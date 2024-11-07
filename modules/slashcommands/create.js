const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashcommandError');
const { createEmbed } = require('../../lib/embed');
const createEmoji = require('../../lib/createEmoji'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('新規作成します。')
        .setDMPermission(false)
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
        const subcommand = interaction.options.getSubcommand();
        const commandName = `create ${subcommand}`;
        if (cooldown(commandName, interaction)) return;

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'role') {
                const name = interaction.options.getString('name');
                const color = interaction.options.getString('color');
                const roleCount = interaction.guild.roles.cache.size;

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: '<error:1299263288797827185> あなたにロール管理の権限がありません。', ephemeral: true });
                }

                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: '<error:1299263288797827185> BOTにロール管理の権限がありません。', ephemeral: true });
                }

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

                const completeEmbed = new EmbedBuilder()
                .setColor(color ? color.toUpperCase() : '#99AAB5') 
                .setTitle('<:done:1299263286361063454> 作成完了!')
                .setTimestamp()
                .setFooter({ text: 'Kumanomi | role create', iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`作成したロール: <@&${createdRole.id}>`);

                await interaction.editReply({ embeds: [completeEmbed] });

            } else if (subcommand === 'channel') {
                const name = interaction.options.getString('name');
                const description = interaction.options.getString('description');
                const type = interaction.options.getString('type');

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: '<error:1299263288797827185> あなたにチャンネル管理権限がありません。', ephemeral: true });
                }

                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({ content: '<error:1299263288797827185> BOTにチャンネル管理の権限がありません。', ephemeral: true });
                }

                const creatingEmbed = createEmbed(interaction)
                    .setTitle('チャンネル作成中...')
                    .setDescription(`<a:loading:1259148838929961012> チャンネル **\`${name}\`**を作成しています...`);

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const createdChannel = await interaction.guild.channels.create({
                    name: name,
                    type: type,
                    topic: description
                });

                const completeEmbed = createEmbed(interaction)
                    .setTitle('<:done:1299263286361063454> 作成完了!')
                    .setDescription(`作成したチャンネル: <#${createdChannel.id}>`);

                await interaction.editReply({ embeds: [completeEmbed] });
            } else if (subcommand === 'emoji') {
                const name = interaction.options.getString('name');
                const attachment = interaction.options.getAttachment('image');

                if (!interaction.member.permissions.has(PermissionFlagsBits.CreateGuildExpressions)) {
                    return interaction.reply({ content: '<error:1299263288797827185> あなたに絵文字作成権限がありません。', ephemeral: true });
                }

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
                    return interaction.reply({ content: '<error:1299263288797827185> あなたに絵文字管理権限がありません。', ephemeral: true });
                }
                
                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.CreateGuildExpressions)) {
                    return interaction.reply({ content: '<error:1299263288797827185> BOTに絵文字作成権限がありません。', ephemeral: true });
                }

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
