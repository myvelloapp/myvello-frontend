const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icons/logo-ico.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { size: 512, out: path.join(__dirname, '../public/icons/icon-512x512.png') },
    { size: 512, out: path.join(__dirname, '../src/app/icon.png') },
    { size: 192, out: path.join(__dirname, '../public/icons/icon-192x192.png') },
    { size: 180, out: path.join(__dirname, '../public/icons/apple-touch-icon.png') },
    { size: 180, out: path.join(__dirname, '../src/app/apple-icon.png') },
    { size: 32, out: path.join(__dirname, '../public/favicon-32x32.png') },
    { size: 16, out: path.join(__dirname, '../public/favicon-16x16.png') },
    { size: 256, out: path.join(__dirname, '../../desktop/icon.png') },
  ];

  for (const target of targets) {
    // Generate icon with padding so it sits perfectly in circles / squircles (PWA maskable compliant)
    const padding = Math.round(target.size * 0.1);
    const innerSize = target.size - padding * 2;

    const innerBuffer = await sharp(svgBuffer)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: target.size,
        height: target.size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: innerBuffer, gravity: 'center' }])
      .png()
      .toFile(target.out);

    console.log(`Generated: ${target.out} (${target.size}x${target.size})`);
  }

  // Also create favicon.ico from 32x32
  const ico32 = await sharp(svgBuffer).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFormat('png').toBuffer();
  fs.writeFileSync(path.join(__dirname, '../src/app/favicon.ico'), ico32);
  console.log('Updated: src/app/favicon.ico');
}

generateIcons().catch(console.error);
