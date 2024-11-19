const { SlashCommandBuilder } = require('discord.js');
const { generateMeme } = require('../../lib/canvas');
const { loadCanvasImage, applyMosaic, flipImage, applyMonochrome, invertColors, createCanvasWithSize, createSquareCanvas, clipCircle } = require('../../lib/canvases');
const cooldown = require('../events/cooldown');
const slashCommandError = require('../errors/slashCommandError');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('canvas')
    .setDescription('画像加工を行います')
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addSubcommand(subcommand =>
      subcommand
        .setName('mosaic')
        .setDescription('画像にモザイクをかけます')
        .addAttachmentOption(option =>
          option.setName('image')
            .setDescription('モザイクをかけたい画像をアップロードしてください')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('flip')
        .setDescription('画像を反転します')
        .addAttachmentOption(option =>
          option.setName('image')
            .setDescription('反転させたい画像をアップロードしてください')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('direction')
            .setDescription('反転の方向を選択してください')
            .setRequired(true)
            .addChoices(
              { name: '左右反転', value: 'horizontal' },
              { name: '上下反転', value: 'vertical' },
              { name: '上下左右反転', value: 'both' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('mono')
        .setDescription('画像をモノクロにします')
        .addAttachmentOption(option =>
          option.setName('image')
            .setDescription('モノクロに変換したい画像をアップロードしてください')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('reversal')
        .setDescription('画像を色反転します')
        .addAttachmentOption(option =>
          option.setName('image')
            .setDescription('色反転させたい画像をアップロードしてください')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('round')
        .setDescription('画像を丸く切り抜きます。')
        .addAttachmentOption(option =>
          option.setName('image')
            .setDescription('丸く切り抜きたい画像をアップロードしてください')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('meme')
        .setDescription('顔の良さでなんとかなると思っているジェネレーター')
        .addAttachmentOption(option =>
          option.setName('image')
            .setDescription('画像を選択(その画像のサイズに合わせて出すので小さすぎたりするとうまくできません)')
            .setRequired(true)
        )
    ),
  
  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const subcommand = interaction.options.getSubcommand();

      if (cooldown(commandName, interaction)) return;
      await interaction.deferReply();


        const attachment = interaction.options.getAttachment('image');
        if (!attachment || !attachment.url || !attachment.contentType?.startsWith('image/') || attachment.contentType === 'image/gif') {
            await interaction.editReply({
                content: '<:error:1302169165905526805> 画像をアップロードしてください',
            });
            return;
        }

      const image = await loadCanvasImage(attachment.url);
      let canvas, ctx, outputBuffer, embedDescription, fileName;

      switch (subcommand) {
        case 'mosaic':
          const { width, height } = image;
          ({ canvas, ctx } = createCanvasWithSize(width, height));
          applyMosaic(ctx, image, 10);
          outputBuffer = canvas.toBuffer('image/png');
          embedDescription = '画像にモザイクをかけました！';
          fileName = 'mosaic-image.png';
          break;

        case 'flip':
          const direction = interaction.options.getString('direction');
          ({ canvas, ctx } = createCanvasWithSize(image.width, image.height));
          flipImage(ctx, image, direction);
          outputBuffer = canvas.toBuffer('image/png');
          embedDescription = '画像を反転しました！';
          fileName = 'flipped-image.png';
          break;

        case 'mono':
          ({ canvas, ctx } = createCanvasWithSize(image.width, image.height));
          applyMonochrome(ctx, image);
          outputBuffer = canvas.toBuffer('image/png');
          embedDescription = '画像をモノクロにしました！';
          fileName = 'mono-image.png';
          break;

        case 'reversal':
          ({ canvas, ctx } = createCanvasWithSize(image.width, image.height));
          invertColors(ctx, image);
          outputBuffer = canvas.toBuffer('image/png');
          embedDescription = '画像を色反転しました！';
          fileName = 'inverted-image.png';
          break;

        case 'round':
          const size = Math.min(image.width, image.height);
          ({ canvas, ctx } = createSquareCanvas(size));
          clipCircle(ctx, image, size);
          outputBuffer = canvas.toBuffer('image/png');
          embedDescription = '画像を丸く切り抜きました！';
          fileName = 'rounded-image.png';
          break;

        case 'meme':
          const memeBuffer = await generateMeme(attachment.url);
          const embed = createEmbed(interaction)
            .setDescription('完成！')
            .setImage('attachment://overlay-image.png');

          await interaction.editReply({
            embeds: [embed],
            files: [{ attachment: memeBuffer, name: 'overlay-image.png' }],
          });
          return;

        default:
          throw new Error('<:error:1302169165905526805> 無効なサブコマンドです。');
      }

      const embed = createEmbed(interaction)
        .setDescription(embedDescription)
        .setImage(`attachment://${fileName}`);

      await interaction.editReply({
        embeds: [embed],
        files: [{ attachment: outputBuffer, name: fileName }],
      });
    } catch (error) {
      slashCommandError(error, interaction);
    }
  },
};