import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import { NextRequest } from "next/server";

//累计分红
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")!;
  const rwa = getRWAProtocolContract();

  const balance = await rwa.balanceOf(address);
  const profitPerToken = await rwa.profitPerToken();
  const claimed = await rwa.claimedProfit(address);

  const totalProfit = balance * profitPerToken;
  const claimable = totalProfit - claimed;

  return Response.json({
    claimed: claimed.toString(),
    claimable: claimable.toString(),
  });
}
