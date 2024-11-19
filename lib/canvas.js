const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

async function generateMeme(uploadedImageUrl) {
  const overlayImagePath = path.resolve(__dirname, '../data/assets/meme.png');

  try {
    const background = await loadImage(uploadedImageUrl);  
    const overlayBuffer = fs.readFileSync(overlayImagePath);
    const overlay = await loadImage(overlayBuffer);

    // キャンバス作成
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    // 背景とオーバーレイ画像を描画
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(overlay, 0, 0, background.width, background.height);  // サイズ調整

    // 結果の画像バッファを作成
    const buffer = canvas.toBuffer('image/png');

    return buffer;  // 合成された画像を返す
  } catch (error) {
    console.error('画像の合成中にエラーが発生しました:', error);
    throw new Error('画像の合成に失敗しました。');  // エラーを投げて上位で処理できるようにする
  }
}

module.exports = { generateMeme };
