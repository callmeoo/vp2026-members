# API 接口设计文档

> 版本:v1.0  
> 风格:RESTful + JSON  
> 鉴权:现有用户鉴权体系(假设为 JWT / Session,具体按你们现有规范)

---

## 通用约定

### 基础 URL
```
https://api.wpcar.example/membership/v1
```

### 统一响应体
```json
{
  "code": 0,          // 0 成功,非 0 失败
  "message": "OK",
  "data": { ... }
}
```

### 错误码(示意)

| code | 含义 |
|------|------|
| 0 | 成功 |
| 40001 | 参数错误 |
| 40101 | 未登录 |
| 40301 | 等级不足,无法兑换 |
| 40302 | 金币不足 |
| 40303 | 库存不足 |
| 40304 | 转发已达上限 |
| 40901 | 重复操作(已发放) |
| 50000 | 服务器错误 |

---

## 一、前台接口(APP / 小程序调用)

### 1.1 获取会员信息

**`GET /me/profile`**

首页会员卡片展示。

**Response**
```json
{
  "code": 0,
  "data": {
    "user_id": 10086,
    "nickname": "张三",
    "avatar": "https://...",
    "current_level": 2,
    "level_name": "V2",
        "coin_balance": 356,
    "coin_expiring_soon": 50,       // 30 天内即将过期
    "next_level": 3,
    "next_level_name": "V3",
    "deal_count_3m": 12,            // 近 3 个月成交
    "deal_count_needed": 18,        // 距离下一等级还差
    "progress_percent": 40          // 进度条百分比(前端计算也可)
  }
}
```

---

### 1.2 获取金币流水

**`GET /me/coins/transactions`**

**Query 参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| type | string | 可选:EARN_BID / EARN_SHARE / EARN_DEAL / SPEND_REDEEM / EXPIRE |
| start_date | string | 起始日期 YYYY-MM-DD |
| end_date | string | 结束日期 |
| page | int | 页码,默认 1 |
| page_size | int | 每页条数,默认 20,最大 50 |

**Response**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 988,
        "type": "EARN_DEAL",
        "type_label": "成交奖励",
        "amount": 50,
        "balance_after": 356,
        "ref_info": "成交 #车源 XC2045",
        "expire_at": "2027-04-15",
        "created_at": "2026-04-10 11:23:45"
      },
      {
        "id": 985,
        "type": "SPEND_REDEEM",
        "type_label": "兑换权益",
        "amount": -200,
        "balance_after": 306,
        "ref_info": "兑换 车辆中标价查询卡",
        "created_at": "2026-04-09 15:10:22"
      }
    ],
    "total": 148,
    "page": 1,
    "page_size": 20
  }
}
```

---

### 1.3 即将过期金币提醒

**`GET /me/coins/expiring`**

**Query 参数**
| 参数 | 说明 |
|------|------|
| within_days | 默认 30 |

**Response**
```json
{
  "code": 0,
  "data": {
    "total_expiring": 50,
    "buckets": [
      { "expire_at": "2026-04-30", "amount": 30 },
      { "expire_at": "2026-05-10", "amount": 20 }
    ]
  }
}
```

---

### 1.4 等级成长详情

**`GET /me/level/progress`**

**Response**
```json
{
  "code": 0,
  "data": {
    "current_level": 2,
    "current_level_name": "V2",
        "window_start": "2026-01-01",
    "window_end": "2026-03-31",
    "current_deal_count": 12,
    "tiers": [
      { "level": 0, "name": "V0", "threshold": 0, "achieved": true },
      { "level": 1, "name": "V1", "threshold": 3, "achieved": true },
      { "level": 2, "name": "V2", "threshold": 10, "achieved": true },
      { "level": 3, "name": "V3", "threshold": 30, "achieved": false }
    ],
    "next_settle_date": "2026-05-01"
  }
}
```

---

### 1.5 等级变更历史

**`GET /me/level/history`**

**Response**
```json
{
  "code": 0,
  "data": {
    "list": [
      { "month": "2026-03", "from": 1, "to": 2, "change_type": "UPGRADE", "deal_count": 10 },
      { "month": "2026-02", "from": 1, "to": 1, "change_type": "KEEP",    "deal_count": 5  }
    ]
  }
}
```

---

### 1.6 权益卡目录(会员商城)

**`GET /rewards/catalog`**

**Query 参数**
| 参数 | 说明 |
|------|------|
| category | 可选:QUERY / DISCOUNT / QUOTA / SERVICE |
| level_filter | 可选,只看某等级可兑换 |

**Response**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "code": "CAR_BID_PRICE_QUERY",
        "name": "车辆中标价查询卡",
        "category": "QUERY",
        "category_label": "数据查询",
        "coin_price": 200,
        "min_level": 0,
        "grant_type": "REDEEM",
        "stock_left": 823,
        "validity_days": 30,
        "description": "单次查询单台车历史中标价,有效期 30 天",
        "redeemable": true,      // 当前用户是否可兑换
        "unavailable_reason": null
      },
      {
        "id": 3,
        "code": "DISCOUNT_TRANSFER_80",
        "name": "过户 8 折 / 复检 8 折",
        "category": "DISCOUNT",
        "category_label": "交易折扣",
        "coin_price": 200,
        "min_level": 3,
        "grant_type": "REDEEM",
        "stock_left": 50,
        "validity_days": 30,
        "description": "V3会员专享",
        "redeemable": false,
        "unavailable_reason": "需 V3及以上"
      }
    ]
  }
}
```

