const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const buttonPages = require("../../lib/pagination");
const cooldown = require('../events/cooldown');
const { createEmbed } = require('../../lib/embed');

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

               const embed1 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと｜help**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                     { name: 'くまのみぼっとについて', value: '暇な音ゲーマーの作ってる多機能botです' },
                     { name: '新機能のおしらせチャンネルについて', value: 'サポートサーバーのアナウンスチャンネルをフォローすることでおしらせを受け取れます' },
                     { name: 'helpの操作方法', value: 'ボタンを押すことでコマンド一覧等が見れます' },
                     { name: 'Make it a Quote機能', value: 'メッセージの返信のときにBOTをメンションするとMake it a Quote画像を生成します' },
                     { name: 'サイト', value: '[くまのみぼっと公式サイト](https://veda00133912.github.io/kumanomi-site/)' },
                     { name: 'サポート等', value: '<:twitter:1282701797353459799> [twitter](https://twitter.com/ryo_001339)  <:discord:1282701795000320082> [Discord](https://discord.gg/j2gM7d2Drp)  <:github:1282850416085827584> [Github](https://github.com/VEDA00133912/KumanomiBOT)' },
                     { name: '制作者', value: '<@1095869643106828289> (ryo_001339)' }
                   );

               const getCommandField = (name, description) => {
                   const commandId = commandMap.get(name);
                   return { name: `</${name}:${commandId}>`, value: description };
               };

               const embed2 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [スラッシュコマンド一覧 1]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       getCommandField('help', 'helpメッセージを表示するコマンド'),
                       { name: `</select taiko:1298846149926715458>`, value: '太鼓の達人ランダム選曲コマンド(全曲、★10)' },
                       { name: `</select prsk:1298846149926715458>`, value: 'プロセカランダム選曲コマンド(MASTER、APPEND)' },
                       { name: `</select chunithm:1298846149926715458>`, value: 'CHUNITHMランダム選曲コマンド(全曲、ORIGINAL、WE&ULTIMA)' },
                       { name: `</select maimai:1298846149926715458>`, value: 'maimaiランダム選曲コマンド(全曲、maimai、宴譜面)' },
                       { name: `</select ongeki:1298846149926715458>`, value: 'オンゲキランダム選曲コマンド(全曲、オンゲキ、LUNATIC、Re:MASTER)' },
                   );

               const embed3 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [スラッシュコマンド一覧 2]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: `</info server:1298846149486182519>`, value: 'サーバー情報を表示するコマンド' },
                       { name: `</info user:1298846149486182519>`, value: 'ユーザー情報を表示するコマンド' },                
                       getCommandField('spoofing', '他ユーザーに自由になりすましできるコマンド'),
                       getCommandField('5000choyen', '5000兆円欲しい！画像生成コマンド'),
                       getCommandField('omikuji', 'おみくじを引けるコマンド'),
                       getCommandField('timer', 'タイマーコマンド')
                   );

                     const embed4 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [スラッシュコマンド一覧 3]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: `</create role:1298846149486182514>`, value: 'ロール作成コマンド' },                
                       { name: `</create channel:1298846149486182514>`, value: 'チャンネル作成コマンド' },                
                       { name: `</create password:1298846149486182514>`, value: 'パスワード生成コマンド' },                
                       getCommandField('timer', 'タイマーコマンド'),
                       getCommandField('totsu-shi', '突然の死ジェネレーターコマンド'),
                       getCommandField('icon', '指定したユーザーのアイコン画像を表示するコマンド'),
                   );

                   const embed5 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [スラッシュコマンド一覧 4]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: `</fake nitro:1298846149486182517>`, value: '偽Nitro生成コマンド(Gift, Promo)' },                
                       { name: `</fake token:1298846149486182517>`, value: '偽Token生成コマンド' }, 
                       getCommandField('convert', 'メッセージを変換するコマンド\n(ルーン文字、フェニキア文字、ヒエログリフ、逆読み、アナグラム、メンヘラ文、怪しい日本語)'),
                       getCommandField('qr', 'URLをQRコードに変換するコマンド'),
                       getCommandField('ping', 'BOTのping値を表示するコマンド'),
                       getCommandField('delete', 'メッセージ削除コマンド') 
                   );

                     const embed6 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [スラッシュコマンド一覧 5]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: `</url short:1298846150069190697>`, value: 'URL短縮コマンド' }, 
                       { name: `</url extract:1298846150069190697>`, value: 'URL抽出コマンド' }, 
                       { name: `</url viruscheck:1298846150069190697>`, value: 'URL危険性チェックコマンド' }, 
                       getCommandField('prime', '素数判定を行うコマンド'),
                       getCommandField('translate', 'Google翻訳コマンド(日本語→英語、韓国語、中国語、ロシア語)'),
                       getCommandField('yahoonews', 'yahooニュースリンクを取得するコマンド')
                   );

                     const embed7 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [スラッシュコマンド一覧 6]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       getCommandField('ticket', 'チケットコマンド(プライベートチャンネルの作成)'),
                       getCommandField('invite', 'BOTの招待リンクを取得'),
                       getCommandField('expand-settings', 'メッセージリンクの自動展開のオンオフを設定するコマンド'),
                       getCommandField('ban', 'ユーザーをBANするコマンド'),
                       getCommandField('unban', 'BAN解除コマンド'),
                       getCommandField('kick', 'ユーザーをキックするコマンド')
                   );

                     const embed8 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [スラッシュコマンド一覧 7]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       getCommandField('hiroyuki', 'ひろゆきボイスのmp3に変換'),
                       getCommandField('slowmode', '低速モードの設定')
                       getCommandField('hash', 'ハッシュ化コマンド')
                       getCommandField('password', 'パスワード生成コマンド')
                   );


                   const embed9 = new EmbedBuilder()
                   .setDescription('**くまのみぼっと | help [コンテキストメニューコマンド一覧**')
                   .setFooter({ text: 'Kumanomi | help [9/10]', iconURL: interaction.client.user.displayAvatarURL() })
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                    { name: '**アイコン表示**', value: 'アイコンを表示するuserコンテキストメニューコマンド' },
                    { name: '**英語に翻訳**', value: '英語に翻訳するmessageコンテキストメニューコマンド' },
                    { name: '**突然の死ジェネレーター**', value: '突然の死messageコンテキストメニューコマンド' },
                    { name: '**ひろゆき変換**', value: 'ひろゆきボイスのmp3に変換するコンテキストメニューコマンド' },
                    { name: '**Make it a Quote(カラー)**', value: 'カラーでmiq生成するコンテキストメニューコマンド' },
                    { name: '**Make it a Quote(モノクロ)**', value: 'モノクロでmiq生成するコンテキストメニューコマンド' }
                )
                .setTimestamp()
                .setColor('Green');


                const embed10 = new EmbedBuilder()
                .setDescription('**くまのみぼっと | help [テキストコマンド一覧]**')
                .setFooter({ text: 'Kumanomi | help [10/10]', iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .addFields(
                    { name: '**^snipe**', value: 'そのチャンネルで削除された最新のメッセージを表示' },
                    { name: '**メッセージ自動展開**', value: 'メッセージリンクを送信すると自動で展開' }
                )
                .setTimestamp()
                .setColor('Blue');

        const pages = [embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8, embed9, embed10];
            await buttonPages(interaction, pages);
    },
};
