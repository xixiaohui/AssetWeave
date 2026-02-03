
// 资产详情


import pool from "@/lib/db";
import AssetDetailClient from "./AssetDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const asset = rows[0];

  return <AssetDetailClient asset={asset} />;
}
