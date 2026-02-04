// 发行后台

"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Grid
} from "@mui/material";
import { useState } from "react";

export default function IssueAssetPage() {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    value: "",
    supply: "",
    price: "",
  });

  const submit = async () => {
    await fetch("/api/assets", {
      method: "POST",
      body: JSON.stringify(form),
    });
    alert("Asset Issued");
  };

  return (
    <Box sx={{ p: 8, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: 920 }}>
        <CardContent>
          <Stack spacing={5}>
            <Typography variant="h4" fontWeight={700}>
              Issue New Asset
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Asset Title"
                  fullWidth
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  onChange={(e) =>
                    setForm({ ...form, desc: e.target.value })
                  }
                />
              </Grid>

              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Total Value ($)"
                  type="number"
                  fullWidth
                  onChange={(e) =>
                    setForm({ ...form, value: e.target.value })
                  }
                />
              </Grid>

              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Total Shares"
                  type="number"
                  fullWidth
                  onChange={(e) =>
                    setForm({ ...form, supply: e.target.value })
                  }
                />
              </Grid>

              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Price per Share ($)"
                  type="number"
                  fullWidth
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              size="large"
              onClick={submit}
              sx={{ height: 56 }}
            >
              Issue Asset
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
