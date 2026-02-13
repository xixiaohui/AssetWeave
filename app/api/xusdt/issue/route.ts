/* eslint-disable @typescript-eslint/no-explicit-any */

// app/api/xusdt/issue/route.ts
import { NextRequest } from "next/server";
import { ethers } from "ethers";
import { getXUSDT } from "@/lib/xusdtContract";
import pg from "@/lib/db"; // 你自建 PostgreSQL 客户端

export async function POST(req: NextRequest) {
  const { investors, amount } = await req.json(); // investors: string[], amount: number
  if (!investors || !amount) {
    return new Response("Missing params", { status: 400 });
  }


  const xusdt = getXUSDT();

  const decimals = await xusdt.decimals();
  const amountInWei = ethers.parseUnits(amount.toString(), decimals);

  const results: any[] = [];

  for (const addr of investors) {
    const tx = await xusdt.mint(addr, amountInWei);
    await tx.wait();

    // 数据库记录
    await pg.query(
      `INSERT INTO xusdt_distribution (investor, amount, tx_hash) VALUES ($1,$2,$3)`,
      [addr, amount, tx.hash]
    );

    results.push({ investor: addr, tx: tx.hash });
  }

  return Response.json({ results });
}
