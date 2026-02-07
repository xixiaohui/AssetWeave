import { ethers } from "ethers";

export async function GET() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const address = process.env.DEPLOYER_PUBLIC_KEY!;

  const balance = await provider.getBalance(address);

  return Response.json({
    eth: ethers.formatEther(balance),
  });
}
