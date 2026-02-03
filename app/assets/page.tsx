/* eslint-disable @typescript-eslint/no-explicit-any */
// 资产市场

"use client";

import { useEffect, useState } from "react";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/assets")
      .then((res) => res.json())
      .then(setAssets);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Assets Market</h1>

      <div style={{ display: "grid", gap: 20 }}>
        {assets.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #ddd",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h2>{a.title}</h2>
            <p>Type: {a.asset_type}</p>
            <p>Total Value: ¥{a.total_value}</p>
            <p>Price per share: ¥{a.price_per_token}</p>
            <p>Total shares: {a.total_supply}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
