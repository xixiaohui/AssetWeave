import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params;

  const { rows } = await pool.query(
    `
    SELECT
      a.*,
      t.id as token_id,
      t.total_supply,
      t.price_per_token
    FROM assets a
    JOIN tokens t ON t.asset_id = a.id
    WHERE a.id = $1
  `,
    [id]
  );

  return NextResponse.json(rows[0]);
}
