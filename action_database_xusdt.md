<!-- -- 投资人用 XUSDT 购买 RWA Token 的记录 -->
CREATE TABLE IF NOT EXISTS rwa_sales (
  id SERIAL PRIMARY KEY,
  asset_id TEXT NOT NULL,
  investor TEXT NOT NULL,
  amount NUMERIC NOT NULL,       -- RWA Token 数量
  price NUMERIC NOT NULL,        -- 支付的 XUSDT 数量
  tx_hash_rwa TEXT NOT NULL,
  tx_hash_xusdt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE xusdt_distribution (
  id SERIAL PRIMARY KEY,
  investor TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);