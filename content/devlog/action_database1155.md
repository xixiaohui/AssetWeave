<!-- 用户表（users） 加入更多用户信息、状态、等级和注册来源-->
<!-- 存储 Web2 用户信息 + 链上钱包地址 -->

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,              -- Web2 登录
    wallet_address TEXT UNIQUE,      -- 链上钱包
    kyc_verified BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'USER',        -- USER / ADMIN / ISSUER
    risk_level INT DEFAULT 0,        -- 风险等级
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

<!-- 资产主表（rwa_assets） 增加资产类型、行业、评级、轮次信息-->
<!-- 存储资产信息和链上 tokenId/合约地址 -->

CREATE TABLE IF NOT EXISTS rwa_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id BIGINT,                  -- ERC1155 tokenId
    contract_address TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT,                        -- REAL_ESTATE / BOND / INFRASTRUCTURE
    industry TEXT,
    rating TEXT,                      -- AAA / BBB 等级
    description TEXT,
    doc_hash TEXT NOT NULL,           -- 文件hash
    price NUMERIC NOT NULL,
    min_raise NUMERIC NOT NULL,
    max_raise NUMERIC NOT NULL,
    total_raised NUMERIC DEFAULT 0,
    deadline TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    current_round INT DEFAULT 1,      -- 多轮认购
    running BOOLEAN DEFAULT FALSE,
    finished BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

<!-- 用户认购表（rwa_subscriptions） 增加轮次、状态、链上交易哈希-->
<!-- 记录用户每次认购金额和 token 数量 -->

CREATE TABLE IF NOT EXISTS rwa_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_id UUID NOT NULL REFERENCES rwa_assets(id),
    round INT DEFAULT 1,
    usdt_amount NUMERIC NOT NULL,
    token_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'SUBSCRIBED', -- SUBSCRIBED / REDEEMED / CANCELLED
    tx_hash TEXT,                     -- 链上认购交易哈希
    subscribed_at TIMESTAMP DEFAULT NOW(),
    redeemed_at TIMESTAMP
);

<!-- 分红表（rwa_dividends）支持多轮注入、分红类型（收益/利息/奖励） -->
<!-- 记录每笔注入利润和用户分红状态 -->

CREATE TABLE IF NOT EXISTS rwa_dividends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES rwa_assets(id),
    round INT DEFAULT 1,
    amount NUMERIC NOT NULL,          -- USDT
    type TEXT DEFAULT 'PROFIT',       -- PROFIT / INTEREST / BONUS
    injected_by UUID REFERENCES users(id),
    tx_hash TEXT,
    injected_at TIMESTAMP DEFAULT NOW()
);

<!-- 用户分红对账表（rwa_dividend_claims） -->

CREATE TABLE IF NOT EXISTS rwa_dividend_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dividend_id UUID NOT NULL REFERENCES rwa_dividends(id),
    user_id UUID NOT NULL REFERENCES users(id),
    claimable_amount NUMERIC NOT NULL,
    claimed_amount NUMERIC DEFAULT 0,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP
);

<!-- 白名单 / KYC 表（rwa_whitelist）可按资产、轮次、用户管理白名单 -->
<!-- 可单独管理链上白名单状态 -->

CREATE TABLE IF NOT EXISTS rwa_whitelist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_id UUID NOT NULL REFERENCES rwa_assets(id),
    round INT DEFAULT 1,
    whitelisted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT NOW()
);

<!-- 钱包交易记录（rwa_wallet_tx） 跟踪用户 USDT 转入/转出，链上同步 -->

CREATE TABLE IF NOT EXISTS rwa_wallet_tx (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_id UUID REFERENCES rwa_assets(id),
    tx_type TEXT NOT NULL,            -- DEPOSIT / SUBSCRIBE / CLAIM / REDEEM
    amount NUMERIC NOT NULL,
    token_amount NUMERIC,
    tx_hash TEXT,
    status TEXT DEFAULT 'PENDING',    -- PENDING / SUCCESS / FAILED
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

<!-- 多轮认购轮次表（optional）管理资产多轮募资计划 -->
CREATE TABLE IF NOT EXISTS rwa_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES rwa_assets(id),
    round_number INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    min_raise NUMERIC,
    max_raise NUMERIC,
    total_raised NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'PENDING',   -- PENDING / RUNNING / FINISHED
    created_at TIMESTAMP DEFAULT NOW()
);

<!-- 审计日志（rwa_audit_logs）记录所有 Web2 操作和链上事件 -->
<!-- 记录 Web2 操作和链上交互状态 -->
CREATE TABLE IF NOT EXISTS rwa_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    asset_id UUID REFERENCES rwa_assets(id),
    action TEXT NOT NULL,           -- REGISTER / SUBSCRIBE / CLAIM / REDEEM / INJECT_PROFIT
    tx_hash TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

<!-- 风险与治理（optional）可加入投票、投票结果、违约记录等 -->

CREATE TABLE IF NOT EXISTS rwa_governance_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES rwa_assets(id),
    user_id UUID NOT NULL REFERENCES users(id),
    proposal TEXT NOT NULL,
    vote BOOLEAN NOT NULL,          -- YES / NO
    voted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rwa_risk_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES rwa_assets(id),
    event_type TEXT NOT NULL,       -- DEFAULT / DELAY / LIQUIDATION
    description TEXT,
    occurred_at TIMESTAMP DEFAULT NOW()
);
