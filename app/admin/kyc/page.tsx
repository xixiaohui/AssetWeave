"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  TextField,
  MenuItem,
  Drawer,
  Divider,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

type KycRow = {
  id: string;
  wallet_address: string;
  full_name: string;
  country: string;
  id_type: string;
  id_number: string;
  status: string;
  created_at: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminKycPage() {
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<KycRow | null>(null);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false; // 组件卸载
    };
  }, []);
  
  const { data, isLoading, mutate } = useSWR<KycRow[]>(
    `/api/admin/kyc?status=${status}`,
    fetcher
  );

  const rows = data || [];

  //同步链上白名单
  const uptoBlockChain = async (wallet_address: string) => {
    const res = await fetch("/api/rwa/whitelist",{
      method: "POST",
      headers: {  "Content-Type": "application/json" },
      body: JSON.stringify({ address: wallet_address, ok: true })
    });
    const data = await res.json(); 
    
    if(res.ok){
      console.log("Whitelist updated successfully for wallet:", data);
    }
  }

  const approve = async (id: string) => {
    console.log("Approving KYC ID:", id);
    const res = await fetch("/api/admin/kyc",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: "approved" })
    });
    const data = await res.json();
    console.log("拿到钱包地址",data.wallet_address); // 拿到钱包地址

    if(res.ok){
      console.log("KYC approved successfully for ID:", id);
      mutate(); // 刷新列表
    }


    // uptoBlockChain(data.wallet_address) // 同步链上白名单
  };


  const reject = async (id: string) => {
    const res = await fetch("/api/admin/kyc",{
      method: "POST",
      headers: {  "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "rejected" })
    });
    if(res.ok){
      console.log("KYC approved successfully for ID:", id);
      mutate(); // 刷新列表
    }
  };

  

  const columns: GridColDef[] = [
    {
      field: "wallet_address",
      headerName: "钱包地址",
      flex: 1.2,
    },
    {
      field: "full_name",
      headerName: "姓名",
      flex: 1,
    },
    {
      field: "country",
      headerName: "国家/地区",
      width: 120,
    },
    {
      field: "id_type",
      headerName: "证件类型",
      width: 140,
    },
    {
      field: "status",
      headerName: "状态",
      width: 130,
      renderCell: (params) => {
        const s = params.value;

        if (s === "pending")
          return <Chip label="待审核" color="warning" size="small" />;

        if (s === "approved")
          return <Chip label="已通过" color="success" size="small" />;

        return <Chip label="已拒绝" color="error" size="small" />;
      },
    },
    {
      field: "created_at",
      headerName: "提交时间",
      width: 180,
    },
    {
      field: "actions",
      headerName: "操作",
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{mt:1}}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelected(params.row)}
          >
            查看
          </Button>

          {/* { params.row.status === "pending" && ( */}
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => approve(params.row.id)}
              >
                通过
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => reject(params.row.id)}
              >
                拒绝
              </Button>
            </>
          {/* )} */}
        </Stack>
      ),
    },
  ];

  const filtered = rows.filter((r) => {
    if (!search) return true;

    return (
      r.wallet_address.toLowerCase().includes(search.toLowerCase()) ||
      r.full_name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box p={4} sx={{ mt: 7, maxWidth: 1600, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        KYC 审核管理
      </Typography>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
            <TextField
              label="搜索钱包 / 姓名"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              select
              label="状态筛选"
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ width: 160 }}
            >
              <MenuItem value="pending">待审核</MenuItem>
              <MenuItem value="approved">已通过</MenuItem>
              <MenuItem value="rejected">已拒绝</MenuItem>
            </TextField>

            <Button variant="outlined" onClick={() => mutate()}>
              刷新
            </Button>
          </Stack>

          <DataGrid
            rows={filtered}
            columns={columns}
            loading={isLoading}
            autoHeight
            pageSizeOptions={[10, 20, 50]}
            disableRowSelectionOnClick
          />
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={!!selected}
        onClose={() => {
          if (!mounted.current) return;
          setSelected(null);
        }}
      >
        <Box width={420} p={3}>
          {selected && (
            <>
              <Typography variant="h6" fontWeight={700}>
                KYC 详情
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <TextField label="钱包地址" value={selected.wallet_address} InputProps={{ readOnly: true }} />
                <TextField label="姓名" value={selected.full_name} InputProps={{ readOnly: true }} />
                <TextField label="国家/地区" value={selected.country} InputProps={{ readOnly: true }} />
                <TextField label="证件类型" value={selected.id_type} InputProps={{ readOnly: true }} />
                <TextField label="证件号码" value={selected.id_number} InputProps={{ readOnly: true }} />
                <TextField label="提交时间" value={selected.created_at} InputProps={{ readOnly: true }} />
              </Stack>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}