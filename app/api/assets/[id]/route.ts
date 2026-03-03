import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params;

  console.log(id)

  const { rows } = await pool.query(
    `
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
      a.register_tx_hash,
      a.token_id
    FROM assets a
    WHERE a.id = $1
  `,
    [id],
  );

  return NextResponse.json(rows[0]);
}
