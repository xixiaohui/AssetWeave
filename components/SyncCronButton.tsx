/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function SyncCronButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const runSync = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/cron/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer 8sk29dj3k2js9xw92jsk77`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sync failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <Card sx={{ borderRadius: 4, maxWidth: 500 ,mx: "auto"}}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            同步区块链数据
          </Typography>

          <Button
            variant="contained"
            onClick={runSync}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? "Syncing..." : "Run Sync"}
          </Button>

          {error && <Alert severity="error">{error}</Alert>}

          {result && (
            <Alert severity="success">
              Synced blocks {result.fromBlock} → {result.toBlock} <br />
              Events: {result.eventsFound} <br />
              CurrentBlock: {result.currentBlock}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}