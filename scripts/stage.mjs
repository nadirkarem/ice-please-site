// Four states of one photograph for the Savoir-faire story: frosted → clear.
import sharp from 'sharp';
const src = 'public/img/gourmet-ice-1148.webp';
for (const [i, s] of [28, 12, 4, 0].entries()) {
  let img = sharp(src).resize({ width: 1000 });
  if (s) img = img.blur(s);
  await img.webp({ quality: 80 }).toFile(`public/img/stage-${i}-1000.webp`);
}
console.log('ok');
