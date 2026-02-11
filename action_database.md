DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE tableowner = 'postgres'
      AND schemaname = 'public'
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I OWNER TO assetweave;',
      r.schemaname,
      r.tablename
    );
  END LOOP;
END $$;

<!-- 1. 用户表（KYC + 钱包） -->
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  email TEXT UNIQUE,
  wallet_address TEXT UNIQUE NOT NULL,

  kyc_status TEXT DEFAULT 'PENDING', -- PENDING / APPROVED / REJECTED
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_wallet ON users(wallet_address);

<!-- 2. 资产主表 -->
CREATE TABLE rwa_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  doc_hash TEXT NOT NULL,

  total_issued NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);


<!-- 3. 资金到账记录（链上监听写入） -->
CREATE TABLE deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES users(id),
  asset_id TEXT REFERENCES rwa_assets(asset_id),

  tx_hash TEXT UNIQUE NOT NULL,
  from_address TEXT,
  amount NUMERIC NOT NULL,

  confirmed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deposits_user ON deposits(user_id);
CREATE INDEX idx_deposits_asset ON deposits(asset_id);


<!-- 4. 认购台账 -->

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES users(id),
  asset_id TEXT REFERENCES rwa_assets(asset_id),

  deposit_id UUID REFERENCES deposits(id),

  amount NUMERIC NOT NULL,
  token_amount NUMERIC,

  status TEXT DEFAULT 'PENDING', -- PENDING / MINTED

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sub_user ON subscriptions(user_id);
CREATE INDEX idx_sub_asset ON subscriptions(asset_id);

<!-- 5. Token 发放记录（极其关键） -->
CREATE TABLE token_mints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT REFERENCES rwa_assets(asset_id),
  user_id UUID REFERENCES users(id),

  wallet_address TEXT,
  amount NUMERIC NOT NULL,

  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mint_user ON token_mints(user_id);

<!-- 6. 分红批次 -->
CREATE TABLE dividend_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT REFERENCES rwa_assets(asset_id),
  total_amount NUMERIC NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);


<!-- 7. 分红明细（按用户） -->
CREATE TABLE dividend_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  batch_id UUID REFERENCES dividend_batches(id),
  user_id UUID REFERENCES users(id),

  wallet_address TEXT,
  amount NUMERIC NOT NULL,

  tx_hash TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_div_user ON dividend_distributions(user_id);

<!-- 8. 清算 / 销毁记录 -->
CREATE TABLE liquidations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT REFERENCES rwa_assets(asset_id),
  user_id UUID REFERENCES users(id),

  wallet_address TEXT,
  token_amount NUMERIC NOT NULL,

  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

<!-- 9. 全链路审计日志（律师 & 审计最爱） -->
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  action TEXT NOT NULL,
  operator TEXT,
  payload JSONB,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_action ON audit_logs(action);
