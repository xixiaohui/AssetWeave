// 我的持仓


import  pool  from "@/lib/db";

export default async function PortfolioPage() {
  // 先写死一个 investor，后面接登录系统再替换
  const investorId = "97129f62-117a-4715-a8e5-fb7310cb194e";

  const { rows } = await pool.query(
    `
    SELECT
      a.title,
      a.asset_type,
      th.amount,
      t.price_per_token,
      (th.amount * t.price_per_token) AS current_value
    FROM token_holders th
    JOIN tokens t ON th.token_id = t.id
    JOIN assets a ON t.asset_id = a.id
    WHERE th.user_id = $1
  `,
    [investorId]
  );

  return (
    <div style={{ padding: 40 }}>
      <h1>My Portfolio</h1>

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
            <p>Type: {r.asset_type}</p>
            <p>Shares: {r.amount}</p>
            <p>Price: ¥{r.price_per_token}</p>
            <p>
              <strong>Current Value: ¥{r.current_value}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
