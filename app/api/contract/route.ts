import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "deployed.json");
  const deployed = JSON.parse(fs.readFileSync(filePath, "utf8"));

  return Response.json({ address: deployed.rwaAsset });
}