import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const ALLOWED_STATUS = [
  "draft",
  "pending_review",
  "approved",
  "raising",
  "sold_out",
  "expired",
  "repaying",
  "finished",
  "rejected",
];

export async function PATCH(
  req: NextRequest,
  context : { params: Promise<{ id: string }> },
) {
  const client = await pool.connect();

  try {
    // ✅ 这里必须 await
    const { id } = await context.params;

    const { status } = await req.json();

    // 1️⃣ 基础校验
    if (!status || !ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    // 2️⃣ 查询当前状态
    const currentRes = await client.query(
      "SELECT status FROM assets WHERE id = $1",
      [id],
    );

    if (!currentRes.rowCount) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const currentStatus = currentRes.rows[0].status;

    // 3️⃣ 可选：限制状态流转（推荐）
    if (currentStatus === "finished") {
      return NextResponse.json(
        { error: "Finished asset cannot be modified" },
        { status: 400 },
      );
    }

    // 4️⃣ 更新状态
    await client.query("UPDATE assets SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);

    return NextResponse.json({
      success: true,
      oldStatus: currentStatus,
      newStatus: status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
