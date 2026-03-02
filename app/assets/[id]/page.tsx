/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Asset } from "../page";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AssetDetailPage from "./AssetDetailPage";
import { Box, CircularProgress } from "@mui/material";
import AssetBuyPage from "./AssetBuyPage";

export default function PageClient() {
  const { id } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <>
      <AssetDetailPage asset={asset} />
      <AssetBuyPage asset={asset} />
    </>
  );
}
