import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

  const body = await req.json()

  const { wallet, full_name, country, id_type, id_number } = body


  await pool.query(

    `insert into rwa_kyc_requests
     (wallet_address,full_name,country,id_type,id_number)
     values ($1,$2,$3,$4,$5)
    `,

    [wallet,full_name,country,id_type,id_number]

  )

  return NextResponse.json({ success:true })
}