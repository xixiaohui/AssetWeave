① 创建一个发行方 + 投资人
INSERT INTO users (role, email, name)
VALUES
('issuer', 'issuer@test.com', 'Factory A'),
('investor', 'investor@test.com', 'Alice');


② 创建一个资产
INSERT INTO assets (issuer_id, title, description, asset_type, total_value, status)
SELECT id, '500 Tons Glass Fiber Inventory', 'Warehouse inventory', 'inventory', 3000000, 'active'
FROM users WHERE role = 'issuer' LIMIT 1;


③ 把资产拆成 Token

INSERT INTO tokens (asset_id, total_supply, price_per_token)
SELECT id, 10000, 300
FROM assets LIMIT 1;


④ 投资人购买

INSERT INTO purchases (token_id, buyer_id, amount, total_price)
SELECT t.id, u.id, 100, 30000
FROM tokens t, users u
WHERE u.role = 'investor'
LIMIT 1;

⑤ 生成持仓（关键一步）

INSERT INTO token_holders (token_id, user_id, amount)
SELECT token_id, buyer_id, amount
FROM purchases;


⑥ 产生一次收益

INSERT INTO yield_records (asset_id, total_yield, description)
SELECT id, 100000, 'Client payment received'
FROM assets LIMIT 1;

⑦ 分红（RWA 灵魂）

INSERT INTO yield_distributions (yield_id, user_id, amount)
SELECT
  y.id,
  th.user_id,
  (th.amount::numeric / t.total_supply) * y.total_yield
FROM yield_records y
JOIN tokens t ON t.asset_id = y.asset_id
JOIN token_holders th ON th.token_id = t.id;


# 自动持仓触发器 + 自动分红触发器 SQL

触发器一：购买后自动生成 / 更新持仓

① 函数

CREATE OR REPLACE FUNCTION fn_update_token_holder_after_purchase()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO token_holders (token_id, user_id, amount)
  VALUES (NEW.token_id, NEW.buyer_id, NEW.amount)
  ON CONFLICT (token_id, user_id)
  DO UPDATE SET
    amount = token_holders.amount + EXCLUDED.amount,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


② 触发器

CREATE TRIGGER trg_after_purchase_update_holder
AFTER INSERT ON purchases
FOR EACH ROW
EXECUTE FUNCTION fn_update_token_holder_after_purchase();


触发器二：发生交易自动转移持仓（二级市场）



CREATE OR REPLACE FUNCTION fn_update_holders_after_trade()
RETURNS TRIGGER AS $$
BEGIN
  -- 卖家减少
  UPDATE token_holders
  SET amount = amount - NEW.amount,
      updated_at = now()
  WHERE token_id = NEW.token_id
    AND user_id = NEW.seller_id;

  -- 买家增加（不存在则插入）
  INSERT INTO token_holders (token_id, user_id, amount)
  VALUES (NEW.token_id, NEW.buyer_id, NEW.amount)
  ON CONFLICT (token_id, user_id)
  DO UPDATE SET
    amount = token_holders.amount + EXCLUDED.amount,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

② 触发器

CREATE TRIGGER trg_after_trade_update_holders
AFTER INSERT ON trades
FOR EACH ROW
EXECUTE FUNCTION fn_update_holders_after_trade();


触发器三：新增收益时自动完成分红（RWA 灵魂）

目标：
yield_records 一插入
自动按持仓比例计算 yield_distributions

CREATE OR REPLACE FUNCTION fn_auto_yield_distribution()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO yield_distributions (yield_id, user_id, amount)
  SELECT
    NEW.id,
    th.user_id,
    (th.amount::numeric / t.total_supply) * NEW.total_yield
  FROM tokens t
  JOIN token_holders th ON th.token_id = t.id
  WHERE t.asset_id = NEW.asset_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

② 触发器

CREATE TRIGGER trg_after_yield_auto_distribution
AFTER INSERT ON yield_records
FOR EACH ROW
EXECUTE FUNCTION fn_auto_yield_distribution();




-----------
# 数据库插入一条收益：
INSERT INTO yield_records (asset_id, total_yield, description)
SELECT id, 50000, 'Client payment second batch'
FROM assets
LIMIT 1;


-----------------
#验证码表
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  used BOOLEAN DEFAULT FALSE
);



-------------------------------------RWA需要这六张表

