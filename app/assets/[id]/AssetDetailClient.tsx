/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function AssetDetailClient({ asset }: any) {
  const [amount, setAmount] = useState(10);

  const buy = async () => {
    await fetch("/api/purchase", {
      method: "POST",
      body: JSON.stringify({
        tokenId: asset.token_id,
        buyerId: "填你的investor uuid",
        amount,
      }),
    });

    alert("购买成功");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>{asset.title}</h1>
      <p>{asset.description}</p>
      <p>单价：¥{asset.price_per_token}</p>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button onClick={buy}>一键购买</button>
    </div>
  );
}
