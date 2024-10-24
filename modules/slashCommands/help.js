const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const buttonPages = require("../../lib/pagination");
const cooldown = require('../events/cooldown');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('くまのみぼっとのヘルプを表示します。'),

    async execute(interaction) {
        const commandName = this.data.name;
        const isCooldown = cooldown(commandName, interaction);
        if (isCooldown) return;

        const commands = await interaction.client.application.commands.fetch();
        const commandMap = new Map(commands.map(cmd => [cmd.name, cmd.id]));

        const embed1 = new EmbedBuilder()
            .setColor('#febe69')
            .setTimestamp()
            .setDescription('**くまのみぼっと｜help**')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: 'Kumanomi | help [1/7]', iconURL: interaction.client.user.displayAvatarURL() })
            .addFields(
              { name: 'くまのみぼっとについて', value: '暇な音ゲーマーの作ってる多機能botです' },
              { name: 'helpの操作方法', value: 'ボタンを押すことでコマンド一覧等が見れます' },
              { name: 'Make it a Quote機能', value: 'メッセージの返信のときにBOTをメンションするとMake it a Quote画像を生成します' },
              { name: 'サイト', value: '[くまのみぼっと公式サイト](https://veda00133912.github.io/kumanomi-site/)' },
              { name: 'サポート等', value: '<:twitter:1282701797353459799> [twitter](https://twitter.com/ryo_001339)  <:discord:1282701795000320082> [Discord](https://discord.gg/j2gM7d2Drp)  <:github:1282850416085827584> [Github](https://github.com/VEDA00133912/Emubot-v3)' },
              { name: '制作者', value: '<@1095869643106828289> (ryo_001339)' }
            );

        const getCommandField = (name, description) => {
            const commandId = commandMap.get(name);
            return { name: `</${name}:${commandId}>`, value: description };
        };

        const embed2 = new EmbedBuilder()
            .setDescription('**くまのみぼっと | help [コマンド一覧 1]**')
            .setFooter({ text: 'Kumanomi | help [2/7]', iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                getCommandField('help', 'helpメッセージを表示するコマンド'),
                { name: `</select taiko:1298846149926715458>`, value: '太鼓の達人ランダム選曲コマンド(全曲、★10)' },
                { name: `</select prsk:1298846149926715458>`, value: 'プロセカランダム選曲コマンド(MASTER、APPEND)' },
                { name: `</select chunithm:1298846149926715458>`, value: 'CHUNITHMランダム選曲コマンド(全曲、ORIGINAL、WE&ULTIMA)' },
                { name: `</select maimai:1298846149926715458>`, value: 'maimaiランダム選曲コマンド(全曲、maimai、宴譜面)' },
                { name: `</select ongeki:1298846149926715458>`, value: 'オンゲキランダム選曲コマンド(全曲、オンゲキ、LUNATIC、Re:MASTER)' },
            )
            .setTimestamp()
            .setColor('#febe69');

        const embed3 = new EmbedBuilder()
            .setDescription('**くまのみぼっと | help [コマンド一覧 2]**')
            .setFooter({ text: 'Kumanomi | help [3/7]', iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: `</info server:1298846149486182519>`, value: 'サーバー情報を表示するコマンド' },
                { name: `</info user:1298846149486182519>`, value: 'ユーザー情報を表示するコマンド' },                
                getCommandField('spoofing', '他ユーザーに自由になりすましできるコマンド'),
                getCommandField('5000choyen', '5000兆円欲しい！画像生成コマンド'),
                getCommandField('omikuji', 'おみくじを引けるコマンド'),
                getCommandField('timer', 'タイマーコマンド')
            )
            .setTimestamp()
            .setColor('#febe69');

              const embed4 = new EmbedBuilder()
            .setDescription('**くまのみぼっと | help [コマンド一覧 3]**')
            .setFooter({ text: 'Kumanomi | help [4/7]', iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: `</create role:1298846149486182514>`, value: 'ロール作成コマンド' },                
                { name: `</create channel:1298846149486182514>`, value: 'チャンネル作成コマンド' },                
                { name: `</create password:1298846149486182514>`, value: 'パスワード生成コマンド' },                
                getCommandField('timer', 'タイマーコマンド'),
                getCommandField('totsu-shi', '突然の死ジェネレーターコマンド'),
                getCommandField('icon', '指定したユーザーのアイコン画像を表示するコマンド'),
            )
            .setTimestamp()
            .setColor('#febe69');
                          
            const embed5 = new EmbedBuilder()
            .setDescription('**くまのみぼっと | help [コマンド一覧 4]**')
            .setFooter({ text: 'Kumanomi | help [5/7]', iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: `</fake nitro:1298846149486182517>`, value: '偽Nitro生成コマンド(Gift, Promo)' },                
                { name: `</fake token:1298846149486182517>`, value: '偽Token生成コマンド' }, 
                getCommandField('convert', 'メッセージを変換するコマンド\n(ルーン文字、フェニキア文字、ヒエログリフ、逆読み、アナグラム、メンヘラ文、怪しい日本語)'),
                getCommandField('qr', 'URLをQRコードに変換するコマンド'),
                getCommandField('ping', 'BOTのping値を表示するコマンド'),
                getCommandField('delete', 'メッセージ削除コマンド') 
            )
            .setTimestamp()
            .setColor('#febe69');

              const embed6 = new EmbedBuilder()
            .setDescription('**くまのみぼっと | help [コマンド一覧 5]**')
            .setFooter({ text: 'Kumanomi | help [6/7]', iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: `</url short:1298846150069190697>`, value: 'URL短縮コマンド' }, 
                { name: `</url extract:1298846150069190697>`, value: 'URL抽出コマンド' }, 
                { name: `</url viruscheck:1298846150069190697>`, value: 'URL危険性チェックコマンド' }, 
                getCommandField('prime', '素数判定を行うコマンド'),
                getCommandField('translate', 'Google翻訳コマンド(日本語→英語、韓国語、中国語、ロシア語)'),
                getCommandField('yahoonews', 'yahooニュースリンクを取得するコマンド')
            )
            .setTimestamp()
            .setColor('#febe69');

              const embed7 = new EmbedBuilder()
            .setDescription('**くまのみぼっと | help [コマンド一覧 6]**')
            .setFooter({ text: 'Kumanomi | help [7/7]', iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                getCommandField('ticket', 'チケットコマンド(プライベートチャンネルの作成)'),
                getCommandField('vanitycheck', 'バニティ生存確認コマンド(サーバーカスタムURL)'),
                getCommandField('expand-settings', 'メッセージリンクの自動展開のオンオフを設定するコマンド')
            )
            .setTimestamp()
            .setColor('#febe69');
                    
            const pages = [embed1, embed2, embed3, embed4, embed5, embed6, embed7];
            await buttonPages(interaction, pages);
    },
};