% # rwa_assets（资产主表）
DROP TABLE IF EXISTS rwa_assets;

CREATE TABLE rwa_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 链上锚点
  asset_id TEXT UNIQUE NOT NULL,
  doc_hash TEXT NOT NULL,

  -- 展示信息
  name TEXT NOT NULL,
  description TEXT,

  -- 融资核心参数
  total_raise NUMERIC NOT NULL,      -- 募资总额 (USDT)
  price NUMERIC NOT NULL,            -- 单价
  raise_days INT NOT NULL,           -- 募集天数
  duration_days INT NOT NULL,        -- 运行天数

  -- 融资过程数据（动态）
  raised_amount NUMERIC DEFAULT 0,   -- 已募金额
  investor_count INT DEFAULT 0,

  -- 状态机（非常关键）
  status TEXT NOT NULL DEFAULT 'RAISING',
  -- RAISING / TOKENIZED / RUNNING / FINISHED

  created_at TIMESTAMP DEFAULT NOW()
);

% #（Token 化记录）
CREATE TABLE IF NOT EXISTS rwa_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,

  tx_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

% rwa_investors（投资人）

CREATE TABLE IF NOT EXISTS rwa_investors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  wallet TEXT UNIQUE NOT NULL,
  name TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

% rwa_sales（融资销售记录 ⭐）

CREATE TABLE IF NOT EXISTS rwa_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  investor_wallet TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,

  tx_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

% rwa_profit_batches（分红批次 ⭐）

CREATE TABLE IF NOT EXISTS rwa_profit_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  eth_amount NUMERIC NOT NULL,
  tx_hash TEXT NOT NULL,

  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

% rwa_contracts（合约配置）
CREATE TABLE IF NOT EXISTS rwa_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT,
  address TEXT NOT NULL,
  network TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

% 自动累计发行量触发器

CREATE OR REPLACE FUNCTION update_asset_total_issued()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE rwa_assets
  SET total_issued = total_issued + NEW.amount
  WHERE asset_id = NEW.asset_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_asset_total
AFTER INSERT ON rwa_issues
FOR EACH ROW
EXECUTE FUNCTION update_asset_total_issued();


% 认购台账（真实钱在这里对账）
% 这张表的地位是：
% 钱从哪来
% 谁买了多少
% 后面给谁发多少 Token
% 清算时给谁销毁多少
% 全靠它。
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID NOT NULL,
  asset_id TEXT NOT NULL,

  usdt_amount NUMERIC NOT NULL,     -- 用户认购金额
  token_amount NUMERIC NOT NULL,    -- 应得 token（= usdt / price）

  wallet_address TEXT NOT NULL,     -- 发 Token 用（关键）

  status TEXT NOT NULL DEFAULT 'PENDING',
  -- PENDING / CONFIRMED / TOKEN_SENT / FINISHED

  created_at TIMESTAMP DEFAULT NOW()
);

% 用户表（必须）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  wallet_address TEXT UNIQUE NOT NULL,
  kyc_status TEXT DEFAULT 'PENDING', -- PENDING / APPROVED / REJECTED
  created_at TIMESTAMP DEFAULT NOW()
);

% 资金到账记录表（很多人漏掉的致命表）
CREATE TABLE deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID,
  asset_id TEXT,

  tx_hash TEXT UNIQUE NOT NULL,
  from_address TEXT,
  amount NUMERIC,

  confirmed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW()
);

% Token 发放记录（审计命根子）
% 谁在什么时候给谁发了多少 Token
CREATE TABLE token_mints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT,
  user_id UUID,

  wallet_address TEXT,
  amount NUMERIC,

  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

% 分红批次表（核心）
CREATE TABLE dividend_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT,
  total_amount NUMERIC,

  created_at TIMESTAMP DEFAULT NOW()
);

% 分红明细表（按人头算钱）
CREATE TABLE dividend_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  batch_id UUID,
  user_id UUID,
  wallet_address TEXT,

  amount NUMERIC,
  tx_hash TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

% 清算 / 销毁记录表
CREATE TABLE liquidations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT,
  user_id UUID,

  wallet_address TEXT,
  token_amount NUMERIC,

  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

% 操作审计日志（律师最爱）
% 发布资产
% 开募
% 发 Token
% 分红
% 清算
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  action TEXT,
  operator TEXT,
  payload JSONB,

  created_at TIMESTAMP DEFAULT NOW()
);
