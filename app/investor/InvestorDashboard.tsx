/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Link,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";

// const getContractAddress = async () => {
//   const res = await fetch("/deployed_rwa.json");
//   const json = await res.json();
//   return json.RWAProtocol;
// };

export default function InvestorDashboard({
  address,
  balance,
  dividend,
  records,
}: any) {
  const [contract, setContract] = useState<string>("");

  useEffect(() => {
    fetch("/deployed_rwa.json")
      .then((r) => r.json())
      .then((d) => setContract(d.RWAProtocol));
  }, []);

  return (
    <Box sx={{ p: 6, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Investor Dashboard 投资人看板
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography>
              钱包地址：<b>{address}</b>
            </Typography>
            <Typography>
              RWA 持仓：<b>{balance}</b>
            </Typography>
            <Typography>
              累计分红：<b>{dividend}</b>
            </Typography>

            {contract ? (
              <Link
                href={`https://sepolia.etherscan.io/address/${contract}`}
                target="_blank"
                underline="hover"
              >
                查看链上合约
              </Link>
            ) : (
              <CircularProgress size={20} />
            )}
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        分红记录
      </Typography>

      <Stack spacing={2}>
        {records.map((r: any, i: number) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Typography>金额：{r.amount}</Typography>
              <Divider sx={{ my: 1 }} />
              <Link
                href={`https://sepolia.etherscan.io/tx/${r.tx}`}
                target="_blank"
                underline="hover"
              >
                Tx: {r.tx}
              </Link>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
