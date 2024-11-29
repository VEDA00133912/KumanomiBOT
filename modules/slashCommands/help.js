const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require("discord.js");
const cooldown = require('../events/cooldown');
const buttonPages = require('../../lib/pagination');
const { createEmbed } = require('../../lib/embed');

module.exports = {
       data: new SlashCommandBuilder()
             .setName('help')
             .setDescription('くまのみBOTのヘルプを表示します。')
             .setContexts(InteractionContextType.Guild)
             .setIntegrationTypes(0),

       async execute(interaction) {
              const commandName = this.data.name;
              const isCooldown = cooldown(commandName, interaction);
              if (isCooldown) return;

              const commands = await interaction.client.application.commands.fetch();
              const commandMap = new Map(commands.map(cmd => [cmd.name, cmd.id]));

               const embed1 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと｜help [BOT概要]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                     { name: 'くまのみぼっとについて', value: '暇な音ゲーマーの作ってる多機能botです' },
                     { name: '新機能のおしらせチャンネルについて', value: 'サポートサーバーのアナウンスチャンネルをフォローすることでおしらせを受け取れます' },
                     { name: 'helpの操作方法', value: 'ボタンを押すことでコマンド一覧等が見れます' },
                     { name: 'サイト', value: '[くまのみぼっと公式サイト](https://veda00133912.github.io/kumanomi-site/)' },
                     { name: 'サポート等', value: '<:twitter:1282701797353459799> [twitter](https://twitter.com/ryo_001339)  <:discord:1282701795000320082> [Discord](https://discord.gg/j2gM7d2Drp)  <:github:1282850416085827584> [Github](https://github.com/VEDA00133912/KumanomiBOT)' },
                     { name: '制作者', value: '<@1095869643106828289> (ryo_001339)' },
                     { name: 'コマンドの無効化の方法', value: 'メンバーに使わせたくないコマンドがある場合は下の画像を参考に無効化できます'}
                   );

               const getCommandField = (name, description) => {
                   const commandId = commandMap.get(name);
                   return { name: `</${name}:${commandId}>`, value: description };
               };

               const embed2 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       getCommandField('help', 'helpメッセージを表示するコマンド'),
                       { name: '</select taiko:1298846149926715458>', value: '太鼓の達人ランダム選曲コマンド(全曲、★10)' },
                       { name: '</select prsk:1298846149926715458>', value: 'プロセカランダム選曲コマンド(MASTER、APPEND)' },
                       { name: '</select chunithm:1298846149926715458>', value: 'CHUNITHMランダム選曲コマンド(全曲、ORIGINAL、WE&ULTIMA)' },
                       { name: '</select maimai:1298846149926715458>', value: 'maimaiランダム選曲コマンド(全曲、maimai、宴譜面、Re:MASTER)' },
                       { name: '</select ongeki:1298846149926715458>', value: 'オンゲキランダム選曲コマンド(全曲、オンゲキ、LUNATIC、Re:MASTER)' },
                       getCommandField('spoofing', '他ユーザーに自由になりすましできるコマンド')
                   );

               const embed3 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: '</info server:1298846149486182519>', value: 'サーバー情報を表示するコマンド' },
                       { name: '</info user:1298846149486182519>', value: 'ユーザー情報を表示するコマンド' },         
                    　 { name: '</info system:1298846149486182519>', value: 'BOTのシステム情報を表示するコマンド' },                
                       getCommandField('embedbuilder', '埋め込み作成コマンド'),
                       getCommandField('5000choyen', '5000兆円欲しい！画像生成コマンド'),
                       getCommandField('totsu-shi', '突然の死ジェネレーターコマンド'),
                       getCommandField('omikuji', 'おみくじを引けるコマンド')
                   );

              const embed4 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: '</create role:1298846149486182514>', value: 'ロール作成コマンド' },                
                       { name: '</create channel:1298846149486182514>', value: 'チャンネル作成コマンド' },                
                       { name: '</create emoji:1298846149486182514>', value: '絵文字作成コマンド' },                
                       getCommandField('timer', 'タイマーコマンド'),
                       getCommandField('delete', 'メッセージ削除コマンド'),
                       getCommandField('icon', '指定したユーザーのアイコン画像を表示するコマンド'),
                       getCommandField('redirect', 'リダイレクト先調査コマンド') 
                   );

              const embed5 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: '</fake nitro:1298846149486182517>', value: '偽Nitro生成コマンド(Gift, Promo)' },                
                       { name: '</fake token:1298846149486182517>', value: '偽Token生成コマンド' }, 
                       getCommandField('backword', '逆読みコマンド'),
                       getCommandField('qr', 'URLをQRコードに変換するコマンド'),
                       getCommandField('ping', 'BOTのping値を表示するコマンド'),
                       getCommandField('average', '平均計算コマンド'),
                       getCommandField('pf', '素因数分解コマンド') 
                   );

              const embed6 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       { name: '</url short:1298846150069190697>', value: 'URL短縮コマンド' }, 
                       { name: '</url extract:1298846150069190697>', value: 'URL抽出コマンド' }, 
                       { name: '</url viruscheck:1298846150069190697>', value: 'URL危険性チェックコマンド' }, 
                       getCommandField('prime', '素数判定を行うコマンド'),
                       getCommandField('translate', 'Google翻訳コマンド(日本語→英語、韓国語、中国語、ロシア語)'),
                       getCommandField('yahoonews', 'yahooニュースリンクを取得するコマンド'),
                       getCommandField('top', 'チャンネルの一番上のメッセージを取得する') 
                   );
                   
              const embed7 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       getCommandField('ticket', 'チケットコマンド(プライベートチャンネルの作成)'),
                       getCommandField('invite', 'BOTの招待リンクを取得'),
                       getCommandField('expand-settings', 'メッセージリンクの自動展開のオンオフを設定するコマンド'),
                       getCommandField('ban', 'ユーザーをBANするコマンド'),
                       getCommandField('unban', 'BAN解除コマンド'),
                       getCommandField('kick', 'ユーザーをキックするコマンド'),
                       getCommandField('uuid', 'UUID生成コマンド') 
                   );
                     
              const embed8 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       getCommandField('hiroyuki', 'ひろゆきボイスのmp3に変換'),
                       getCommandField('slowmode', '低速モードの設定'),
                       getCommandField('hash', 'ハッシュ化コマンド'),
                       getCommandField('mcstatus', 'マイクラサーバーステータス表示コマンド'),
                       getCommandField('password', 'パスワード生成コマンド'),
                       getCommandField('timer', 'タイマーコマンド'),
                       getCommandField('npm', 'NPMパッケージ情報を表示')
                   );

              const embed9 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                       getCommandField('rune', 'ルーン文字変換コマンド'),
                       getCommandField('cjp', '怪しい日本語変換コマンド'),
                       getCommandField('menhera', 'メンヘラ文変換コマンド'),
                       getCommandField('anagram', 'アナグラムコマンド'),
                       getCommandField('gaster', 'ガスター語変換コマンド'),
                       { name: '</search google:1303358550055194654>', value: 'Google検索コマンド' },                
                       { name: '</search gif:1303358550055194654>', value: 'GIF検索コマンド' }
                   );

              const embed10 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(               
                       { name: '</canvas round:1306883285867298948>', value: '円形切り抜き' },
                       { name: '</canvas flip:1306883285867298948>', value: '向き変更' },
                       { name: '</canvas reversal:1306883285867298948>', value: '色反転' },
                       { name: '</canvas mono:1306883285867298948>', value: 'モノクロ化' },
                       { name: '</canvas mosaic:1306883285867298948>', value: 'モザイク加工' },
                       { name: '</canvas meme:1306883285867298948>', value: '顔の良さでなんとかなると思っているジェネレータ' }
                   );
              
              const embed11 = new EmbedBuilder()
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                   .setFooter({ text: 'Kumanomi | help', iconURL: interaction.client.user.displayAvatarURL() })
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                          { name: '</song sonshi:1307827625997111379>', value: '尊師マーチを送信します' },
                          { name: '</song kongyo:1307827625997111379>', value: 'コンギョを送信します' },
                          { name: '**アイコン表示**', value: 'ユーザーのアイコンを表示するコンテキストメニューコマンド' },
                          { name: '**英語に翻訳**', value: 'メッセージを英語に翻訳するコンテキストメニューコマンド' },
                          { name: '**ひろゆき変換**', value: 'メッセージをひろゆきのmp3に変換するコンテキストメニューコマンド' }
                )
                .setTimestamp()
                .setColor('Green');


              const embed12 = new EmbedBuilder()
                   .setDescription('**くまのみぼっと | help [コマンド]**')
                     .setFooter({ text: 'Kumanomi | help', iconURL: interaction.client.user.displayAvatarURL() })
                     .setThumbnail(interaction.client.user.displayAvatarURL())
                     .addFields(
                            { name: '**^snipe**', value: 'そのチャンネルで削除された最新のメッセージを表示' },
                            { name: '**メッセージ自動展開**', value: 'メッセージリンクを送信すると自動で展開' }
                     )
                     .setTimestamp()
                     .setColor('Blue');

        const pages = [embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8, embed9, embed10, embed11, embed12];
            await buttonPages(interaction, pages);
    },
};
