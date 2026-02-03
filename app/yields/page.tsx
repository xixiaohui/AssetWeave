// 我的分红

import pool from "@/lib/db";

export default async function YieldsPage() {
  // 同样先用 email 找 investor
  const {
    rows: [user],
  } = await pool.query(
    `SELECT id FROM users WHERE email = 'investor@test.com'`
  );

  const investorId = user.id;

  const { rows } = await pool.query(
    `
    SELECT
      a.title,
      yd.amount,
      yr.description,
      yd.distributed_at
    FROM yield_distributions yd
    JOIN yield_records yr ON yd.yield_id = yr.id
    JOIN assets a ON yr.asset_id = a.id
    WHERE yd.user_id = $1
    ORDER BY yd.distributed_at DESC
  `,
    [investorId]
  );

  return (
    <div style={{ padding: 40 }}>
      <h1>My Yields</h1>

      <div style={{ display: "grid", gap: 20 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h2>{r.title}</h2>
            <p>Yield: ¥{r.amount}</p>
            <p>Source: {r.description}</p>
            <p>Date: {new Date(r.distributed_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
