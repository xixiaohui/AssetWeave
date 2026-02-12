"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  TextField,
  Divider,
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";

interface Asset {
  asset_id: string;
  name: string;
  description?: string;
  doc_hash: string;
  total_issued: number;
  status: string;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  wallet_address: string;
  amount: number;
  token_amount: number;
  status: string;
  created_at: string;
}

export default function RwaDashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [newAsset, setNewAsset] = useState({
    asset_id: "",
    name: "",
    description: "",
    doc_hash: "",
    total_raise: "",
    price: "",
    raise_days: "",
    duration_days: "",
  });
  const [dividendAmount, setDividendAmount] = useState("");

  // useEffect(() => {
  //   const fetchAssets = async () => {
  //     const res = await axios.get("/api/admin/assets");
  //     setAssets(res.data);
  //   };

  //   const fetchSubs = async () => {
  //     const res = await axios.get("/api/admin/subscriptions");
  //     setSubs(res.data);
  //   };

  //   fetchAssets();
  //   fetchSubs();
  // }, []);

  const fetchAssets = async () => {
    const res = await axios.get("/api/admin/assets");
    setAssets(res.data);
  };

  const fetchSubs = async () => {
    const res = await axios.get("/api/admin/subscriptions");
    setSubs(res.data);
  };

  const handleCreateAsset = async () => {
    await axios.post("/api/admin/assets/create", newAsset);
    alert("资产创建成功");
    fetchAssets();
  };

  const handleMint = async (id: string) => {
    await axios.post("/api/admin/mint", { subscriptionId: id });
    alert("发币成功");
    fetchSubs();
  };

  const handleDistributeDividend = async () => {
    await axios.post("/api/admin/dividend", { amountEth: dividendAmount });
    alert("分红发放成功");
    setDividendAmount("");
  };

  return (
    <Box p={4}>
      <Typography variant="h3" mb={3}>RWA 管理后台</Typography>

      {/* ===== 创建资产 ===== */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>创建新资产</Typography>
          <Stack spacing={2} maxWidth={400}>
            <TextField label="Asset ID" value={newAsset.asset_id} onChange={e => setNewAsset({...newAsset, asset_id:e.target.value})}/>
            <TextField label="名称" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name:e.target.value})}/>
            <TextField label="描述" value={newAsset.description} onChange={e => setNewAsset({...newAsset, description:e.target.value})}/>
            <TextField label="文档哈希" value={newAsset.doc_hash} onChange={e => setNewAsset({...newAsset, doc_hash:e.target.value})}/>
            <TextField label="募集总额 (USDT)" value={newAsset.total_raise} onChange={e => setNewAsset({...newAsset, total_raise:e.target.value})}/>
            <TextField label="单价 (USDT)" value={newAsset.price} onChange={e => setNewAsset({...newAsset, price:e.target.value})}/>
            <TextField label="募集天数" value={newAsset.raise_days} onChange={e => setNewAsset({...newAsset, raise_days:e.target.value})}/>
            <TextField label="运行天数" value={newAsset.duration_days} onChange={e => setNewAsset({...newAsset, duration_days:e.target.value})}/>
            <Button variant="contained" color="primary" onClick={handleCreateAsset}>创建资产</Button>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my:4 }} />

      {/* ===== 资产列表 ===== */}
      <Card sx={{ mb:4 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>资产列表</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset ID</TableCell>
                <TableCell>名称</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>总发行</TableCell>
                <TableCell>文档哈希</TableCell>
                <TableCell>创建时间</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map(a => (
                <TableRow key={a.asset_id}>
                  <TableCell>{a.asset_id}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.status}</TableCell>
                  <TableCell>{a.total_issued}</TableCell>
                  <TableCell>{a.doc_hash}</TableCell>
                  <TableCell>{new Date(a.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Divider sx={{ my:4 }} />

      {/* ===== 认购列表 ===== */}
      <Card sx={{ mb:4 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>认购列表</Typography>
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
                    {s.status==='PENDING' && <Button variant="contained" size="small" onClick={()=>handleMint(s.id)}>发币</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Divider sx={{ my:4 }} />

      {/* ===== 分红 ===== */}
      <Card sx={{ mb:4 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>分红发放</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField label="ETH 数量" value={dividendAmount} onChange={e=>setDividendAmount(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleDistributeDividend}>发放分红</Button>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my:4 }} />

      {/* ===== 预留：清算 / 销毁按钮可加 ===== */}
      <Card sx={{ mb:4 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>清算 / 销毁</Typography>
          <Typography variant="body2">可扩展批量清算按钮，调用 API 批量 burnFromUser</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
