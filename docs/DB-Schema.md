# 数据库设计文档

> 版本:v1.0  
> 说明:基于已有用户体系扩展,只列**会员体系新增/调整**的表。  
> 数据库:MySQL 8.0(与现有后端一致,假设;如为 PostgreSQL 语法需微调)

---

## 一、ER 图(逻辑关系)

```
┌──────────────────┐      ┌──────────────────────┐
│  用户表(已有)    │──┬──>│ member_profile       │  会员扩展档案
│  user            │  │   │ (等级、积分余额快照) │
└──────────────────┘  │   └──────────────────────┘
                      │
                      │   ┌──────────────────────┐
                      ├──>│ coin_transaction     │  积分流水
                      │   │ (收入/支出/过期)      │
                      │   └──────────────────────┘
                      │
                      │   ┌──────────────────────┐
                      ├──>│ coin_dedup           │  积分去重记录
                      │   │ (用户×车辆×行为)      │
                      │   └──────────────────────┘
                      │
                      │   ┌──────────────────────┐
                      ├──>│ level_history        │  等级变更历史
                      │   │ (每月重算留痕)        │
                      │   └──────────────────────┘
                      │
                      │   ┌──────────────────────┐
                      └──>│ reward_redemption    │  权益兑换记录
                          └──────────────────────┘

┌──────────────────────┐
│ level_rule           │  等级规则配置
└──────────────────────┘

┌──────────────────────┐
│ coin_rule            │  积分规则配置
└──────────────────────┘

┌──────────────────────┐
│ reward_card          │  权益卡目录
└──────────────────────┘
```

---

## 二、表结构定义

### 2.1 `member_profile` —— 会员扩展档案

存储每个用户的会员元数据。与 `user` 表 1:1。

| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | BIGINT | PK,关联 user.id |
| current_level | TINYINT | 当前等级(0/1/2/3) |
| level_updated_at | DATETIME | 上次等级变更时间 |
| coin_balance | BIGINT | 积分余额(冗余字段,实时维护) |
| lifetime_coin_earned | BIGINT | 历史累计获得积分 |
| lifetime_coin_spent | BIGINT | 历史累计消耗积分 |
| last_settled_at | DATETIME | 上次月度结算时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

```sql
CREATE TABLE member_profile (
  user_id            BIGINT      PRIMARY KEY,
  current_level      TINYINT     NOT NULL DEFAULT 0,
  level_updated_at   DATETIME    NULL,
  coin_balance       BIGINT      NOT NULL DEFAULT 0,
  lifetime_coin_earned BIGINT    NOT NULL DEFAULT 0,
  lifetime_coin_spent  BIGINT    NOT NULL DEFAULT 0,
  last_settled_at    DATETIME    NULL,
  created_at         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_level (current_level)
) COMMENT='会员扩展档案';
```

---

### 2.2 `coin_transaction` —— 积分流水

**核心表**。所有积分的收入、支出、过期、冻结都记录在此。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | PK |
| user_id | BIGINT | 用户 ID |
| type | VARCHAR(20) | 类型:EARN_BID / EARN_SHARE / EARN_DEAL / SPEND_REDEEM / EXPIRE / ADJUST |
| amount | INT | 积分数(正数=增,负数=减) |
| balance_after | BIGINT | 交易后余额(便于审计) |
| ref_type | VARCHAR(20) | 关联业务类型:CAR / ORDER / REWARD / NULL |
| ref_id | BIGINT | 关联业务 ID(车辆 ID / 订单 ID / 权益兑换 ID) |
| expire_at | DATETIME | 该笔积分过期时间(仅 EARN 类型有值) |
| remaining | INT | 剩余未消耗积分数(FIFO 过期计算用) |
| remark | VARCHAR(255) | 备注(如"成交 #车源编号" "权益兑换 #卡名") |
| created_at | DATETIME | 创建时间 |

