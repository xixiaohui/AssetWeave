/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TxReceiptCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
  Link,
  Button,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

interface TxResult {
  txHash: string;
  status: number;
  blockNumber: number;
  blockHash: string;
  gasUsed: string;
  gasPrice: string;
  from: string;
  to: string;
  logs?: any[];
  chainId?: number; // 可选，多链支持
}

interface TxReceiptCardProps {
  txResult: TxResult | null;
  hideLogs?: boolean; // 是否隐藏 logs
  chainName?: string; // 自定义链名显示
}

const chainExplorerMap: Record<number, string> = {
  1: "https://etherscan.io/tx/", // Ethereum Mainnet
  11155111: "https://sepolia.etherscan.io/tx/", // Sepolia
  137: "https://polygonscan.com/tx/", // Polygon
  56: "https://bscscan.com/tx/", // BSC
};

export const TxReceiptCard: React.FC<TxReceiptCardProps> = ({
  txResult,
  hideLogs = true,
  chainName,
}) => {
  if (!txResult) return null;

  // 自动选择浏览器链接
  const explorerBase =
    txResult.chainId && chainExplorerMap[txResult.chainId]
      ? chainExplorerMap[txResult.chainId]
      : "https://sepolia.etherscan.io/tx/";

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            链上交易详情 {chainName ? `(${chainName})` : ""}
          </Typography>

          <Divider />

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={600}>交易状态:</Typography>
            <Chip
              label={txResult.status === 1 ? "成功" : "失败"}
              color={txResult.status === 1 ? "success" : "error"}
              size="small"
            />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>交易哈希:</strong> {txResult.txHash}
            </Typography>

            <Typography variant="body2">
              <strong>区块号:</strong> {txResult.blockNumber}
            </Typography>

            <Typography variant="body2">
              <strong>区块哈希:</strong> {txResult.blockHash}
            </Typography>

            <Typography variant="body2">
              <strong>Gas Used:</strong> {txResult.gasUsed}
            </Typography>

            <Typography variant="body2">
              <strong>Gas Price:</strong> {txResult.gasPrice}
            </Typography>

            <Typography variant="body2">
              <strong>From:</strong> {txResult.from}
            </Typography>

            <Typography variant="body2">
              <strong>To:</strong> {txResult.to}
            </Typography>
          </Stack>

          {!hideLogs && txResult.logs && txResult.logs.length > 0 && (
            <>
              <Divider />
              <Typography variant="body2" fontWeight={600}>
                Event Logs:
              </Typography>
              <pre style={{ maxHeight: 800, overflow: "auto" }}>
                {JSON.stringify(txResult.logs, null, 2)}
              </pre>
            </>
          )}

          <Divider />

          <Button
            variant="contained"
            endIcon={<LaunchIcon />}
            component={Link}
            href={`${explorerBase}${txResult.txHash}`}
            target="_blank"
          >
            在区块浏览器查看
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};