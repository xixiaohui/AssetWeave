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
      `SELECT wallet_address FROM users WHERE email=$1`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "用户不存在" },
        { status: 404 }
      );
    }

    const walletAddress = rows[0].wallet_address;

    // 这里你可以触发链上逻辑，比如：
    // - 检查余额
    // - 同步持仓
    // - 更新分红状态
    // 甚至触发 ERC20 mint 等操作

    return NextResponse.json({ ok: true, wallet_address: walletAddress });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}
