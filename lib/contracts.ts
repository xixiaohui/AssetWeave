import fs from "fs";
import path from "path";

export function getRWAAddress() {
  const filePath = path.join(process.cwd(), "deployed.json");
  const deployed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return deployed.rwaAsset;
}


export function getRWAProtocolAddress() {
  const filePath = path.join(process.cwd(), "deployed_rwa.json");
  const deployed = JSON.parse(fs.readFileSync(filePath, "utf8"));

  
  return deployed.RWAProtocol;
}