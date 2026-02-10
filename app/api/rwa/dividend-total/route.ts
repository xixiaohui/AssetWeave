import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")!;
  const rwa = getRWAProtocolContract();

  // 获取累计分红（含已领取 + 待领取）
  const totalDividend = await rwa.dividendOf(address);
  const claimable = await rwa.claimableOf(address);
  const claimed = totalDividend - claimable;

  return Response.json({
    claimed: claimed.toString(),     // 已领取
    claimable: claimable.toString(), // 待领取
    total: totalDividend.toString(), // 总分红
  });
}