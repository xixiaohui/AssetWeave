/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRWAPlatformContract } from "@/lib/rwaPlatformContract";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id, usdtAmount } = await req.json();

    if (!id || !usdtAmount) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const contract = getRWAPlatformContract();

    const amount = ethers.parseUnits(usdtAmount.toString(), 6);

    const tx = await contract.subscribe(id, amount);
    const receipt = await tx.wait();

    
    // 从链上读真实 totalRaised
    const asset = await contract.assets(id);

    // asset.totalRaised 是 6 decimals
    const totalRaisedHuman = Number(ethers.formatUnits(asset.totalRaised, 6));

    // 所以这里必须用原始 usdtAmount (人类单位)
    await pool.query(
      `
    UPDATE assets
    SET total_raised = $1,
        updated_at = now()
    WHERE token_id = $2
    `,
      [totalRaisedHuman, id],
    );

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
