import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendVerificationCode } from "@/lib/email";

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json();
  const code = genCode();

  await pool.query(
    `INSERT INTO email_verification_codes (email, code) VALUES ($1,$2)`,
    [email, code]
  );

  await sendVerificationCode(email, code);

  return NextResponse.json({ ok: true });
}
