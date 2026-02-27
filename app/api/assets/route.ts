
import pool from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  const { rows } = await pool.query(`
    SELECT
      a.id,
      a.name,
      a.category,
      a.cover_url,
      a.price,
      a.max_raise,
      a.total_raised,
      a.apy,
      a.duration_days,
      a.token_symbol,
      a.status,
      a.created_at
    FROM assets a
    WHERE a.status = 'raising'
    ORDER BY a.created_at DESC
  `);

  return NextResponse.json(rows);
}
