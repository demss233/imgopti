import fs from "fs";
import path from "path";
import sharp from "sharp";
import { glob } from "glob";
import type { Replacements } from "./types.js";

export async function optimizeImages(
  imgDir: string,
  quality: number = 100
): Promise<Replacements> {
  const files = await glob(`${imgDir}/**/*.{png,jpg,jpeg}`);
  const replacements: Replacements = {};

  for (const file of files) {
    const ext = path.extname(file).slice(1).toLowerCase();
    const base = path.basename(file, path.extname(file));
    const dir = path.dirname(file);
    const formats: { [key: string]: any } = {
      webp: sharp(file).webp({ quality }),
      avif: sharp(file).avif({ quality }),
    };

    const paths = await Promise.all(
      Object.entries(formats).map(async ([fmt, pipeline]) => {
        const out = path.join(dir, `${base}.${fmt}`);
        await pipeline.toFile(out);
        const size = fs.statSync(out).size;
        return { fmt, out, size };
      })
    );

    const { fmt, out } = paths.reduce((a, b) => (a.size < b.size ? a : b));

    fs.unlinkSync(file);
    for (const { fmt: f, out: o } of paths) {
      if (o !== out && fs.existsSync(o)) {
        fs.unlinkSync(o);
      }
    }

    replacements[path.basename(file)] = path.basename(out);
  }
  return replacements;
}
