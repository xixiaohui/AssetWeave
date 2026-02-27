"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Divider,
  Button,
} from "@mui/material";


export interface Asset {
  id: string;
  name: string;
  category: string;

  cover_url?: string;

  price: number; // 单份价格
  max_raise: number; // 募资目标
  total_raised: number; // 已募集金额
  progress_percent: number;

  apy?: number; // 年化收益
  duration_days: number; // 投资周期

  token_symbol?: string;

  status: string;
  created_at: string;
}

export function AssetsHeader() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h2" fontWeight={600}>
        资产市场
      </Typography>

      <Button
        component={Link}
        href="/assets/create"
        variant="contained"
        color="primary"
      >
        创建资产
      </Button>
    </Stack>
  );
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    fetch("/api/assets")
      .then((res) => res.json())
      .then(setAssets);
  }, []);

  return (
    <Box sx={{ p: 8, mt: 7 }}>
      <Stack spacing={6}>
        <AssetsHeader></AssetsHeader>

        <Grid container spacing={3}>
          {assets.map((a) => (
            <Grid key={a.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Link href={`/assets/${a.id}`} style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    transition: "0.2s",
                    backgroundColor:"#def8b3",
                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={600}>
                        {a.name}
                      </Typography>

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Category</Typography>
                        <Typography>{a.category}</Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">
                          Target Raise
                        </Typography>
                        <Typography>
                          ¥{Number(a.max_raise).toLocaleString()}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Raised</Typography>
                        <Typography>
                          ¥{Number(a.total_raised).toLocaleString()}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">
                          Price / Share
                        </Typography>
                        <Typography>
                          ¥{Number(a.price).toLocaleString()}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">APY</Typography>
                        <Typography color="primary" fontWeight={600}>
                          {a.apy ?? "--"}%
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Duration</Typography>
                        <Typography>{a.duration_days} days</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
