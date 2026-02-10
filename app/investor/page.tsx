/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import InvestorDashboard from "./InvestorDashboard";
import Box from "@mui/material/Box";

interface DividendInfo {
  total: string;
  claimed: string;
  claimable: string;
}

export default function InvestorPage() {
  const [address] = useState(() => {
    // 本地钱包
    // return localStorage.getItem("wallet") || "0xd12478358C37f5E86996eB917558b0ebfCc8A0e1";
    return "0xd12478358C37f5E86996eB917558b0ebfCc8A0e1";
  });

  const [balance, setBalance] = useState("");
  const [dividend, setDividend] = useState<DividendInfo>({
    total: "0",
    claimed: "0",
    claimable: "0",
  });
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!address) return;

    // 1️⃣ RWA 持仓
    fetch(`/api/rwa/balance?address=${address}`)
      .then((res) => res.json())
      .then((d) => setBalance(d.balance))
      .catch((err) => setError("获取余额失败"));

    // 2️⃣ 分红总览
    fetch(`/api/rwa/dividend-total?address=${address}`)
      .then((res) => res.json())
      .then((d: DividendInfo) => setDividend(d))
      .catch((err) => setError("获取分红失败"));

    // 3️⃣ 分红记录
    fetch(`/api/rwa/dividend-records?address=${address}`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => setError("获取分红记录失败"))
      .finally(() => setLoading(false));
  }, [address]);

  return (
    <Box
      sx={{
        pt: 12,
        px: 6,
        m: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <InvestorDashboard
        address={address}
        balance={balance}
        dividend={dividend.total}
        records={records}
        loading={loading}
        error={error}
      />
    </Box>
  );
}
