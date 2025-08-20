import fs from "fs";
import { glob } from "glob";
import type { Replacements } from "./types.js";

export async function updateUsages(
  replacements: Replacements,
  useDir: string
): Promise<void> {
  const usageFiles: string[] = await glob(
    `${useDir}/**/*.{html,js,jsx,ts,tsx,css}`
  );
  for (const file of usageFiles) {
    let content = fs.readFileSync(file, "utf8");
    let changed = false;
    for (const [oldName, newName] of Object.entries(replacements)) {
      if (content.includes(oldName)) {
        content = content.split(oldName).join(newName);
        changed = true;
      }
    }
    if (changed) fs.writeFileSync(file, content);
  }
}
