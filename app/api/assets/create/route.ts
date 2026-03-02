import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await req.json();

    const {
      is_perpetual,
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
        { error: "资产名称和类别必填" },
        { status: 400 }
      );
    }

    if (!price || !min_raise || !max_raise) {
      return NextResponse.json(
        { error: "价格/最低募集/最高募集金额必填" },
        { status: 400 }
      );
    }

    if (Number(price) <= 0) {
      return NextResponse.json(
        { error: "单份价格必须大于 0" },
        { status: 400 }
      );
    }

    if (Number(min_raise) > Number(max_raise)) {
      return NextResponse.json(
        { error: "最低募集金额不能大于最高募集金额" },
        { status: 400 }
      );
    }

    if (Number(max_raise) < Number(price)) {
      return NextResponse.json(
        { error: "最高募集金额必须 >= 单份价格" },
        { status: 400 }
      );
    }

    // duration_days 只有非永续时才校验
    let finalDuration: number | null = null;
    let computedEndTime: Date | null = null;

    if (!is_perpetual) {
      if (!duration_days || Number(duration_days) <= 0) {
        return NextResponse.json(
          { error: "投资期限必须为正数" },
          { status: 400 }
        );
      }
      finalDuration = Number(duration_days);

      // 自动计算 end_time
      if (start_time) {
        const start = new Date(start_time);
        const end = new Date(start);
        end.setDate(end.getDate() + finalDuration);
        computedEndTime = end;
      }
    }

    await client.query("BEGIN");

    // =============================
    // 2️⃣ 插入资产
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
      description || null,
      cover_url || null,
      whitepaper_url || null,
      price,
      min_raise,
      max_raise,
      apy || null,
      finalDuration,
      start_time || null,
      computedEndTime,
      token_symbol || null,
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
      { error: "服务器内部错误" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}