/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email 必填" },
        { status: 400 }
      );
    }

    // 查用户
    const { rows } = await pool.query(
      `SELECT id, email, name, wallet_address FROM users WHERE email=$1`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "用户不存在，请先注册" },
        { status: 404 }
      );
    }

    const user = rows[0];

    // 返回给前端邮箱 + 链上钱包地址（不要返回 private_key）
    return NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        name: user.name,
        wallet_address: user.wallet_address,
      },
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
