/* eslint-disable @typescript-eslint/no-explicit-any */
// 资产市场

"use client";

import Link from "next/link";
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
      <p className="text-8xl text-white tracking-tighter text-balance">Assets Market</p>

      <div style={{ display: "grid", gap: 20 }}>
        {assets.map((a) => (
          <Link href={`/assets/${a.id}`} key={a.id}>
            <div
              
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
          </Link>
          
        ))}
      </div>
    </div>
  );
}
