import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import db from "@/lib/db";

//融资销售给投资人
export async function POST(req: NextRequest) {
  const { investor, assetId, amount } = await req.json();
  const rwa = getRWAProtocolContract();

  const tx = await rwa.mintToUser(investor, amount);
  await tx.wait();

  await db.query(
    `INSERT INTO rwa_sales(investor_wallet,asset_id,amount,tx_hash)
     VALUES($1,$2,$3,$4)`,
    [investor, assetId, amount, tx.hash]
  );

  await db.query(
    `INSERT INTO rwa_investors(wallet)
     VALUES($1)
     ON CONFLICT(wallet) DO NOTHING`,
    [investor]
  );

  return Response.json({ ok: true, tx: tx.hash });
}
