const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('新規作成します。')
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
        ),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'role') {
                const name = interaction.options.getString('name');
                const color = interaction.options.getString('color');
                const roleCount = interaction.guild.roles.cache.size;

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: '<error:1302169165905526805> あなたにロール管理の権限がありません。', ephemeral: true });
                }

                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: '<error:1302169165905526805> BOTにロール管理の権限がありません。', ephemeral: true });
                }

                if (roleCount >= 250) {
                    return interaction.reply({ content: '<error:1302169165905526805> ロールの作成上限のため、実行できませんでした。', ephemeral: true });
                }

                const creatingEmbed = createEmbed(interaction)
                    .setTitle('ロール作成中...')
                    .setDescription(`<a:loading:1302169108888162334> **\`${name}\`**を作成しています...`);

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const createdRole = await interaction.guild.roles.create({
                    name: name,
                    color: color ? color.toUpperCase() : null,
                });

                const completeEmbed = new EmbedBuilder()
                    .setColor(roleColor || '#99AAB5') 
                    .setTitle('<:check:1302169183110565958> 作成完了!')
                    .setTimestamp()
                    .setFooter({ text: 'Kumanomi | role create', iconURL: interaction.client.user.displayAvatarURL() })
                    .setDescription(`作成したロール: <@&${createdRole.id}>`);

                await interaction.editReply({ embeds: [completeEmbed] });

            } else if (subcommand === 'channel') {
                const name = interaction.options.getString('name');
                const description = interaction.options.getString('description');
                const type = interaction.options.getString('type');

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: '<error:1302169165905526805> あなたにチャンネル管理権限がありません。', ephemeral: true });
                }

                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({ content: '<error:1302169165905526805> BOTにチャンネル管理の権限がありません。', ephemeral: true });
                }

                const creatingEmbed = createEmbed(interaction)
                    .setTitle('チャンネル作成中...')
                    .setDescription(`<a:loading:1302169108888162334> チャンネル **\`${name}\`**を作成しています...`);

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const createdChannel = await interaction.guild.channels.create({
                    name: name,
                    type: type,
                    topic: description
                });

                const completeEmbed = createEmbed(interaction)
                    .setTitle('<:check:1302169183110565958> 作成完了!')
                    .setDescription(`作成したチャンネル: <#${createdChannel.id}>`);

                await interaction.editReply({ embeds: [completeEmbed] });
            }

        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
