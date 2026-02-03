// 发行后台



"use client";

import { useState } from "react";

export default function IssuerPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState(0);
  const [supply, setSupply] = useState(10000);
  const [price, setPrice] = useState(100);

  const submit = async () => {
    await fetch("/api/issuer/create-asset", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc,
        value,
        supply,
        price,
      }),
    });

    alert("资产已发行，已进入市场");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Issue New Asset</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <br />
      <textarea
        placeholder="Description"
        onChange={(e) => setDesc(e.target.value)}
      />
      <br />
      <input
        type="number"
        placeholder="Total Value"
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <br />
      <input
        type="number"
        placeholder="Total Shares"
        onChange={(e) => setSupply(Number(e.target.value))}
      />
      <br />
      <input
        type="number"
        placeholder="Price per Share"
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <br />
      <button onClick={submit}>发行资产</button>
    </div>
  );
}
