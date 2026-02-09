import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import { EventLog } from "ethers";
import { NextRequest } from "next/server";

//分红记录（事件日志，投资人最爱）
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")!;
  const rwa = getRWAProtocolContract();

  const filter = rwa.filters.DividendPaid(address);
  const logs = await rwa.queryFilter(filter);

  const records = logs
    .filter((l): l is EventLog => "args" in l) // ⭐ 关键
    .map((l) => ({
      tx: l.transactionHash,
      amount: l.args[1].toString(), // index 1 是 amount
    }));

  return Response.json(records);
}
