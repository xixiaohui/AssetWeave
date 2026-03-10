"use client";

import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert
} from "@mui/material";
import { useWallets } from "@privy-io/react-auth";

export default function KycApplyPage() {
  const { wallets } = useWallets();
  const address = wallets?.[0]?.address;

  const [loading,setLoading] = useState(false)
  const [success,setSuccess] = useState(false)

  const [form,setForm] = useState({
    wallet:address,
    full_name:"",
    country:"",
    id_type:"",
    id_number:""
  })

  const submit = async ()=>{

    if(!form.wallet || !form.full_name || !form.id_type || !form.id_number){
      alert("请填写完整信息")
      return
    }

    setLoading(true)

    await fetch("/api/rwa/kyc/apply",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify(form)
    })

    setLoading(false)
    setSuccess(true)
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 10 }}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={3}>
            KYC 身份认证
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              KYC 已提交，正在审核中
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              label="钱包地址"
              value={form.wallet}
              fullWidth
              disabled
            />

            <TextField
              label="真实姓名"
              placeholder="请输入您的真实姓名"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              fullWidth
            />

            <TextField
              label="国家 / 地区"
              placeholder="例如：中国 / United States"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              fullWidth
            />

            <TextField
              select
              label="证件类型"
              value={form.id_type}
              onChange={(e) => setForm({ ...form, id_type: e.target.value })}
              fullWidth
            >
              <MenuItem value="passport">护照</MenuItem>
              <MenuItem value="id_card">身份证</MenuItem>
              <MenuItem value="driver_license">驾驶证</MenuItem>
            </TextField>

            <TextField
              label="证件号码"
              placeholder="请输入证件号码"
              value={form.id_number}
              onChange={(e) => setForm({ ...form, id_number: e.target.value })}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              onClick={submit}
              disabled={loading}
              sx={{
                borderRadius: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {loading ? "提交中..." : "提交 KYC 申请"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}