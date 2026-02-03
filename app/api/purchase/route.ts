import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const { tokenId, buyerId, amount } = await req.json();

  // 查单价
  const { rows } = await pool.query(
    `SELECT price_per_token FROM tokens WHERE id = $1`,
    [tokenId]
  );

  const price = rows[0].price_per_token;
  const total = price * amount;

  await pool.query(
    `
    INSERT INTO purchases (token_id, buyer_id, amount, total_price)
    VALUES ($1, $2, $3, $4)
  `,
    [tokenId, buyerId, amount, total]
  );

  return NextResponse.json({ success: true });
}
