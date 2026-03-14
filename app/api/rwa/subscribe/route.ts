/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRWAPlatformContract } from "@/lib/rwaPlatformContract";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import RWAArtifact from "@/abi/RWAPlatform1155.json";
import pool from "@/lib/db";
import { getRWAPlatformAddress } from "@/lib/contracts";

export async function POST(req: NextRequest) {
  try {
    const { id, usdtAmount,userAddress} = await req.json();

    if (!id || !usdtAmount) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    console.log("Received subscribe request:", { id, usdtAmount,userAddress });

    const { rows } = await pool.query(
      "SELECT is_whitelisted FROM whitelist WHERE LOWER(wallet_address) = LOWER($1)",
      [userAddress]
    );
    console.log("Whitelist query result:", rows);

    if (!rows[0]?.is_whitelisted) {
      return NextResponse.json({ error: "Not whitelisted!还没有通过KYC认证" }, { status: 403 });
    }

    const contract = getRWAPlatformContract()

    return NextResponse.json({ success: true, message: "Whitelist check passed, ready to subscribe on-chain." });

    //链上查询
    console.log("链上查询 UserAddress is:", userAddress);
    const isWhite = await contract.whitelisted(userAddress);
    console.log("链上查询结果 isWhite:", isWhite);

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
