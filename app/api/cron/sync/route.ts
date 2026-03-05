/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import pool from "@/lib/db";
import RWAArtifact from "@/abi/RWAPlatform1155.json";

const MAX_BLOCK_RANGE = 2000;
const LOCK_ID = 987654; // 随便一个固定整数

export async function GET(req: NextRequest) {
    
  if (
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔒 防止并发 cron
    await client.query("SELECT pg_advisory_xact_lock($1)", [LOCK_ID]);

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.RWA_CONTRACT!,
      RWAArtifact.abi,
      provider,
    );

    const iface = new ethers.Interface(RWAArtifact.abi);

    // 1️⃣ 读取上次同步区块
    const { rows } = await client.query(
      "SELECT last_block FROM chain_sync WHERE id = 1 FOR UPDATE",
    );

    const lastBlock = Number(rows[0]?.last_block ?? 0);

    // 2️⃣ 当前区块
    const currentBlock = await provider.getBlockNumber();

    if (currentBlock <= lastBlock) {
      await client.query("COMMIT");
      return NextResponse.json({ message: "No new blocks" });
    }

    // 3️⃣ 分段同步
    const toBlock =
      currentBlock - lastBlock > MAX_BLOCK_RANGE
        ? lastBlock + MAX_BLOCK_RANGE
        : currentBlock;

    const filter = contract.filters.Subscribed();

    const logs = await contract.queryFilter(filter, lastBlock + 1, toBlock);

    // 🧠 用 Map 防止重复读取同一资产
    const updatedAssets = new Map<number, boolean>();

    for (const log of logs) {
      try {
        const parsed = iface.parseLog(log);

        if (parsed?.name !== "Subscribed") continue;

        const investor = parsed.args.investor as string;
        const id = Number(parsed.args.id);
        const usdtAmount = parsed.args.usdtAmount as bigint;

        const usdtHuman = Number(ethers.formatUnits(usdtAmount, 6));

        // 1️⃣ 插入投资记录（防重复）
        await client.query(
          `
          INSERT INTO investments (
            asset_token_id,
            investor_address,
            usdt_amount,
            tx_hash,
            block_number
          )
          VALUES ($1,$2,$3,$4,$5)
          ON CONFLICT (tx_hash) DO NOTHING
          `,
          [id, investor, usdtHuman, log.transactionHash, log.blockNumber],
        );

        // 2️⃣ 每个资产只读取一次链上 totalRaised
        if (!updatedAssets.has(id)) {
          const asset = await contract.assets(id);

          const totalRaisedHuman = Number(
            ethers.formatUnits(asset.totalRaised, 6),
          );

          await client.query(
            `
            UPDATE assets
            SET total_raised = $1,
                updated_at = now()
            WHERE token_id = $2
            `,
            [totalRaisedHuman, id],
          );

          updatedAssets.set(id, true);
        }
      } catch {
        // 解析失败忽略
      }
    }

    // 4️⃣ 更新 last_block（关键修复点）
    await client.query(
      "UPDATE chain_sync SET last_block = $1 WHERE id = 1",
      [toBlock], // ✅ 这里不能是 [[toBlock]]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      fromBlock: lastBlock + 1,
      toBlock,
      eventsFound: logs.length,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");

    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
