import { NextRequest } from "next/server";
import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import { ethers } from "ethers";


//向所有持币人分 ETH
export async function POST(req: NextRequest) {
  const { ethAmount } = await req.json(); // "0.2"

  const rwa = getRWAProtocolContract();

  const tx = await rwa.distributeProfit({
    value: ethers.parseEther(ethAmount),
  });

  await tx.wait();

  return Response.json({
    success: true,
    tx: tx.hash,
  });
}