```sql
CREATE TABLE coin_transaction (
  id             BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id        BIGINT      NOT NULL,
  type           VARCHAR(20) NOT NULL,
  amount         INT         NOT NULL,
  balance_after  BIGINT      NOT NULL,
  ref_type       VARCHAR(20) NULL,
  ref_id         BIGINT      NULL,
  expire_at      DATETIME    NULL,
  remaining      INT         NULL,
  remark         VARCHAR(255) NULL,
  created_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_created (user_id, created_at DESC),
  INDEX idx_expire (expire_at, remaining),
  INDEX idx_ref (ref_type, ref_id)
) COMMENT='积分流水';
```

**`type` 枚举说明**:

| type | 含义 | amount 符号 |
|------|------|------------|
| EARN_BID | 出价奖励 | + |
| EARN_SHARE | 转发奖励 | + |
| EARN_DEAL | 成交奖励 | + |
| SPEND_REDEEM | 兑换权益卡消耗 | - |
| EXPIRE | 过期清零 | - |
| ADJUST | 运营手动调整 | ± |

**FIFO 过期逻辑**:EARN 流水记录 `remaining`,消耗或过期时按**获得时间倒序**扣减。

---

### 2.3 `coin_dedup` —— 积分去重记录

存储出价/转发的去重键,防止重复发积分。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | PK |
| user_id | BIGINT | 用户 ID |
| action | VARCHAR(10) | BID / SHARE |
| car_id | BIGINT | 车辆 ID |
| coin_transaction_id | BIGINT | 关联的流水 ID |
| created_at | DATETIME | 首次触发时间 |

```sql
CREATE TABLE coin_dedup (
  id                  BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id             BIGINT      NOT NULL,
  action              VARCHAR(10) NOT NULL,
  car_id              BIGINT      NOT NULL,
  coin_transaction_id BIGINT      NOT NULL,
  created_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_dedup (user_id, action, car_id)
) COMMENT='积分去重';
```

**关键设计**:`UNIQUE KEY (user_id, action, car_id)` 是防重复发放的核心,由 DB 保证原子性。

---

### 2.4 `level_history` —— 等级变更历史

每次月度结算都写一条记录,便于审计和商户查询。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | PK |
| user_id | BIGINT | 用户 ID |
| settle_month | CHAR(7) | 结算月(YYYY-MM) |
| window_start | DATE | 统计窗口起始日 |
| window_end | DATE | 统计窗口结束日 |
| deal_count | INT | 窗口内成交台数 |
| previous_level | TINYINT | 变更前等级 |
| new_level | TINYINT | 变更后等级 |
| change_type | VARCHAR(10) | UPGRADE / DOWNGRADE / KEEP |
| created_at | DATETIME | 记录时间 |

```sql
CREATE TABLE level_history (
  id                BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id           BIGINT      NOT NULL,
  settle_month      CHAR(7)     NOT NULL,
  window_start      DATE        NOT NULL,
  window_end        DATE        NOT NULL,
  deal_count        INT         NOT NULL,
  previous_level    TINYINT     NOT NULL,
  new_level         TINYINT     NOT NULL,
  change_type       VARCHAR(10) NOT NULL,
  created_at        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_month (user_id, settle_month),
  INDEX idx_settle_month (settle_month),
  INDEX idx_change_type (change_type)
) COMMENT='等级变更历史';
```

---

### 2.5 `reward_card` —— 权益卡目录

运营在后台配置的权益卡目录。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | PK |
| code | VARCHAR(50) | 权益卡编码(如 CAR_BID_PRICE_QUERY) |
| name | VARCHAR(100) | 卡名 |
| category | VARCHAR(20) | QUERY / DISCOUNT / QUOTA / SERVICE |
| coin_price | INT | 兑换所需积分(0 表示等级直达,无需兑换) |
| min_level | TINYINT | 最低可享/可兑换等级 |
| grant_type | VARCHAR(10) | REDEEM(积分兑换)/ AUTO(等级直达) |
| stock | INT | 库存(-1 = 无限,等级直达类填 -1) |
| redeemed_count | INT | 已兑换数量 |
| validity_days | INT | 兑换后有效期天数 |
| description | TEXT | 使用说明 |
| status | VARCHAR(10) | ONLINE / OFFLINE |
| sort_order | INT | 排序 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