---

### 1.7 兑换权益卡

**`POST /rewards/redeem`**

**Request Body**
```json
{ "reward_card_id": 1, "quantity": 1 }
```

**Response(成功)**
```json
{
  "code": 0,
  "data": {
    "redemption_id": 55321,
    "coin_cost": 200,
    "remaining_balance": 156,
    "expire_at": "2026-05-15 23:59:59"
  }
}
```

**Response(失败示例)**
```json
{ "code": 40302, "message": "金币余额不足", "data": null }
```

---

### 1.8 我的权益卡

**`GET /me/rewards`**

**Query 参数**
| 参数 | 说明 |
|------|------|
| status | 可选:ACTIVE / USED / EXPIRED / INVALID |

**Response**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "redemption_id": 55321,
        "reward_name": "车辆中标价查询卡",
        "category": "QUERY",
        "coin_cost": 200,
        "status": "ACTIVE",
        "status_label": "未使用",
        "expire_at": "2026-05-15 23:59:59",
        "used_at": null
      }
    ]
  }
}
```

---

## 二、内部接口(业务系统回调)

这些接口**不对 APP/小程序开放**,只由业务系统(拍卖系统、订单系统、分享系统)内部调用,用于触发金币发放。

### 2.1 出价发金币

**`POST /internal/coins/grant-bid`**

**鉴权**:内部调用密钥 或 服务间 mTLS

**Request**
```json
{ "user_id": 10086, "car_id": 2045, "bid_at": "2026-04-15 10:22:33" }
```

**Response**
```json
{ "code": 0, "data": { "granted": true, "amount": 1, "coin_transaction_id": 988 } }
```

**幂等**:重复调用同一 `(user_id, car_id)` 不会重复发放,但接口仍返回 200。

---

### 2.2 转发发金币

**`POST /internal/coins/grant-share`**

**Request**
```json
{ "user_id": 10086, "car_id": 2045, "channel": "WECHAT_MOMENTS", "share_at": "2026-04-15 10:30:00" }
```

**Response(成功)**
```json
{ "code": 0, "data": { "granted": true, "amount": 2 } }
```

**Response(超上限)**
```json
{ "code": 40304, "message": "今日转发次数已达上限", "data": { "granted": false } }
```

**业务规则**:
- 校验用户登录(调用方传入时必须是登录态 user_id,否则不接受)
- 去重:`(user_id, car_id)` 已有记录 → 幂等返回
- 校验每日/总量上限

---

### 2.3 成交发金币

**`POST /internal/coins/grant-deal`**

**触发时机**:订单系统在**过户完成 或 付款完成**时调用

**Request**
```json
{ "user_id": 10086, "order_id": 900123, "car_id": 2045, "deal_at": "2026-04-15 18:00:00" }
```

**Response**
```json
{ "code": 0, "data": { "granted": true, "amount": 50, "coin_transaction_id": 1002 } }
```

**幂等**:按 `order_id` 去重,同一订单不重复发放。

---

### 2.4 退车/退款 —— 冲减成交台数(可选接口)

> 金币**不扣**,但成交台数需要冲减。此处仅提供参考,也可让订单系统直接更新成交表,让月度结算自然处理。

**`POST /internal/deals/revoke`**

**Request**
```json
{ "order_id": 900123, "reason": "REFUND" }
```

---

## 三、运营后台接口

### 3.1 仪表盘数据

**`GET /admin/dashboard/summary`**

**Response**
```json
{
  "code": 0,
  "data": {
    "member_distribution": {
      "V0": 125003,
      "V1": 58921,
      "V2": 12035,
      "V3": 3910
    },
    "today": {
      "coin_issued": 52300,
      "coin_spent": 18400,
      "new_redemptions": 125
    },
    "mtd": {
      "coin_issued": 1280000,
      "coin_spent": 435000,
      "new_redemptions": 2800
    }
  }
}
```

---

### 3.2 等级规则配置

**`GET /admin/rules/level`**

**Response**
```json
{
  "code": 0,
  "data": {
    "levels": [
      { "level": 0, "name": "V0", "min_deal_count": 0 },
      { "level": 1, "name": "V1", "min_deal_count": 3 },
      { "level": 2, "name": "V2", "min_deal_count": 10 },
      { "level": 3, "name": "V3", "min_deal_count": 30 }
    ],
    "window_months": 3
  }
}
```

**`PUT /admin/rules/level`**

```json
{
  "levels": [
    { "level": 1, "min_deal_count": 5 },
    { "level": 2, "min_deal_count": 12 },
    { "level": 3, "min_deal_count": 35 }
  ]
}
```

---

### 3.3 金币规则配置

**`GET /admin/rules/coin`**

```json
{
  "code": 0,
  "data": {
    "bid_coin": 1,
    "share_coin": 2,
    "deal_coin": 50,
    "share_daily_limit": 20,
    "share_total_limit": 9999,
    "coin_validity_months": 12
  }
}
```

**`PUT /admin/rules/coin`** — 参数同上。

---

### 3.4 权益卡管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/rewards` | 列表(分页 + 筛选) |
| POST | `/admin/rewards` | 新增 |
| PUT | `/admin/rewards/:id` | 编辑 |
| PATCH | `/admin/rewards/:id/status` | 上下架 |
| PATCH | `/admin/rewards/:id/stock` | 补/扣库存 |

