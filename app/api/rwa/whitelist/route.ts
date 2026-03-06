/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getRWAPlatformContract } from "@/lib/rwaPlatformContract";

export async function POST(req: NextRequest) {
  try {
    const { address, ok } = await req.json();

    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const contract = getRWAPlatformContract();

    // 调用链上
    const tx = await contract.setWhitelist(address, ok);
    const receipt = await tx.wait();

    // 同步数据库
    await pool.query(
      `
      INSERT INTO whitelist (wallet_address, is_whitelisted)
      VALUES ($1,$2)
      ON CONFLICT (wallet_address)
      DO UPDATE SET
        is_whitelisted = EXCLUDED.is_whitelisted,
        updated_at = now()
      `,
      [address.toLowerCase(), ok],
    );

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}