import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query(`
    SELECT
      a.id,
      a.title,
      a.asset_type,
      a.total_value,
      t.total_supply,
      t.price_per_token
    FROM assets a
    JOIN tokens t ON t.asset_id = a.id
    WHERE a.status = 'active'
    ORDER BY a.created_at DESC
  `);

  return NextResponse.json(rows);
}
