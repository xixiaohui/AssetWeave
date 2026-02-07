import fs from "fs";
import path from "path";

export function getRWAAddress() {
  const filePath = path.join(process.cwd(), "deployed.json");
  const deployed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return deployed.rwaAsset;
}
