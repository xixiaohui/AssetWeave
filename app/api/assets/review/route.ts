
import pool from "@/lib/db";
import { NextResponse } from "next/server";




// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const status = url.searchParams.get("status") || "draft";

//   const { rows } = await pool.query("SELECT * FROM assets WHERE status = $1", [status]);
//   return NextResponse.json(rows);
// }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");

  // 默认查询 draft + approved
  const statuses =
    statusParam === "draft"
      ? ["draft", "approved","pending_review","raising","sold_out","expired","repaying","finished","rejected"]
      : statusParam
      ? [statusParam]
      : ["draft", "approved"];

  const { rows } = await pool.query(
    `SELECT * FROM assets WHERE status = ANY($1)`,
    [statuses]
  );

  return NextResponse.json(rows);
}