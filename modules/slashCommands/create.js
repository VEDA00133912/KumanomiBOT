const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const slashCommandError = require('../errors/slashCommandError'); 
const cooldown = require('../events/cooldown');
const { generatePasswords } = require('../../lib/gen-password'); 

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
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('password')
                .setDescription('指定した長さのパスワードを生成します。')
                .addIntegerOption(option =>
                    option.setName('length')
                        .setDescription('パスワードの長さを1から32の範囲で指定')
                        .setRequired(true)
                        .setMinValue(1) 
                        .setMaxValue(64)) 
                .addIntegerOption(option =>
                    option.setName('count')
                        .setDescription('生成するパスワードの個数（最大10個）')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(10))),

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
                    return interaction.reply({ content: 'あなたにロール管理の権限がありません。', ephemeral: true });
                }
                                
                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: 'BOTにロール管理の権限がありません。', ephemeral: true });
                }

                if (roleCount >= 250) {
                    return interaction.reply({ content: 'ロールの作成上限のため、実行できませんでした。', ephemeral: true });
                }

                const creatingEmbed = new EmbedBuilder()
                    .setColor('#febe69')
                    .setTitle('ロール作成中...')
                    .setDescription(`<a:loading:1259148838929961012> ロール **\`${name}\`**を作成しています...`)
                    .setFooter({ text: 'Kumanomi | role creating...', iconURL: interaction.client.user.displayAvatarURL() });

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                let roleColor = color ? color.toUpperCase() : null;

                const createdRole = await interaction.guild.roles.create({
                    name: name,
                    color: roleColor, 
                });

                const completeEmbed = new EmbedBuilder()
                    .setColor(roleColor || '#99AAB5') 
                    .setTitle('<:verify:1298523085678448640> 作成完了!')
                    .setTimestamp()
                    .setFooter({ text: 'Kumanomi | role create', iconURL: interaction.client.user.displayAvatarURL() })
                    .setDescription(`作成したロール: <@&${createdRole.id}>`);

                await interaction.editReply({ embeds: [completeEmbed] });
            } else if (subcommand === 'channel') {
                const name = interaction.options.getString('name');
                const description = interaction.options.getString('description');
                const type = interaction.options.getString('type');

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                    return interaction.reply({ content: 'あなたにチャンネル管理権限がありません。', ephemeral: true });
                }
                                
                if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({ content: 'BOTにチャンネル管理の権限がありません。', ephemeral: true });
                }

                const creatingEmbed = new EmbedBuilder()
                    .setColor('#febe69')
                    .setTitle('チャンネル作成中...')
                    .setDescription(`<a:loading:1259148838929961012> チャンネル **\`${name}\`**を作成しています...`)
                    .setFooter({ text: 'Kumanomi | channel creating...', iconURL: interaction.client.user.displayAvatarURL() });

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const createdChannel = await interaction.guild.channels.create({
                    name: name,
                    type: type,
                    topic: description 
                });

                const completeEmbed = new EmbedBuilder()
                    .setColor('#99AAB5') 
                    .setTitle('<:verify:1298523085678448640> 作成完了!')
                    .setTimestamp()
                    .setFooter({ text: 'Kumanomi | channel create', iconURL: interaction.client.user.displayAvatarURL() })
                    .setDescription(`作成したチャンネル: <#${createdChannel.id}>`);

                await interaction.editReply({ embeds: [completeEmbed] });
            } else if (subcommand === 'password') {
                const length = interaction.options.getInteger('length');
                const count = interaction.options.getInteger('count');

                const creatingEmbed = new EmbedBuilder()
                    .setColor('#febe69')
                    .setTitle('パスワード生成中...')
                    .setDescription(`<a:loading:1259148838929961012> パスワードを生成しています...`)
                    .setFooter({ text: 'Kumanomi | password generating...', iconURL: interaction.client.user.displayAvatarURL() });

                await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

                const passwords = generatePasswords(length, count);
              
                const embed = new EmbedBuilder()
                    .setColor('#febe69')
                    .setTitle('生成されたパスワード')
                    .setFooter({ text: 'Kumanomi | create password', iconURL: interaction.client.user.displayAvatarURL() });
                    .setDescription(passwords.join('\n'));

                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};
