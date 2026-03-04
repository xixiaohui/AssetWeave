/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Asset } from "../page";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AssetDetailPage from "./AssetDetailPage";
import { Box, CircularProgress, Typography } from "@mui/material";
import AssetBuyPage from "./AssetBuyPage";
import { TxReceiptCard } from "@/components/TxReceiptCard";

export default function PageClient() {
  const { id } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [txResult, setTxResult] = useState<any>({
    assetId: "9dc3df1d-6cf3-4024-bdba-ff75e0bd7e85",
    actionType: "register",
    txHash: "0xd848be84248e3f19bd3e5177f4b081925563222a4c1750951cac3d38c174faf4",
    blockHash:"0xb44b9c0af3124cafe3528687c922ee458cec1be4741b8b000fbd0b5c51f1c0b0",
    status: 1, // 1 = success, 0 = fail
    blockNumber: 10373899,
    gasUsed: "185432",
    from: "0xd12478358C37f5E86996eB917558b0ebfCc8A0e1",
    to: "0xCeDe98d5B92dc354Eb1d544be3481C516D18ea8E",
    timestamp: Date.now(),
    logs: [
      {
        "_type": "log",
        "address": "0xCeDe98d5B92dc354Eb1d544be3481C516D18ea8E",
        "blockHash": "0xb44b9c0af3124cafe3528687c922ee458cec1be4741b8b000fbd0b5c51f1c0b0",
        "blockNumber": 10373899,
        "data": "0x",
        "index": 173,
        "topics": [
          "0xcc7b4929606ce963ba54b6a998f106f7748e78c03dc7f08fd77aeb28230eb2d3",
          "0x000000000000000000000000000000000000000000000000000000000000000a"
        ],
        "transactionHash": "0xd848be84248e3f19bd3e5177f4b081925563222a4c1750951cac3d38c174faf4",
        "transactionIndex": 95
      }
    ]
  });

  const fetchTx = async (assetId: string, txHash: string) => {
    const res = await fetch(`/api/assets/${assetId}/tx/${txHash}`);
    if (!res.ok) throw new Error("获取链上交易失败");
    return await res.json();
  };

  useEffect(() => {
    if (!id) return;

    const fetchAsset = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/assets/${id}`);
        if (!res.ok) throw new Error("获取资产数据失败");
        const data: Asset = await res.json();

        // 动态计算进度百分比
        const assetWithProgress = {
          ...data,
          progress_percent: data.max_raise
            ? (data.total_raised / data.max_raise) * 100
            : 0,
        };

        setAsset(assetWithProgress);
      } catch (err: any) {
        setError(err.message || "未知错误");
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  useEffect(() => {
    if (!asset) return;
    console.log("资产数据：", asset);
    // 如果资产有链上交易记录
    if (!asset.register_tx_hash) return;

    console.log("开始读取链上交易数据，txHash:", asset.register_tx_hash);

    const loadTx = async () => {
      try {
        const data = await fetchTx(asset.id, asset.register_tx_hash!);
        setTxResult(data);

        console.log("链上交易数据：", data);
      } catch (err) {
        console.error("读取链上交易失败", err);
      }
    };

    loadTx();
  }, [asset]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 10, textAlign: "center", color: "red" }}>{error}</Box>
    );

  if (!asset) return <Box sx={{ mt: 10, textAlign: "center" }}>未找到资产</Box>;

  return (
    <Box sx={{ p: 6, mt: 10, maxWidth: 700, mx: "auto" }}>
      <AssetDetailPage asset={asset} />
      {!asset.register_tx_hash ? (
        <Box sx={{ mt: 4, textAlign: "center", color: "gray" }}>
          <Typography variant="h6" gutterBottom>该资产尚未上链注册</Typography>
        </Box>
      ) : (
        <TxReceiptCard
          txResult={txResult}
          chainName="Sepolia"
          hideLogs={false}
        />
      )}
      {asset.status === "raising" && <AssetBuyPage asset={asset} />}
    </Box>
  );
}
