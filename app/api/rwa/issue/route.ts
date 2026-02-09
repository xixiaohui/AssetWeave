import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";

// 给这个资产铸造融资额度 Token
export async function POST(req: NextRequest) {
  const { assetId, amount } = await req.json();

  const rwa = getRWAProtocolContract();

  const tx = await rwa.issueToken(assetId, amount);
  await tx.wait();

  return Response.json({
    success: true,
    tx: tx.hash,
  });
}
