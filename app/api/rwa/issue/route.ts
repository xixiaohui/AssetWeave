import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import db from "@/lib/db";

// 给这个资产铸造融资额度 Token
export async function POST(req: NextRequest) {
  const { assetId, amount } = await req.json();

  const rwa = getRWAProtocolContract();

  const tx = await rwa.issueToken(assetId, amount);
  await tx.wait();

  await db.query(
    `INSERT INTO rwa_issues(asset_id,amount,tx_hash)
     VALUES($1,$2,$3)`,
    [assetId, amount, tx.hash]
  );

  return Response.json({
    success: true,
    tx: tx.hash,
  });
}
