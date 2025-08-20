#!/usr/bin/env node
import { optimizeImages } from "../imageOptimizer.js";
import { updateUsages } from "../usageUpdater.js";

async function main() {
  const [, , imgDir, useDir, qualityArg] = process.argv;
  if (!imgDir || !useDir) {
    console.error("Usage: cli <imageDir> <usageDir> [--quality=number]");
    process.exit(1);
  }
  let beforeParsing = qualityArg?.split("=")[1] || "50";
  const quality = qualityArg?.startsWith("--quality=")
    ? parseInt(beforeParsing)
    : 50;

  const replacements = await optimizeImages(imgDir, quality);
  await updateUsages(replacements, useDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
