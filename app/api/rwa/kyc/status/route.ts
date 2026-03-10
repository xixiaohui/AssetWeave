import pool from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest){

  const wallet = req.nextUrl.searchParams.get("wallet")

  const { rows } = await pool.query(

    `select status from rwa_kyc_requests
     where wallet_address=$1
     order by created_at desc
     limit 1`,

    [wallet]

  )

  return NextResponse.json(rows[0] || { status:"none"})
}