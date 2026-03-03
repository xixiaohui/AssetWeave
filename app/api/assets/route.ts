import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await pool.query(`
    SELECT
      a.id,
      a.name,
      a.description,
      a.category,
      a.cover_url,
      a.whitepaper_url,
      a.price,
      a.min_raise,
      a.max_raise,
      a.total_raised,
      a.apy,
      a.duration_days,
      a.token_symbol,
      a.status,
      a.created_at,
      a.start_time
    FROM assets a
    ORDER BY a.created_at DESC
  `);

  return NextResponse.json(rows);
}
