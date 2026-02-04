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
    [investorId]
  );

  return (
    <Box sx={{ p: 8 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Portfolio
      </Typography>
      <Grid container spacing={3}>
        {rows.map((r: any, i: number) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={600}>{r.title}</Typography>
                  <Typography>Type: {r.asset_type}</Typography>
                  <Typography>Shares: {r.amount}</Typography>
                  <Typography>Price: ¥{r.price_per_token}</Typography>
                  <Typography fontWeight={700}>Current Value: ¥{r.current_value}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