```sql
CREATE TABLE reward_card (
  id              BIGINT      PRIMARY KEY AUTO_INCREMENT,
  code            VARCHAR(50) NOT NULL UNIQUE,
  name            VARCHAR(100) NOT NULL,
  category        VARCHAR(20) NOT NULL,
  coin_price      INT         NOT NULL DEFAULT 0,
  min_level       TINYINT     NOT NULL DEFAULT 0,
  grant_type      VARCHAR(10) NOT NULL DEFAULT 'REDEEM',
  stock           INT         NOT NULL DEFAULT -1,
  redeemed_count  INT         NOT NULL DEFAULT 0,
  validity_days   INT         NOT NULL DEFAULT 30,
  description     TEXT        NULL,
  status          VARCHAR(10) NOT NULL DEFAULT 'ONLINE',
  sort_order      INT         NOT NULL DEFAULT 0,
  created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_category (status, category),
  INDEX idx_grant_type (grant_type)
) COMMENT='权益卡目录(含积分兑换型 + 等级直达型)';
```

---

### 2.6 `reward_redemption` —— 权益兑换记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | PK |
| user_id | BIGINT | 用户 ID |
| reward_card_id | BIGINT | 权益卡 ID |
| coin_cost | INT | 消耗积分数(快照) |
| expire_at | DATETIME | 权益过期时间 |
| status | VARCHAR(10) | ACTIVE / USED / EXPIRED / INVALID |
| used_at | DATETIME | 使用时间 |
| invalidated_reason | VARCHAR(100) | 失效原因(如"商户降级") |
| created_at | DATETIME | 兑换时间 |

```sql
CREATE TABLE reward_redemption (
  id                 BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id            BIGINT      NOT NULL,
  reward_card_id     BIGINT      NOT NULL,
  coin_cost          INT         NOT NULL,
  expire_at          DATETIME    NOT NULL,
  status             VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  used_at            DATETIME    NULL,
  invalidated_reason VARCHAR(100) NULL,
  created_at         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_status (user_id, status),
  INDEX idx_expire (expire_at, status)
) COMMENT='权益卡兑换记录';
```

---

### 2.7 `level_rule` —— 等级规则配置

| 字段 | 类型 | 说明 |
|------|------|------|
| level | TINYINT | PK,等级 0/1/2/3 |
| name | VARCHAR(50) | 名称(V0/V1/V2/V3) |
| min_deal_count | INT | 近 3 月最低成交台数 |
| window_months | TINYINT | 统计窗口(月),默认 3 |
| effective_at | DATETIME | 规则生效时间 |

```sql
CREATE TABLE level_rule (
  level          TINYINT     PRIMARY KEY,
  name           VARCHAR(50) NOT NULL,
  min_deal_count INT         NOT NULL,
  window_months  TINYINT     NOT NULL DEFAULT 3,
  effective_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT='等级规则';

-- 初始化数据
INSERT INTO level_rule (level, name, min_deal_count) VALUES
  (0, 'V0', 0),
  (1, 'V1', 3),
  (2, 'V2', 10),
  (3, 'V3', 30);
```

> v1.1 起取消钻石,无需额外子等级配置。

---

### 2.8 `coin_rule` —— 积分规则配置

单行配置表,存运营可调的全局参数。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TINYINT | PK,固定为 1 |
| bid_coin | INT | 出价积分(默认 1) |
| share_coin | INT | 转发积分(默认 2) |
| deal_coin | INT | 成交积分(默认 50) |
| share_daily_limit | INT | 转发每日上限(次数) |
| share_total_limit | INT | 转发总量上限(次数) |
| coin_validity_months | INT | 积分有效期(月,默认 12) |
| updated_by | VARCHAR(50) | 最后修改人 |
| updated_at | DATETIME | 最后修改时间 |

