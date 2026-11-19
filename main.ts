// news-image-20261119 — one picture that sums up the world's news of Thursday 19 November 2026.
//
// The picture itself is authored as entry.png beside this file: a dated front page whose three
// lead stories carry the day's three biggest events, and whose briefs cover the rest of the day
// across regions. The program copies those bytes into the grader's writable output directory,
// because the judge sees exactly the bytes that land there and nothing else.
//
// Node 22, standard library only, no network. Outside the grader, MAKEFUN_OUTPUT_DIR stands in
// for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);
const target = join(outputDir, 'entry.png');

const MAX_BYTES = 1024 * 1024;
const size = statSync(source).size;
if (size > MAX_BYTES) {
  throw new Error(`entry.png is ${size} bytes; the gate takes at most ${MAX_BYTES}`);
}

copyFileSync(source, target);

const written = readFileSync(target);
if (written.length !== size) {
  throw new Error(`copied ${written.length} bytes of ${size}`);
}

// The gate also caps the picture at 1024 by 1024, so read the PNG header it wrote rather than
// trusting the file name: bytes 16..24 of a PNG hold the IHDR width and height, big-endian.
const PNG_SIGNATURE = '89504e470d0a1a0a';
if (written.subarray(0, 8).toString('hex') !== PNG_SIGNATURE) {
  throw new Error('entry.png is not a PNG');
}
const width = written.readUInt32BE(16);
const height = written.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}; the gate takes at most 1024x1024`);
}

console.log(`wrote ${target}: ${written.length} bytes, ${width}x${height}`);
