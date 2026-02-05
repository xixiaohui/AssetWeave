import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, wallet } = await req.json();

  await pool.query(
    `
    INSERT INTO users (email, wallet_address, role)
    VALUES ($1, $2, 'investor')
    ON CONFLICT (email)
    DO UPDATE SET wallet_address = EXCLUDED.wallet_address
  `,
    [email, wallet]
  );

  return NextResponse.json({ ok: true });
}
