/* eslint-disable @typescript-eslint/no-explicit-any */
// 资产市场

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
} from "@mui/material";

interface Asset {
  id: string;
  title: string;
  asset_type: string;
  total_value: number;
  price_per_token: number;
  total_supply: number;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    fetch("/api/assets")
      .then((res) => res.json())
      .then(setAssets);
  }, []);

  return (
    <Box sx={{ p: 8 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Assets Market
          </Typography>
          <Typography color="text.secondary">
            Browse tokenized real-world assets available for investment
          </Typography>
        </Box>

        {/* Assets Grid */}
        <Grid container spacing={3}>
          {assets.map((a) => (
            <Grid key={a.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Link href={`/assets/${a.id}`} style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={600}>
                        {a.title}
                      </Typography>

                      <Divider />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography color="text.secondary">
                          Asset Type
                        </Typography>
                        <Typography>{a.asset_type}</Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography color="text.secondary">
                          Total Value
                        </Typography>
                        <Typography>
                          ¥{Number(a.total_value).toLocaleString()}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography color="text.secondary">
                          Price / Share
                        </Typography>
                        <Typography>
                          ¥{Number(a.price_per_token).toLocaleString()}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography color="text.secondary">
                          Total Shares
                        </Typography>
                        <Typography>{a.total_supply}</Typography>
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
