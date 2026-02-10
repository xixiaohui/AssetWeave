// app/api/rwa/distribute-profit/route.ts
import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import { ethers } from "ethers";
import db from "@/lib/db";

//分红
export async function POST(req: NextRequest) {
  const { ethAmount, note } = await req.json(); // "0.5"
  const rwa = getRWAProtocolContract();

  const tx = await rwa.distributeProfit({
    value: ethers.parseEther(ethAmount),
  });

  await tx.wait();

  await db.query(
    `INSERT INTO rwa_profit_batches(eth_amount,tx_hash,note)
     VALUES($1,$2,$3)`,
    [ethAmount, tx.hash, note],
  );

  return Response.json({ ok: true, tx: tx.hash });
}
