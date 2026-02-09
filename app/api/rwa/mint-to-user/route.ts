/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import { ethers } from "ethers";

export async function POST(req: NextRequest) {
  try {
    const { to, amount } = await req.json();

    if (!ethers.isAddress(to)) {
      return Response.json({ error: "Invalid address" }, { status: 400 });
    }

    if (!amount || Number(amount) <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const rwa = getRWAProtocolContract();

    // 注意：ERC20 有 decimals，通常是 18
    const decimals = await rwa.decimals();
    const mintAmount = ethers.parseUnits(String(amount), decimals);

    const tx = await rwa.mint(to, mintAmount);
    await tx.wait();

    return Response.json({
      success: true,
      to,
      amount,
      tx: tx.hash,
    });
  } catch (e: any) {
    return Response.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
