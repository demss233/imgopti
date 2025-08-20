import fs from "fs";
import path from "path";
import sharp from "sharp";
import { glob } from "glob";
import type { Replacements } from "./types.js";

export async function optimizeImages(imgDir: string): Promise<Replacements> {
  const files: string[] = await glob(`${imgDir}/**/*.{png,jpg,jpeg}`);
  const replacements: Replacements = {};

  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    const dir = path.dirname(file);
    const webp = path.join(dir, base + ".webp");
    const avif = path.join(dir, base + ".avif");

    await sharp(file).toFile(webp);
    await sharp(file).toFile(avif);

    const webpSize = fs.statSync(webp).size;
    const avifSize = fs.statSync(avif).size;

    const chosen = webpSize < avifSize ? webp : avif;
    const chosenExt = path.extname(chosen);

    if (chosen === webp) fs.unlinkSync(avif);
    else fs.unlinkSync(webp);

    fs.unlinkSync(file);
    replacements[path.basename(file)] = base + chosenExt;
  }

  return replacements;
}
