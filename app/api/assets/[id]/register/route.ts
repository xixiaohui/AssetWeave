import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import pool from "@/lib/db"; // 数据库
import { getRWAPlatformContract } from "@/lib/rwaPlatformContract";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { params } = context;
  const { id } = await params; // ✅ 需要 await 获取 id

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ 获取资产信息
    const assetRes = await client.query(
      "SELECT * FROM assets WHERE id=$1 FOR UPDATE",
      [id],
    );
    if (assetRes.rowCount === 0)
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });

    const asset = assetRes.rows[0];

    if (asset.status !== "approved") {
      return NextResponse.json(
        { error: "Asset not approved" },
        { status: 400 },
      );
    }

    // 2️⃣ 链上调用
    const contract = getRWAPlatformContract();

    // 3️⃣ 计算 deadline 和 duration
    const deadline = Math.floor(new Date(asset.start_time).getTime() / 1000);
    const duration = asset.duration_days * 24 * 60 * 60;

    const tx = await contract.registerAsset(
      asset.token_id,
      ethers.parseUnits(asset.price.toString(), 6), // USDT 6 decimals
      ethers.parseUnits(asset.min_raise.toString(), 6),
      ethers.parseUnits(asset.max_raise.toString(), 6),
      deadline,
      duration,
    );

    const receipt = await tx.wait(); // 等待交易上链

    // 4️⃣ 更新数据库状态
    await client.query(
      `
      UPDATE assets
      SET 
        status = 'raising',
        register_tx_hash = $1,
        register_block_number = $2,
        register_gas_used = $3,
        register_confirmed_at = NOW()
      WHERE id = $4
    `,
      [
        receipt.hash,
        receipt.blockNumber,
        receipt.gasUsed.toString(),
        id,
      ],
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
      status: receipt.status,
      blockNumber:receipt.blockNumber,
      blockHash: receipt.blockHash,
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: receipt.gasPrice.toString(),
      from: receipt.from,
      to: receipt.to,
      logs: receipt.logs,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json(
      { error: "Failed to register asset" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
