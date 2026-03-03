/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL!),
});

const safeSerialize = (obj: any): any => {
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(safeSerialize);
  if (obj && typeof obj === "object") {
    const res: any = {};
    for (const k in obj) {
      res[k] = safeSerialize(obj[k]);
    }
    return res;
  }
  return obj;
};

const serializeLog = (log: any) => {
  return safeSerialize({
    ...log,
    blockNumber: Number(log.blockNumber),
    transactionIndex: Number(log.transactionIndex),
    logIndex: Number(log.logIndex),
  });
};

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; txHash: string }>;
  },
) {
  try {
    const { id, txHash } = await params;

    console.log(id, txHash);

    // 1️⃣ 获取交易
    const tx = await client.getTransaction({
      hash: txHash as `0x${string}`,
    });

    // 2️⃣ 获取交易回执
    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    // 3️⃣ 获取区块（拿时间戳）
    const block = await client.getBlock({
      blockHash: receipt.blockHash,
    });

    console.log("Fetched on-chain tx data:", { tx, receipt, block });

    return NextResponse.json({
      assetId: id,
      actionType: "register", // 可根据日志解析动态判断
      txHash: receipt.transactionHash,
      blockHash: receipt.blockHash,
      status: receipt.status === "success" ? 1 : 0,
      blockNumber: Number(receipt.blockNumber),
      gasUsed: receipt.gasUsed.toString(),
      from: tx.from,
      to: tx.to,
      timestamp: Number(block.timestamp) * 1000,
      logs: receipt.logs.map(serializeLog),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch on-chain tx" },
      { status: 500 },
    );
  }
}
