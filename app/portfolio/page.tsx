// 我的持仓


// app/portfolio/page.tsx

import pool from "@/lib/db";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Divider,
} from "@mui/material";

export default async function PortfolioPage() {
  const investorId = "97129f62-117a-4715-a8e5-fb7310cb194e";

  const { rows } = await pool.query(
    `
    SELECT
      a.title,
      a.asset_type,
      th.amount,
      t.price_per_token,
      (th.amount * t.price_per_token) AS current_value
    FROM token_holders th
    JOIN tokens t ON th.token_id = t.id
    JOIN assets a ON t.asset_id = a.id
    WHERE th.user_id = $1
  `,
    [investorId]
  );

  const totalValue = rows.reduce(
    (sum, r) => sum + Number(r.current_value),
    0
  );

  return (
    <Box sx={{ p: 8 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={700}>
            My Portfolio
          </Typography>
          <Typography color="text.secondary">
            Overview of your tokenized real-world asset holdings
          </Typography>
        </Box>

        {/* Total Value Card */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Total Portfolio Value
            </Typography>
            <Typography variant="h3" fontWeight={700} mt={1}>
              ¥{totalValue.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Asset Cards */}
        <Grid container spacing={3}>
          {rows.map((r, i) => (
            <Grid key={i} size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600}>
                      {r.title}
                    </Typography>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        Asset Type
                      </Typography>
                      <Typography>{r.asset_type}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        Shares Held
                      </Typography>
                      <Typography>{r.amount}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        Price per Share
                      </Typography>
                      <Typography>
                        ¥{Number(r.price_per_token).toLocaleString()}
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={600}>
                        Current Value
                      </Typography>
                      <Typography fontWeight={700}>
                        ¥{Number(r.current_value).toLocaleString()}
                      </Typography>
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
