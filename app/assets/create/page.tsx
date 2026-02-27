"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// --------------------
// 1️⃣ 表单验证 schema
// --------------------
const assetSchema = z.object({
  name: z.string().min(1, "请输入资产名称"),
  category: z.enum(["real_estate", "solar", "receivable"]),
  description: z.string().optional(),
  cover_url: z.string().url().optional(),
  whitepaper_url: z.string().url().optional(),
  price: z.number().positive("价格必须大于 0"),
  min_raise: z.number().nonnegative("最低募集金额不能为负"),
  max_raise: z.number().positive("最高募集金额必须大于 0"),
  apy: z.number().nonnegative().optional(),
  duration_days: z.number().positive("投资期限必须大于 0"),
  start_time: z.string().optional(),
  token_symbol: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetSchema>;

// --------------------
// 2️⃣ 页面组件
// --------------------
export default function CreateAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      category: "real_estate",
    },
  });

  const onSubmit = async (data: AssetFormData) => {
    setServerError("");
    setSuccess("");
    setLoading(true);

    try {
      // 自动计算 end_time
      const start = data.start_time ? new Date(data.start_time) : new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + data.duration_days);

      const payload = {
        ...data,
        price: Number(data.price),
        min_raise: Number(data.min_raise),
        max_raise: Number(data.max_raise),
        apy: data.apy ? Number(data.apy) : null,
        duration_days: Number(data.duration_days),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        issuer_id: "your_user_id_here", // 生产环境请使用登录用户 ID
      };

      const res = await fetch("/api/assets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "创建资产失败");
        return;
      }

      setSuccess("资产创建成功！");
      setTimeout(() => router.push("/assets"), 1000);
    } catch (err) {
      setServerError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 ,mt:7}}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        创建资产
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <Stack spacing={3}>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                label="资产名称"
                fullWidth
                {...field}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="资产类别"
                {...field}
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                <MenuItem value="real_estate">房地产</MenuItem>
                <MenuItem value="solar">光伏项目</MenuItem>
                <MenuItem value="receivable">应收账款</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                label="资产描述"
                multiline
                rows={3}
                {...field}
              />
            )}
          />

          <Controller
            name="cover_url"
            control={control}
            render={({ field }) => (
              <TextField
                label="封面 URL"
                {...field}
                error={!!errors.cover_url}
                helperText={errors.cover_url?.message}
              />
            )}
          />

          <Controller
            name="whitepaper_url"
            control={control}
            render={({ field }) => (
              <TextField
                label="白皮书 URL"
                {...field}
                error={!!errors.whitepaper_url}
                helperText={errors.whitepaper_url?.message}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                label="单份价格 (元)"
                type="number"
                {...field}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />

          <Controller
            name="min_raise"
            control={control}
            render={({ field }) => (
              <TextField
                label="最低募集金额 (元)"
                type="number"
                {...field}
                error={!!errors.min_raise}
                helperText={errors.min_raise?.message}
              />
            )}
          />

          <Controller
            name="max_raise"
            control={control}
            render={({ field }) => (
              <TextField
                label="最高募集金额 (元)"
                type="number"
                {...field}
                error={!!errors.max_raise}
                helperText={errors.max_raise?.message}
              />
            )}
          />

          <Controller
            name="apy"
            control={control}
            render={({ field }) => (
              <TextField
                label="年化收益率 (%)"
                type="number"
                {...field}
                error={!!errors.apy}
                helperText={errors.apy?.message}
              />
            )}
          />

          <Controller
            name="duration_days"
            control={control}
            render={({ field }) => (
              <TextField
                label="投资期限 (天)"
                type="number"
                {...field}
                error={!!errors.duration_days}
                helperText={errors.duration_days?.message}
              />
            )}
          />

          <Controller
            name="start_time"
            control={control}
            render={({ field }) => (
              <TextField
                label="募集开始时间"
                type="datetime-local"
                {...field}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="token_symbol"
            control={control}
            render={({ field }) => (
              <TextField
                label="代币符号"
                {...field}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "创建资产"}
          </Button>

        </Stack>
      </Box>
    </Container>
  );
}