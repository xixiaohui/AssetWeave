/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from "@/lib/db";
import { Box, Card, CardContent, Typography, Stack, Grid, Divider } from "@mui/material";

export default async function YieldsPage() {
  const { rows: [user] } = await pool.query(`SELECT id FROM users WHERE email = 'investor@test.com'`);
  const investorId = user.id;

  const { rows } = await pool.query(
    `
    SELECT a.title, yd.amount, yr.description, yd.distributed_at
    FROM yield_distributions yd
    JOIN yield_records yr ON yd.yield_id = yr.id
    JOIN assets a ON yr.asset_id = a.id
    WHERE yd.user_id = $1
    ORDER BY yd.distributed_at DESC
  `,
    [investorId]
  );

  const totalYields = rows.reduce((sum, r: any) => sum + Number(r.amount), 0);

  return (
    <Box sx={{ p: 8 }}>
      <Stack spacing={6}>
        <Typography variant="h4" fontWeight={700}>
          My Yields
        </Typography>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography color="text.secondary">Total Dividends Received</Typography>
            <Typography variant="h3" fontWeight={700}>¥{totalYields.toLocaleString()}</Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {rows.map((r: any, i: number) => (
            <Grid key={i} size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600}>{r.title}</Typography>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Yield</Typography>
                      <Typography>¥{Number(r.amount).toLocaleString()}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Source</Typography>
                      <Typography>{r.description}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Date</Typography>
                      <Typography>{new Date(r.distributed_at).toLocaleString()}</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
