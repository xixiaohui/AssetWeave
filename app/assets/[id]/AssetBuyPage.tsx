/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useWallets } from "@privy-io/react-auth";

export default function AssetBuyPage({ asset }: any) {
  const { wallets } = useWallets();
  const address = wallets?.[0]?.address;

  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  // Snackbar 状态
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // 链上实时状态
  const [totalRaised, setTotalRaised] = useState<number>(0);
  const [investorCount, setInvestorCount] = useState<number>(0);

  const handleCloseSnackbar = () => setSnackbarOpen(false);



  // 🔄 获取资产链上数据
  const fetchAssetStatus = async () => {
    try {
      const res = await fetch(`/api/rwa/asset-status?id=${asset.token_id}`);
      const data = await res.json();
      if (res.ok) {
        setTotalRaised(Number(data.totalRaised));
        setInvestorCount(Number(data.investorCount));
      }
    } catch (err) {
      console.error("获取资产状态失败", err);
    }
  };

  useEffect(() => {
    fetchAssetStatus();
  }, []);

  const buy = async () => {
    try {
      if (!amount || amount <= 0) {
        setSnackbarMsg("请输入正确的购买份额");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      setLoading(true);

      const res = await fetch("/api/rwa/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: asset.token_id, usdtAmount: amount,userAddress: address }), // 这里的 userAddress 应该从用户的连接钱包中获取
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "认购失败");
      }

      setSnackbarMsg(`认购成功！交易哈希: ${data.txHash}，区块号: ${data.blockNumber}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // 认购成功后刷新链上数据
      fetchAssetStatus();
    } catch (err: any) {
      console.error(err);
      setSnackbarMsg(`认购失败: ${err.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 8, mb: 8, display: "flex", justifyContent: "center", px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 600, borderRadius: 4, boxShadow: 6, overflow: "hidden" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* 标题 */}
            <Typography variant="h4" fontWeight={700} textAlign="center">
              认购 {asset.name}
            </Typography>

            <Divider sx={{ borderColor: "grey.300" }} />

            {/* 描述 */}
            <Typography color="text.secondary" textAlign="center">
              {asset.description}
            </Typography>

            {/* 链上状态 */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">
                已筹金额: ¥{totalRaised.toLocaleString()}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                投资人数: {investorCount}
              </Typography>
            </Stack>

            {/* 价格 */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                单价：
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={700}>
                ¥{Number(asset.price).toLocaleString()}
              </Typography>
            </Stack>

            {/* 输入份额 */}
            <TextField
              label="购买份额"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 1 }}
            />

            {/* 总价 */}
            <Typography variant="subtitle1" textAlign="right" color="text.secondary">
              总价: ¥{(Number(asset.price) * amount).toLocaleString()}
            </Typography>

            {/* 购买按钮 */}
            <Button
              variant="contained"
              size="large"
              onClick={buy}
              disabled={loading}
              sx={{ py: 1.8, fontWeight: 600 }}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "认购中..." : "一键购买"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* MUI Snackbar 提示 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}