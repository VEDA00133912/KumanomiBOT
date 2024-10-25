# えむBOTのコマンドリスト
【 **(/) SlashCommands** 】 27個
| コマンド名  | コマンド内容 | サブコマンド | 必要権限 |
| ------------- | ------------- | ------------- | ------------- |
| 5000choyen  | 5000兆円欲しい画像の生成  | - - | - - |
| icon  | 指定した人のアイコンを表示  |- -|- -|
|info|ユーザー、サーバーの情報を表示|info user, server|- -|
|ping|BOTのping値を表示|- -|- -|
|spoofing|指定したユーザーになりすましをする| - - |ウェブフックの管理|
|totsu-shi|突然の死ジェネレーター|- -|- -|
|fake|偽Nitro,偽Tokenを生成|fake nitro, token|- -|
|qr|URLをQRコードに変換|- -|- -|
|select|音ゲーランダム選曲|select taiko, prsk, ongeki, maimai, chunithm|- -|
|timer|指定時間後にメンションして知らせるタイマー|- -|- -|
|vanitycheck|discordのカスタムURLの生存確認| - -|- -|
|url|URLの危険性チェック、抽出、短縮|url viruscheck, extract, short|ファイルを添付|
|create|ロール、チャンネル、パスワードを生成|create role, channel, password|ロールの管理, チャンネルの管理|
|expand-settings|リンク自動展開のオンオフ|- -|- -|
|prime|素数判定機|- -|- -|
|ticket|専用部屋を作るチケットコマンド|- -|チャンネルの管理|
|translate|日本語からの翻訳(英、韓、中、露)|- -|- -|

【 **ContextMenus** 】 5個
| コマンド名  | コマンド内容 |コマンド種類|  必要権限 |
| ------------- | ------------- | ------------- | ------------- |
|Make it a Quote(カラー)|miqの画像生成(カラー)|message|- -|
|Make it a Quote(モノクロ)|miqの画像生成(モノクロ)|message|- -|
|突然の死ジェネレーター|突然の死ジェネレーター|message|- -|
|英語に翻訳|JP→EN翻訳|message|- -|
|アイコン表示|アイコンを表示|user|- -|

【 **(^) TextCommands** 】 1個
| コマンド名  | コマンド内容 | コマンド形式| 必要権限 |
| ------------- | ------------- | ------------- | ------------- |
|^snipe|最新の削除されたメッセージを送信|- -|チャンネルを見る, メッセージの送信|

【 **(^) AdminCommands** 】 3個
| コマンド名  | コマンド内容 | コマンド形式| 必要権限 |
| ------------- | ------------- | ------------- | ------------- |
|^leaver|BOTを退出させる|`^leaver サーバーID`|チャンネルを見る, メッセージの送信, 外部の絵文字を使用する|
|^status|BOTのステータスを変更|`^status [online, idle, dnd, offline]`|チャンネルを見る, メッセージの送信, 外部の絵文字を使用する|
|^ownersend|BOT管理者からの鯖主へのお知らせ|`^ownersend メッセージID`|チャンネルを見る, メッセージの送信, DM送信|

【 **Others** 】 2個
| コマンド名  | コマンド内容 | コマンド形式|必要権限 |
| ------------- | ------------- |  ------------- |  ------------- |
|メッセージリンク展開|メッセージリンクを展開|--|チャンネルを見る, メッセージの送信, メッセージ履歴を読む|
|Make it a Quote |miqの生成|モノクロ:@BOTメンション カラー:@BOTメンション color|チャンネルを見る, メッセージの送信, メッセージ履歴を読む|
