import { getRWAProtocolContract } from "@/lib/rwaProtocolContract";
import { NextRequest } from "next/server";
import type { EventLog } from "ethers";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")!;
  const rwa = getRWAProtocolContract();

  // ✅ 用 ProfitClaimed 事件
  const filter = rwa.filters.ProfitClaimed(address);

  // 查询日志
  const logs = await rwa.queryFilter(filter);

  // ethers v6 事件参数是数组
  const records = logs
    .filter((l): l is EventLog => "args" in l)
    .map((l) => ({
      tx: l.transactionHash,
      amount: l.args[1].toString(), // args[0] = user, args[1] = amount
    }));

  return Response.json(records);
}