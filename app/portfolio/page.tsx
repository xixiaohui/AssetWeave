/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { Box, Card, CardContent, Typography, Stack, Grid } from "@mui/material";

export default async function PortfolioPage() {
  const investorId = "97129f62-117a-4715-a8e5-fb7310cb194e";

  const { rows } = await pool.query(
    `
    SELECT a.title, a.asset_type, th.amount, t.price_per_token, (th.amount * t.price_per_token) AS current_value
    FROM token_holders th
    JOIN tokens t ON th.token_id = t.id
    JOIN assets a ON t.asset_id = a.id
    WHERE th.user_id = $1
  `,
    [investorId],
  );

  return (
    <Box sx={{ p: 8, mt: 7 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        我的持仓
      </Typography>

      <Grid container spacing={3}>
        {rows.map((r: any, i: number) => {
          // 如果字段名不匹配，可以在这里映射
          const name = r.name || r.title || "未知资产";
          const type = r.asset_type || r.category || "未知类型";
          const amount = r.amount || r.shares || 0;
          const price = r.price_per_token || r.price || 0;
          const currentValue = r.current_value || r.total_value || 0;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {name}
                    </Typography>
                    <Typography color="text.secondary">类型: {type}</Typography>
                    <Typography color="text.secondary">
                      份额: {amount}
                    </Typography>
                    <Typography color="text.secondary">
                      单份价格: ¥{Number(price).toLocaleString()}
                    </Typography>
                    <Typography fontWeight={700}>
                      当前价值: ¥{Number(currentValue).toLocaleString()}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
