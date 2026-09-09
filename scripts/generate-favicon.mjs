// One-off script: renders app/icon.svg to a PNG via sharp, then wraps that
// PNG in a minimal single-image ICO container (the modern PNG-in-ICO
// format, supported everywhere since Vista/IE9) to replace the default
// create-next-app placeholder at app/favicon.ico. Not part of the build --
// run by hand (`node scripts/generate-favicon.mjs`) only when the icon
// design changes.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, "..", "app", "icon.svg");
const icoPath = path.join(__dirname, "..", "app", "favicon.ico");

const SIZE = 48;

const svg = readFileSync(svgPath);
const png = await sharp(svg).resize(SIZE, SIZE).png().toBuffer();

const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;
const dataOffset = ICONDIR_SIZE + ICONDIRENTRY_SIZE;

const header = Buffer.alloc(ICONDIR_SIZE);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: 1 = icon
header.writeUInt16LE(1, 4); // image count

const entry = Buffer.alloc(ICONDIRENTRY_SIZE);
entry.writeUInt8(SIZE, 0); // width (SIZE < 256, fits in one byte)
entry.writeUInt8(SIZE, 1); // height
entry.writeUInt8(0, 2); // color count (0 = use PNG's own)
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png.length, 8); // size of PNG data
entry.writeUInt32LE(dataOffset, 12); // offset to PNG data

writeFileSync(icoPath, Buffer.concat([header, entry, png]));
console.log(`Wrote ${icoPath} (${SIZE}x${SIZE}, ${png.length} bytes PNG payload)`);
