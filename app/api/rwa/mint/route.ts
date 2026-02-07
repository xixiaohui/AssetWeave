import { getRWAContract } from "@/lib/rwaContract";

export async function POST(req: Request) {
  const { to, amount } = await req.json();

  const rwa = getRWAContract();

  const tx = await rwa.mint(to, amount);
  await tx.wait();

  return Response.json({
    hash: tx.hash,
  });
}
