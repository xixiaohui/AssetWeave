
① 用户表（投资人 / 资产方）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('investor', 'issuer', 'admin')),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

② 现实资产表（核心）
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer_id UUID REFERENCES users(id),

  title TEXT NOT NULL,
  description TEXT,

  asset_type TEXT, -- inventory / receivable / real_estate / energy / etc
  total_value NUMERIC(20,2) NOT NULL,  -- 资产总估值
  currency TEXT DEFAULT 'CNY',

  status TEXT DEFAULT 'draft',
  -- draft / auditing / active / closed

  created_at TIMESTAMPTZ DEFAULT now()
);

③ 资产证明材料（法律/审计关键）
CREATE TABLE asset_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,

  doc_type TEXT, -- contract / invoice / photo / audit_report
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

④ 资产评估 / 审计记录
CREATE TABLE asset_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,

  valuation_amount NUMERIC(20,2),
  auditor_name TEXT,
  report TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

⑤ Token 表（资产拆分的份额）
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,

  total_supply INTEGER NOT NULL,     -- 总份额
  price_per_token NUMERIC(20,2),    -- 每份价格

  created_at TIMESTAMPTZ DEFAULT now()
);

⑥ 持有人表（谁持有多少份额）🔥核心
CREATE TABLE token_holders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),

  amount INTEGER NOT NULL,  -- 持有份额
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(token_id, user_id)
);

⑦ 购买记录（一级市场）
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES tokens(id),
  buyer_id UUID REFERENCES users(id),

  amount INTEGER,
  total_price NUMERIC(20,2),

  created_at TIMESTAMPTZ DEFAULT now()
);

⑧ 交易记录（二级市场）
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  token_id UUID REFERENCES tokens(id),
  seller_id UUID REFERENCES users(id),
  buyer_id UUID REFERENCES users(id),

  amount INTEGER,
  price NUMERIC(20,2),

  traded_at TIMESTAMPTZ DEFAULT now()
);

⑨ 收益记录（分红引擎）
CREATE TABLE yield_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id),

  total_yield NUMERIC(20,2),  -- 本次总收益
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

⑩ 分红明细（自动算出来发给谁）
CREATE TABLE yield_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  yield_id UUID REFERENCES yield_records(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),

  amount NUMERIC(20,2),
  distributed_at TIMESTAMPTZ DEFAULT now()
);

⑪ 关键索引（必须加）
CREATE INDEX idx_assets_issuer ON assets(issuer_id);
CREATE INDEX idx_tokens_asset ON tokens(asset_id);
CREATE INDEX idx_holders_user ON token_holders(user_id);
CREATE INDEX idx_trades_token ON trades(token_id);
CREATE INDEX idx_yield_asset ON yield_records(asset_id);


✅ 资产发行系统
✅ 资产证明/审计系统
✅ 份额拆分系统
✅ 投资购买系统
✅ 二级交易市场
✅ 分红系统

ALTER TABLE asset_documents     OWNER TO assetweave;
ALTER TABLE asset_valuations    OWNER TO assetweave;
ALTER TABLE assets              OWNER TO assetweave;
ALTER TABLE purchases           OWNER TO assetweave;
ALTER TABLE token_holders       OWNER TO assetweave;
ALTER TABLE tokens              OWNER TO assetweave;
ALTER TABLE trades              OWNER TO assetweave;
ALTER TABLE users               OWNER TO assetweave;
ALTER TABLE yield_distributions OWNER TO assetweave;
ALTER TABLE yield_records       OWNER TO assetweave;