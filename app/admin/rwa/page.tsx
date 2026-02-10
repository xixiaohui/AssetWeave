/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";

export default function RWAManagementPage() {
  const [log, setLog] = useState<string>("");

  const callApi = async (url: string, body: any) => {
    setLog("⏳ Processing...");
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLog(`✅ Tx: ${data.tx}`);
  };

  return (
    <Box sx={{ p: 6, pt: 12 }}>
      <Typography variant="h4" gutterBottom>
        RWA 管理后台流程
      </Typography>

      <Stack spacing={4}>
        {/* 1️⃣ 注册资产 */}
        <Card>
          <CardContent>
            <Typography variant="h6">① 注册资产资质</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <TextField label="Asset ID" id="assetId" />
              <TextField label="Doc Hash(IPFS)" id="docHash" />
              <Button
                variant="contained"
                onClick={() =>
                  callApi("/api/rwa/register-asset", {
                    assetId: (document.getElementById("assetId") as any).value,
                    docHash: (document.getElementById("docHash") as any).value,
                  })
                }
              >
                注册资产
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* 2️⃣ Token 化 */}
        <Card>
          <CardContent>
            <Typography variant="h6">② Token 化发行</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <TextField label="Asset ID" id="issueAssetId" />
              <TextField label="发行数量" id="issueAmount" />
              <Button
                variant="contained"
                onClick={() =>
                  callApi("/api/rwa/issue", {
                    assetId: (document.getElementById("issueAssetId") as any)
                      .value,
                    amount: Number(
                      (document.getElementById("issueAmount") as any).value
                    ),
                  })
                }
              >
                发行 Token
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* 3️⃣ 融资销售 */}
        <Card>
          <CardContent>
            <Typography variant="h6">③ 卖给投资人（融资）</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <TextField label="投资人地址" id="investor" fullWidth />
              <TextField label="Token 数量" id="sellAmount" />
              <Button
                variant="contained"
                onClick={() =>
                  callApi("/api/rwa/distribute", {
                    investor: (document.getElementById("investor") as any).value,
                    amount: Number(
                      (document.getElementById("sellAmount") as any).value
                    ),
                  })
                }
              >
                发 Token
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* 4️⃣ 分红 */}
        <Card>
          <CardContent>
            <Typography variant="h6">④ 分红</Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <TextField label="分红 ETH 数量" id="ethAmount" />
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  callApi("/api/rwa/distribute-profit", {
                    ethAmount: (document.getElementById("ethAmount") as any)
                      .value,
                  })
                }
              >
                执行分红
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* 日志 */}
        <Typography variant="body1" sx={{ mt: 2 }}>
          {log}
        </Typography>
      </Stack>
    </Box>
  );
}
