// components/home/OnChainStats.tsx
"use client";
import { Box, Grid, Card, Typography } from "@mui/material";
import CountUp from "react-countup";

const stats = [
  { label: "总募集资金", value: "12500000" ,suffix: "￥"},
  { label: "分红池金额", value: "1240000" ,suffix: "￥"},
  { label: "平均收益率", value: "8.7",suffix: "%",},
  { label: "活跃项目数", value: "18" ,suffix: "",},
];

export default function OnChainStats() {
  return (
    <Box sx={{ py: 12, bgcolor: "#0b1020", color: "#fff" }}>
      <Grid container spacing={4} justifyContent="center">
        {stats.map((s, i) => (
          <Grid key={i} size={{ xs: 12, md: 3 }}>
            <Card sx={{ p: 6, textAlign: "center", bgcolor: "#121833",color: "#fff" }}>
              <Typography variant="h3" fontWeight={700}>

                <CountUp
                  start={0}
                  end={Number(s.value)}
                  duration={2.5}
                  separator=","
                  decimals={s.suffix === "%" ? 1 : 0}
                />
                {s.suffix}
              </Typography>
              <Typography sx={{ opacity: 0.7 }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
