const { createCanvas, loadImage } = require('@napi-rs/canvas');

/**
 * 画像をロードします。
 * @param {string} url - 画像のURL。
 * @returns {Promise<Image>} - ロードされた画像。
 */
async function loadCanvasImage(url) {
  return await loadImage(url);
}

/**
 * 正方形のキャンバスを作成し、コンテキストを返します。
 * @param {number} size - キャンバスのサイズ。
 * @returns {{ canvas: Canvas, ctx: CanvasRenderingContext2D }} - キャンバスとコンテキスト。
 */
function createSquareCanvas(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

/**
 * 任意のサイズのキャンバスを作成し、コンテキストを返します。
 * @param {number} width - キャンバスの幅。
 * @param {number} height - キャンバスの高さ。
 * @returns {{ canvas: Canvas, ctx: CanvasRenderingContext2D }} - キャンバスとコンテキスト。
 */
function createCanvasWithSize(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

/**
 * 円形に画像をクリッピングします。
 * @param {CanvasRenderingContext2D} ctx - コンテキスト。
 * @param {Image} image - 描画する画像。
 * @param {number} size - 画像サイズ。
 */
function clipCircle(ctx, image, size) {
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(
    image,
    (image.width - size) / 2,
    (image.height - size) / 2,
    size,
    size,
    0,
    0,
    size,
    size
  );
}

/**
 * 色を反転します。
 * @param {CanvasRenderingContext2D} ctx - コンテキスト。
 * @param {Image} image - 描画する画像。
 */
function invertColors(ctx, image) {
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * モザイクを適用します。
 * @param {CanvasRenderingContext2D} ctx - コンテキスト。
 * @param {Image} image - 描画する画像。
 * @param {number} mosaicSize - モザイクのサイズ。
 */
function applyMosaic(ctx, image, mosaicSize) {
  ctx.drawImage(image, 0, 0);
  for (let y = 0; y < ctx.canvas.height; y += mosaicSize) {
    for (let x = 0; x < ctx.canvas.width; x += mosaicSize) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      ctx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
      ctx.fillRect(x, y, mosaicSize, mosaicSize);
    }
  }
}

/**
 * モノクロ変換を適用します。
 * @param {CanvasRenderingContext2D} ctx - コンテキスト。
 * @param {Image} image - 描画する画像。
 */
function applyMonochrome(ctx, image) {
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // R
    data[i + 1] = avg; // G
    data[i + 2] = avg; // B
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * 画像を指定方向に反転します。
 * @param {CanvasRenderingContext2D} ctx - コンテキスト。
 * @param {Image} image - 描画する画像。
 * @param {string} direction - 反転の方向 ('horizontal', 'vertical', 'both')。
 */
function flipImage(ctx, image, direction) {
  if (direction === 'horizontal') {
    ctx.scale(-1, 1);
    ctx.drawImage(image, -image.width, 0);
  } else if (direction === 'vertical') {
    ctx.scale(1, -1);
    ctx.drawImage(image, 0, -image.height);
  } else if (direction === 'both') {
    ctx.scale(-1, -1);
    ctx.drawImage(image, -image.width, -image.height);
  }
}

module.exports = {
  loadCanvasImage,
  createSquareCanvas,
  createCanvasWithSize,
  clipCircle,
  invertColors,
  applyMosaic,
  applyMonochrome,
  flipImage,
};