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
CREATE TABLE IF NOT EXISTS rwa_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  asset_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  doc_hash TEXT NOT NULL,

  total_issued NUMERIC DEFAULT 0,
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



