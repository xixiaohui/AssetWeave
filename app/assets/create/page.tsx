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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* --------------------------
   1️⃣ Zod Schema
--------------------------- */

const assetSchema = z
  .object({
    is_perpetual: z.boolean(),

    name: z.string().min(1, "请输入资产名称"),

    category: z.enum(["real_estate", "solar", "receivable"], {
      errorMap: () => ({ message: "请选择资产类别" }),
    }),

    description: z.string().optional(),
    cover_url: z.string().url("请输入正确的 URL").optional(),
    whitepaper_url: z.string().url("请输入正确的 URL").optional(),

    price: z.coerce
      .number({ invalid_type_error: "单份价格必须为数字" })
      .positive("价格必须大于 0"),

    min_raise: z.coerce
      .number({ invalid_type_error: "最低募集金额必须为数字" })
      .nonnegative("最低募集金额不能为负"),

    max_raise: z.coerce
      .number({ invalid_type_error: "最高募集金额必须为数字" })
      .positive("最高募集金额必须大于 0"),

    apy: z.coerce
      .number({ invalid_type_error: "年化收益率必须为数字" })
      .min(0, "年化收益率不能为负")
      .max(100, "年化收益率不能超过 100%")
      .optional(),

    duration_days: z.coerce
      .number({ invalid_type_error: "投资期限必须为数字" })
      .positive("投资期限必须大于 0")
      .optional()
      .nullable(),

    start_time: z.string().optional(),
    token_symbol: z.string().optional(),
  })
  .refine((data) => data.is_perpetual || data.duration_days, {
    message: "固定期限资产必须填写投资期限",
    path: ["duration_days"],
  })
  .refine((data) => data.max_raise >= data.min_raise, {
    message: "最高募集金额不能小于最低募集金额",
    path: ["max_raise"],
  });

type AssetFormData = z.infer<typeof assetSchema>;

const aw_issuer_id = "9390f914-e9d7-4d77-b661-94d5ac3151d9";

/* --------------------------
   2️⃣ 页面组件
--------------------------- */

export default function CreateAssetPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      is_perpetual: false,
      name: "",
      category: "real_estate",
      description: "",
      cover_url: "",
      whitepaper_url: "",
      price: 0,
      min_raise: 0,
      max_raise: 0,
      apy: undefined,
      duration_days: undefined,
      start_time: "",
      token_symbol: "",
    },
  });

  const isPerpetual = watch("is_perpetual");

  /* --------------------------
     提交逻辑
  --------------------------- */

  const onSubmit = async (data: AssetFormData) => {
    setServerError("");
    setSuccess("");
    setLoading(true);

    try {
      const start = data.start_time ? new Date(data.start_time) : new Date();

      let end: Date | null = null;

      if (!data.is_perpetual && data.duration_days) {
        end = new Date(start);
        end.setDate(end.getDate() + data.duration_days);
      }

      const payload = {
        ...data,
        duration_days: data.is_perpetual ? null : data.duration_days,
        start_time: start.toISOString(),
        end_time: end ? end.toISOString() : null,
        issuer_id: aw_issuer_id,
      };

      console.log(JSON.stringify(payload))


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

  /* --------------------------
     页面 UI
  --------------------------- */

  return (
    <Container maxWidth="sm" sx={{ py: 6, mt: 7 }}>
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
              <TextField label="资产描述" multiline rows={3} {...field} />
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
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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
                value={field.value ?? ""}
                error={!!errors.apy}
                helperText={errors.apy?.message}
              />
            )}
          />

          {/* 无限期勾选 */}
          <Controller
            name="is_perpetual"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="无限期（永续资产）"
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
                value={field.value ?? ""}
                disabled={isPerpetual}
                error={!!errors.duration_days}
                helperText={
                  isPerpetual ? "已设置为无限期" : errors.duration_days?.message
                }
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
            render={({ field }) => <TextField label="代币符号" {...field} />}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "创建资产"}
          </Button>

          {serverError && <Alert severity="error">{serverError}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </Box>
    </Container>
  );
}