**POST / PUT Body(示例)**
```json
{
  "code": "CAR_BID_PRICE_QUERY",
  "name": "车辆中标价查询卡",
  "category": "QUERY",
  "coin_price": 200,
  "min_level": 0,
  "grant_type": "REDEEM",
  "stock": 1000,
  "validity_days": 30,
  "description": "...",
  "sort_order": 10
}
```

---

### 3.5 商户档案查询

**`GET /admin/members`**

**Query 参数**
| 参数 | 说明 |
|------|------|
| keyword | 手机号 / 昵称 / 商户号模糊搜索 |
| level | 0/1/2/3 |
| page / page_size | 分页 |

**Response**(字段略,基本是 `member_profile` 的展示版本)

---

### 3.6 商户金币流水查询

**`GET /admin/members/:user_id/transactions`** — 参数同前台流水接口,额外支持按任意用户查询。

---

### 3.7 运营手动调整金币

**`POST /admin/members/:user_id/coins/adjust`**

```json
{
  "amount": -100,
  "reason": "发现薅羊毛行为,扣回金币"
}
```

触发后写入一条 `ADJUST` 类型的流水,有操作人审计。

---

### 3.8 月度结算任务

- **定时触发**:每月 1 号 01:00 系统自动跑
- **手动触发**(运营应急用):`POST /admin/jobs/monthly-settle`

---

## 四、前后端协作说明

| 项 | 说明 |
|----|------|
| 时区 | 所有时间字段使用 ISO 8601(UTC+8),前端按需格式化 |
| 分页 | 统一 `page` + `page_size`,最大 50 |
| 金额单位 | 金币为整数,车价以分为单位 |
| 接口限流 | 前台接口建议按 user 维度限流,内部接口按 IP 限流 |

---

## 五、未来扩展(本期不做)

- 金币互赠(目前严格禁止转让)
- 金币参与抽奖/盲盒
- 跨业务积分互通(如与会员费、保险积分互换)
- 开放平台 API(合作商户查询自身金币)
