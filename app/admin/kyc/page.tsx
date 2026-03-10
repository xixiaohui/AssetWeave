"use client";

import { useEffect, useState } from "react";
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
  Divider
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

export default function AdminKycPage() {
  const [rows, setRows] = useState<KycRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<KycRow | null>(null);

  const load = async () => {
    setLoading(true);
    let active = true;

    try {
        const res = await fetch(`/api/admin/kyc?status=${status}`);
        const data = await res.json();

        if (active) setRows(data);
    } finally {
        if (active) setLoading(false);
    }

    return () => { active = false };
    };

  useEffect(() => {
    const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/kyc?status=${status}`);
    const data = await res.json();
    setRows(data);
    setLoading(false);
  };
    load();
  }, [status]);

  const approve = async (wallet: string) => {
    await fetch("/api/rwa/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });
    load();
  };

  const reject = async (id: string) => {
    await fetch("/api/admin/kyc/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
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
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelected(params.row)}
          >
            查看
          </Button>

          {params.row.status === "pending" && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => approve(params.row.wallet_address)}
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
          )}
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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            mb={3}
          >
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

            <Button variant="outlined" onClick={load}>
              刷新
            </Button>
          </Stack>

          <DataGrid
            rows={filtered}
            columns={columns}
            loading={loading}
            autoHeight
            pageSizeOptions={[10, 20, 50]}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                fontWeight: 700,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Drawer 详情 */}
      <Drawer
        anchor="right"
        open={!!selected}
        onClose={() => setSelected(null)}
      >
        <Box width={420} p={3}>
          {selected && (
            <>
              <Typography variant="h6" fontWeight={700}>
                KYC 详情
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <TextField
                  label="钱包地址"
                  value={selected.wallet_address}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="姓名"
                  value={selected.full_name}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="国家/地区"
                  value={selected.country}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="证件类型"
                  value={selected.id_type}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="证件号码"
                  value={selected.id_number}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="提交时间"
                  value={selected.created_at}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />

                <Divider />

                {selected.status === "pending" && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => approve(selected.wallet_address)}
                    >
                      通过
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => reject(selected.id)}
                    >
                      拒绝
                    </Button>
                  </Stack>
                )}
              </Stack>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}