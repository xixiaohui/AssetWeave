/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { getXUSDT } from "@/lib/xusdtContract";
import { ethers } from "ethers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json();

    if (!to) {
      return Response.json({ error: "Missing 'to'" }, { status: 400 });
    }

    if (!ethers.isAddress(to)) {
      return Response.json({ error: "Invalid address" }, { status: 400 });
    }

    const amount = "100";

    // 获取 IP
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // 🔒 尝试插入记录（利用唯一索引防止重复领取）
    try {
      await pool.query(
        `
        INSERT INTO faucet_logs (wallet, amount, ip_address, claim_date)
        VALUES ($1, $2, $3, CURRENT_DATE)
        `,
        [to, amount, ip]
      );
    } catch (dbErr: any) {
      if (dbErr.code === "23505") {
        // 已经领取过今天
        return Response.json({ error: "Already claimed today" }, { status: 400 });
      }
      throw dbErr;
    }

    // 发币
    const xusdt = getXUSDT();
    const decimals = await xusdt.decimals();
    const amountInWei = ethers.parseUnits(amount, decimals);

    const tx = await xusdt.mint(to, amountInWei);
    await tx.wait();

    // 更新 tx_hash
    await pool.query(
      `
      UPDATE faucet_logs
      SET tx_hash = $1
      WHERE wallet = $2 AND claim_date = CURRENT_DATE
      `,
      [tx.hash, to]
    );

    return Response.json({
      success: true,
      tx: tx.hash,
      amount,
      to,
    });
  } catch (err: any) {
    console.error("Mint error:", err);
    return Response.json({ error: err.message || "Mint failed" }, { status: 500 });
  }
}

// GET 方法可查询今天是否已领取
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const wallet = url.searchParams.get("wallet");

  if (!wallet) return Response.json({ claimed: false });

  const { rows } = await pool.query(
    "SELECT * FROM faucet_logs WHERE wallet = $1 AND claim_date = CURRENT_DATE",
    [wallet]
  );

  return Response.json({ claimed: rows.length > 0 });
}