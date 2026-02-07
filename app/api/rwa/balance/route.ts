import { getRWAContract } from "@/lib/rwaContract";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address")!;

  console.log("address is ",address);

  const rwa = getRWAContract();
  const balance = await rwa.balanceOf(address);

  return Response.json({ balance: balance.toString() });
}
