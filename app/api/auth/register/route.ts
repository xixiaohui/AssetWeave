import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { Wallet } from "ethers";
import { encryptPrivateKey } from "@/lib/wallet-crypto";

export async function POST(req: Request) {
  const { email, name } = await req.json();

  // 1️⃣ 创建链上钱包
  const wallet = Wallet.createRandom();

  // 2️⃣ 加密私钥
  const encryptedKey = encryptPrivateKey(wallet.privateKey);

  // 3️⃣ 存入数据库
  await pool.query(
    `
    INSERT INTO users (email, name, role, wallet_address, encrypted_private_key)
    VALUES ($1, $2, 'investor', $3, $4)
    ON CONFLICT (email) DO NOTHING
  `,
    [email, name, wallet.address, encryptedKey]
  );

  return NextResponse.json({
    ok: true,
    wallet: wallet.address, // 可以返回给前端展示
  });
}