```sql
CREATE TABLE coin_rule (
  id                   TINYINT     PRIMARY KEY,
  bid_coin             INT         NOT NULL DEFAULT 1,
  share_coin           INT         NOT NULL DEFAULT 2,
  deal_coin            INT         NOT NULL DEFAULT 50,
  share_daily_limit    INT         NOT NULL DEFAULT 20,
  share_total_limit    INT         NOT NULL DEFAULT 9999,
  coin_validity_months INT         NOT NULL DEFAULT 12,
  updated_by           VARCHAR(50) NULL,
  updated_at           DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='积分规则(单行配置)';

INSERT INTO coin_rule (id) VALUES (1);
```

---

## 三、关键逻辑说明

### 3.1 积分发放(伪代码)

```pseudo
function grantCoin(userId, action, carId):
    if action in [BID, SHARE]:
        // 依赖唯一键防重
        try insert coin_dedup(userId, action, carId)
        catch DuplicateKey:
            return "已发放,跳过"
    
    if action == SHARE:
        checkDailyLimit(userId)   # 查 coin_transaction 当日 SHARE 次数
        checkTotalLimit(userId)   # 查历史 SHARE 次数
    
    amount = getCoinAmount(action)  # 从 coin_rule 读
    expireAt = currentDate + N months
    
    // 事务:
    BEGIN
      insert coin_transaction (...)
      update member_profile.coin_balance += amount
    COMMIT
```

### 3.2 积分消耗(FIFO 过期)

```pseudo
function spendCoin(userId, amount, refInfo):
    if member_profile.coin_balance < amount:
        return "余额不足"
    
    BEGIN
      need = amount
      // 按 created_at 升序,优先消耗老的
      for row in coin_transaction where user_id=? and type like 'EARN_%' and remaining > 0 order by created_at:
          use = min(need, row.remaining)
          row.remaining -= use
          update row
          need -= use
          if need == 0: break
      
      insert coin_transaction(type='SPEND_REDEEM', amount=-amount, ...)
      update member_profile.coin_balance -= amount
    COMMIT
```

### 3.3 积分过期(每日定时任务)

```pseudo
function expireCoins():
    now = today
    rows = select * from coin_transaction
           where type like 'EARN_%' and remaining > 0 and expire_at < now
    
    for row in rows:
        expire_amount = row.remaining
        BEGIN
          insert coin_transaction(type='EXPIRE', amount=-expire_amount, ref_id=row.id)
          row.remaining = 0
          update row
          update member_profile.coin_balance -= expire_amount
        COMMIT
```

### 3.4 月度等级重算(每月 1 号 01:00 跑一次)

```pseudo
function monthlyLevelSettle():
    settleMonth = lastMonth           # 结算上月
    windowStart = settleMonth - 2M
    windowEnd = settleMonth
    
    for user in allUsers:
        dealCount = count(成交表 where user=? and time in [windowStart, windowEnd] and status='COMPLETED')
        newLevel = calcLevel(dealCount)   # 按 level_rule 匹配
        
        if user.current_level != newLevel:
            insert level_history(...)
            update member_profile.current_level = newLevel
            if newLevel < previousLevel:
                invalidateUnusedRewardCards(user, newLevel)
    
```

> 备注:v1.1 起取消钻石荣誉标签,只算 4 级。

---

## 四、索引与性能建议

- 流水表数据量会快速增长,建议**按月分表**或 `coin_transaction_YYYYMM` 冷归档
- 月度结算任务建议分批(每批 1000 用户),避免长事务
- `member_profile.coin_balance` 是冗余字段,定期(每日/每周)做对账校验,异常告警

---

## 五、未在本次设计的点

- 商城首页的活动/运营位配置
- 推送通知(APP 弹窗、短信)的投递记录
- 反作弊明细规则(只保留基础去重)
- 积分发放异常补偿流程(依赖对账 + 运营手动 ADJUST)

后续按需补充。
