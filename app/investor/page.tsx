/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import InvestorDashboard from "./InvestorDashboard";
import Box from "@mui/material/Box";



export default function InvestorPage() {
  const [address] = useState(() => {
    
      console.log("localStorage wallet");
    //   return localStorage.getItem("wallet");
        return "0xd12478358C37f5E86996eB917558b0ebfCc8A0e1";
    
  });

  const [balance, setBalance] = useState("");
  const [dividend, setDividend] = useState("");
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/rwa/balance?address=${address}`)
      .then((r) => r.json())
      .then((d) => setBalance(d.balance));

    fetch(`/api/rwa/dividend-total?address=${address}`)
      .then((r) => r.json())
      .then((d) => setDividend(d.total));

    fetch(`/api/rwa/dividend-records?address=${address}`)
      .then((r) => r.json())
      .then(setRecords);
  }, []);

  return (
    <Box
      sx={{
        pt: 12, // 给 AppBar 留空间
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
        dividend={dividend}
        records={records}
      ></InvestorDashboard>
    </Box>
  );
}
