import { NextRequest } from "next/server";
import { getXUSDT } from "@/lib/xusdtContract";
import { ethers } from "ethers";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")!;

  const xusdt = getXUSDT();

  const [raw, decimals, symbol] = await Promise.all([
    xusdt.balanceOf(address),
    xusdt.decimals(),
    xusdt.symbol(),
  ]);

  const balance = ethers.formatUnits(raw, decimals);

  return Response.json({
    symbol,
    balance,
  });
}
