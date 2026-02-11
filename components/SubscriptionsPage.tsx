"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import axios from "axios";

interface Subscription {
  id: string;
  user_id: string;
  wallet_address: string;
  amount: number;
  token_amount: number;
  status: string;
  created_at: string;
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);

  const fetchSubs = async () => {
        const res = await axios.get("/api/admin/subscriptions");
        setSubs(res.data);
    };
  useEffect(() => {
    const fetchSubs = async () => {
        const res = await axios.get("/api/admin/subscriptions");
        setSubs(res.data);
    };
    
    fetchSubs();
  }, []);



  const handleMint = async (id: string) => {
    await axios.post("/api/admin/mint", { subscriptionId: id });
    alert("已发币");
    fetchSubs();
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>认购列表</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>用户ID</TableCell>
            <TableCell>钱包</TableCell>
            <TableCell>认购金额(USDT)</TableCell>
            <TableCell>Token数量</TableCell>
            <TableCell>状态</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subs.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.user_id}</TableCell>
              <TableCell>{s.wallet_address}</TableCell>
              <TableCell>{s.amount}</TableCell>
              <TableCell>{s.token_amount}</TableCell>
              <TableCell>{s.status}</TableCell>
              <TableCell>
                {s.status === 'PENDING' && (
                  <Button variant="contained" size="small" onClick={() => handleMint(s.id)}>发币</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
