#!/usr/bin/env node
import { optimizeImages } from "../imageOptimizer.js";
import { updateUsages } from "../usageUpdater.js";

async function main() {
  const imgDir = process.argv[2];
  const useDir = process.argv[3];

  if (!imgDir || !useDir) {
    console.error("Usage: cli <imageDir> <usageDir>");
    process.exit(1);
  }

  const replacements = await optimizeImages(imgDir);
  await updateUsages(replacements, useDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
