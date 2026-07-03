import { polaroidConfig, type PolaroidConfig } from '../config/polaroid.config';

function loadImage(source: HTMLImageElement | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    if (source instanceof Blob) {
      img.src = URL.createObjectURL(source);
    } else {
      resolve(source);
    }
  });
}

function createPaperTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    data[i] = 248 + noise;
    data[i + 1] = 246 + noise;
    data[i + 2] = 240 + noise;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#000000';
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      if (Math.random() > 0.7) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  ctx.globalAlpha = 1;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function ensureFontLoaded(fontFamily: string, sizes: number[]): Promise<void> {
  const loads = sizes.map(
    (size) => document.fonts.load(`${size}px "${fontFamily}"`),
  );
  await Promise.all(loads);
  await document.fonts.ready;
}

export async function generatePolaroid(
  image: HTMLImageElement | Blob,
  partialConfig?: Partial<PolaroidConfig>,
): Promise<Blob> {
  const cfg: PolaroidConfig = { ...polaroidConfig, ...partialConfig };
  const { outputWidth, outputHeight } = cfg;

  await ensureFontLoaded(cfg.fontFamily, [cfg.nameFontSize, cfg.dateFontSize]);

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const loadedImg = await loadImage(image);

  const border = cfg.borderThickness;
  const bottomExtra = cfg.bottomBorderExtra;
  const innerWidth = outputWidth - border * 2;
  const photoHeight = outputHeight - border * 2 - bottomExtra;
  const photoX = border;
  const photoY = border;

  ctx.clearRect(0, 0, outputWidth, outputHeight);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
  ctx.shadowBlur = cfg.shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = cfg.shadowOffsetY;
  roundRect(ctx, border / 2, border / 2, outputWidth - border, outputHeight - border, cfg.cornerRadius + 4);
  ctx.fillStyle = '#E8E4DC';
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, 0, 0, outputWidth, outputHeight, cfg.cornerRadius);
  ctx.clip();
  ctx.fillStyle = cfg.paperColor;
  ctx.fillRect(0, 0, outputWidth, outputHeight);
  createPaperTexture(ctx, outputWidth, outputHeight);
  ctx.restore();

  const photoAspect = innerWidth / photoHeight;
  const imgAspect = loadedImg.width / loadedImg.height;
  let sx = 0;
  let sy = 0;
  let sw = loadedImg.width;
  let sh = loadedImg.height;

  if (imgAspect > photoAspect) {
    sw = loadedImg.height * photoAspect;
    sx = (loadedImg.width - sw) / 2;
  } else {
    sh = loadedImg.width / photoAspect;
    sy = (loadedImg.height - sh) / 2;
  }

  ctx.save();
  roundRect(ctx, photoX, photoY, innerWidth, photoHeight, 4);
  ctx.clip();
  ctx.drawImage(loadedImg, sx, sy, sw, sh, photoX, photoY, innerWidth, photoHeight);
  ctx.restore();

  const captionY = photoY + photoHeight + bottomExtra / 2;

  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(border + 20, photoY + photoHeight + 16);
  ctx.lineTo(outputWidth - border - 20, photoY + photoHeight + 16);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = cfg.textColor;

  ctx.font = `500 ${cfg.nameFontSize}px "${cfg.fontFamily}", Georgia, serif`;
  ctx.fillText(cfg.coupleNames, outputWidth / 2, captionY - 20);

  ctx.font = `400 ${cfg.dateFontSize}px "${cfg.fontFamily}", Georgia, serif`;
  ctx.fillStyle = '#6B635B';
  ctx.fillText(cfg.weddingDate, outputWidth / 2, captionY + 24);

  if (image instanceof Blob) {
    URL.revokeObjectURL(loadedImg.src);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export Polaroid'));
      },
      'image/png',
      1.0,
    );
  });
}
