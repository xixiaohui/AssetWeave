import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await req.json();

    const {
      name,
      category,
      description,
      cover_url,
      whitepaper_url,
      price,
      min_raise,
      max_raise,
      apy,
      duration_days,
      start_time,
      token_symbol,
      issuer_id,
    } = body;

    // =============================
    // 1️⃣ 基础字段校验
    // =============================

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    if (!price || !min_raise || !max_raise || !duration_days) {
      return NextResponse.json(
        { error: "Missing financing parameters" },
        { status: 400 }
      );
    }

    if (Number(price) <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (Number(min_raise) > Number(max_raise)) {
      return NextResponse.json(
        { error: "min_raise cannot exceed max_raise" },
        { status: 400 }
      );
    }

    if (Number(duration_days) <= 0) {
      return NextResponse.json(
        { error: "duration_days must be positive" },
        { status: 400 }
      );
    }

    if (Number(max_raise) < Number(price)) {
      return NextResponse.json(
        { error: "max_raise must be >= price" },
        { status: 400 }
      );
    }

    // =============================
    // 2️⃣ 自动计算 end_time
    // =============================

    let computedEndTime = null;

    if (start_time) {
      const start = new Date(start_time);
      const end = new Date(start);
      end.setDate(end.getDate() + Number(duration_days));
      computedEndTime = end;
    }

    await client.query("BEGIN");

    // =============================
    // 3️⃣ 插入资产
    // =============================

    const insertQuery = `
      INSERT INTO assets (
        name,
        category,
        description,
        cover_url,
        whitepaper_url,
        price,
        min_raise,
        max_raise,
        total_raised,
        apy,
        duration_days,
        start_time,
        end_time,
        token_symbol,
        issuer_id,
        status
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,0,
        $9,$10,$11,$12,
        $13,$14,
        'draft'
      )
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [
      name,
      category,
      description,
      cover_url,
      whitepaper_url,
      price,
      min_raise,
      max_raise,
      apy,
      duration_days,
      start_time || null,
      computedEndTime,
      token_symbol,
      issuer_id,
    ]);

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      asset: result.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create asset error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}