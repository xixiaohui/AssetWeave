import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import crypto from "crypto";

//上传文件 → hash → 上链存证

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const assetId = form.get("assetId") as string;

  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = "0x" + crypto.createHash("sha256").update(buffer).digest("hex");

  const rwa = getRWAProtocolContract();

  const tx = await rwa.registerAsset(assetId, hash);
  await tx.wait();

  return Response.json({
    success: true,
    assetId,
    hash,
    tx: tx.hash,
  });
}
