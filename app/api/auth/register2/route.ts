import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { Wallet } from "ethers";
import { encryptPrivateKey } from "@/lib/wallet-crypto";

export async function POST(req: Request) {
  const { email, name } = await req.json();

  // 生成钱包
  const wallet = Wallet.createRandom();
  const encryptedKey = encryptPrivateKey(wallet.privateKey);

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
    user: {
      email: email,
      name: name,
      wallet_address: wallet.address,
    },
  });
}
