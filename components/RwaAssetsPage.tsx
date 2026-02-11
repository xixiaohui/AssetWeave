"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
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

export default function RwaAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);

   


  useEffect(() => {
    const fetchAssets = async () => {
        const res = await axios.get("/api/admin/assets");
        setAssets(res.data);
    };
  
    fetchAssets();
  }, []);

 
  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>资产管理</Typography>
      <Button variant="contained" color="primary" href="/admin/assets/create">创建新资产</Button>
      <Table sx={{ mt: 2 }}>
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
    </Box>
  );
}
