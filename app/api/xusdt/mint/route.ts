/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { ethers } from "ethers";
import { getXUSDT }  from "@/lib/xusdtContract";


export async function POST(req: NextRequest) {
  try {
    const { to, amount } = await req.json();

    if (!to || !amount) {
      return new Response("Missing 'to' or 'amount'", { status: 400 });
    }

    const xusdt = getXUSDT();

    const decimals = await xusdt.decimals();
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);

    const tx = await xusdt.mint(to, amountInWei);
    await tx.wait();

    return Response.json({
      success: true,
      tx: tx.hash,
      minted: amount,
      to,
    });
  } catch (err: any) {
    console.error("Mint XUSDT error:", err);
    return new Response(err.message || "Mint failed", { status: 500 });
  }
}
