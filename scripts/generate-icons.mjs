import sharp from "sharp";

const src = "public/icons/icon.svg";
const targets = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-touch-icon.png", 180],
];

for (const [file, size] of targets) {
  await sharp(src, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(`public/icons/${file}`);
  console.log("generated", file);
}
