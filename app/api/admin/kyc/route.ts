/* eslint-disable @typescript-eslint/no-explicit-any */
/* app/api/admin/kyc/route.ts */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");

    let query = `
      SELECT 
        id,
        wallet_address,
        full_name,
        country,
        id_type,
        id_number,
        status,
        to_char(created_at,'YYYY-MM-DD HH24:MI') as created_at
      FROM rwa_kyc_requests
    `;

    const values: any[] = [];

    if (status) {
      query += ` WHERE status = $1`;
      values.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const { rows } = await pool.query(query, values);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch KYC list" },
      { status: 500 }
    );
  }
}

// ----------------------------
// POST 用于更新 KYC 状态
// body: { id: string, status: "approved" | "rejected" }
// ----------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    console.log("Received KYC update request:", body);

    if (!id || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "参数错误，必须提供 id 和合法的 status" },
        { status: 400 }
      );
    }

    // 更新 KYC 状态
    await pool.query(
      "UPDATE rwa_kyc_requests SET status = $1 WHERE id = $2",
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "更新 KYC 状态失败" }, { status: 500 });
  }
}