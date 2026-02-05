import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { Wallet } from "ethers";
import { encryptPrivateKey } from "@/lib/wallet-crypto";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const { rows } = await pool.query(
    `SELECT * FROM email_verification_codes 
     WHERE email=$1 AND code=$2 AND used=false
     AND created_at > now() - interval '5 minutes'`,
    [email, code]
  );

  if (rows.length === 0)
    return NextResponse.json({ ok: false }, { status: 400 });

  await pool.query(
    `UPDATE email_verification_codes SET used=true WHERE id=$1`,
    [rows[0].id]
  );

  // 如果用户不存在 → 自动注册 + 生成钱包
  const userRes = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  let user = userRes.rows[0];

  if (!user) {
    const wallet = Wallet.createRandom();
    const encrypted = encryptPrivateKey(wallet.privateKey);

    const insert = await pool.query(
      `INSERT INTO users (email, role, wallet_address, encrypted_private_key)
       VALUES ($1,'investor',$2,$3) RETURNING *`,
      [email, wallet.address, encrypted]
    );

    user = insert.rows[0];
  }

  return NextResponse.json({
    ok: true,
    userId: user.id,
    wallet: user.wallet_address,
  });
}
