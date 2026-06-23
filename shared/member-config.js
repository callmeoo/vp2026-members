/**
 * 唯普汽车商户会员体系 · 全站统一配置
 * --------------------------------------------------
 * 本文件为"会员等级体系 / 会员权益 / 积分规则"的唯一数据源。
 * 前端 app/*.html 与 后台 admin/*.html 均通过 <script src="../shared/member-config.js">
 * 引入，页面读取 window.MEMBER_CONFIG 动态渲染。
 *
 * 修改本文件即可同步更新所有页面，便于后续接入后端接口(只需将接口返回体填入同一结构)。
 *
 * 数据来源：《唯普汽车商户会员体系及积分运营方案》
 */
(function (global) {
  'use strict';

  var MEMBER_CONFIG = {
    version: '2026.04',
    updatedAt: '2026-04-28',

    // ─────────────────────────────────────────────
    // 一、会员等级体系(根据近 3 月累计成交台数 + 账户金额门槛评定)
    // ─────────────────────────────────────────────
    levels: [
      {
        code: 'LV0',
        short: 'V0',
        name: '普通会员',
        color: '#94a3b8',
        gradient: ['#64748b', '#94a3b8'],
        threshold: { dealsMin: 0, dealsMax: 0, accountMin: 0, accountMax: 2000 },
        thresholdText: '账户金额 < 2000 或近 3 个月无成交',
        feature: '基础商户，无成交记录，平台行为少',
        benefits: [
          { id: 'coin_exchange_100', icon: 'coins',     label: '积分 1:1 兑换', desc: '按 1 积分 = 0.1 元等值兑换' },
          { id: 'sales_advisor',     icon: 'briefcase', label: '专属销售顾问', desc: '1 对 1 销售顾问服务' }
        ]
      },
      {
        code: 'LV1',
        short: 'V1',
        name: '金卡会员',
        color: '#0ea5e9',
        gradient: ['#38bdf8', '#0ea5e9'],
        threshold: { dealsMin: 1, dealsMax: 3, accountMin: 2000 },
        thresholdText: '账户金额 ≥ 2000 且近 3 个月交易量 1-3 台',
        feature: '入门成交商户，有基础交易行为，低频次使用增值产品',
        benefits: [
          { id: 'coin_exchange_100', icon: 'coins',       label: '积分 1:1 兑换', desc: '按 1 积分 = 0.1 元等值兑换' },
          { id: 'history_data',      icon: 'scroll-text', label: '历史行情查询', desc: '查询车源历史成交数据' },
          { id: 'reserve_price',     icon: 'target',      label: '保留价查询',    desc: '查询车辆保留底价' },
          { id: 'sales_advisor',     icon: 'briefcase',   label: '专属销售顾问', desc: '1 对 1 销售顾问服务' },
          { id: 'service_1v1',       icon: 'headphones',  label: '1V1 客服',      desc: '专属客服通道' }
        ]
      },
      {
        code: 'LV2',
        short: 'V2',
        name: '白金会员',
        color: '#8b5cf6',
        gradient: ['#a78bfa', '#8b5cf6'],
        threshold: { dealsMin: 4, dealsMax: 14, accountMin: 2000 },
        thresholdText: '账户金额 ≥ 2000 且近 3 个月交易量 4-14 台',
        feature: '稳定成交商户，有固定交易节奏，中度使用增值产品',
        benefits: [
          { id: 'coin_exchange_95',  icon: 'tag',         label: '积分 95 折兑换', desc: '兑换时享 95 折' },
          { id: 'history_data',      icon: 'scroll-text', label: '历史行情查询',   desc: '查询车源历史成交数据' },
          { id: 'reserve_price',     icon: 'target',      label: '保留价查询',     desc: '查询车辆保留底价' },
          { id: 'sales_advisor',     icon: 'briefcase',   label: '专属销售顾问',   desc: '1 对 1 销售顾问服务' },
          { id: 'service_1v1',       icon: 'headphones',  label: '1V1 客服',        desc: '专属客服通道' }
        ]
      },
      {
        code: 'LV3',
        short: 'V3',
        name: '钻石会员',
        color: '#f59e0b',
        gradient: ['#fbbf24', '#f59e0b'],
        threshold: { dealsMin: 15, accountMin: 2000 },
        thresholdText: '账户金额 ≥ 2000 且近 3 个月交易量 ≥ 15 台',
        feature: '高贡献商户，平台营收中坚，高频使用核心增值产品',
        benefits: [
          { id: 'coin_exchange_80',  icon: 'tag',         label: '积分 8 折兑换',   desc: '兑换优惠券时享 8 折' },
          { id: 'refund_1',          icon: 'undo-2',      label: '无理由退车 1 台', desc: '车辆中标后 24 小时内可申请，每定级周期 1 台' },
          { id: 'history_data',      icon: 'scroll-text', label: '历史行情查询',   desc: '查询车源历史成交数据' },
          { id: 'reserve_price',     icon: 'target',      label: '保留价查询',     desc: '查询车辆保留底价' },
          { id: 'sales_advisor',     icon: 'briefcase',   label: '专属销售顾问',   desc: '1 对 1 销售顾问服务' },
          { id: 'service_1v1',       icon: 'headphones',  label: '1V1 客服',        desc: '专属客服通道' }
        ]
      }
    ],

    // ─────────────────────────────────────────────
    // 二、积分规则 · 根据商户行为动态赋值
    // ─────────────────────────────────────────────
    coin: {
      unitYuan: 0.1,                   // 一个积分 = 0.1 元
      validityMonths: 12,              // 自获得当月起 12 个自然月内有效
      validityDesc: '商户获得积分后，有效期为获得当月的 12 个自然月'
    },

    // 积分获取规则(按类别分组)
    coinEarning: [
      {
        category: '交易',
        color: 'emerald',
        icon: 'wallet',
        items: [
          { id: 'deal', action: '完成车辆交易', coin: 50, unit: '积分', desc: '过户后可获得', icon: 'wallet' },
          { id: 'bid',  action: '出价竞拍',     coin: 10, unit: '积分/台', desc: '出价 1 台获取积分 1 次，限非报废车', icon: 'gavel' }
        ]
      },
      {
        category: '互动1',
        color: 'sky',
        icon: 'message-circle',
        items: [
          { id: 'vote',        action: '参与平台投票 / 问卷 / 调研', coin: '5',   unit: '积分/次', desc: '视当期互动方案，回馈平台商户', icon: 'clipboard-list' },
          { id: 'bank_verify', action: '首次充值保证金',              coin: '1-5', unit: '积分/次', desc: '一次性奖励，仅首次完善有效',   icon: 'credit-card' },
          { id: 'biz_verify',  action: '首次实名认证',                coin: '1-5', unit: '积分/次', desc: '一次性奖励，仅首次认证有效',   icon: 'badge-check' }
        ]
      },
      {
        category: '限时活动(不定期)',
        color: 'rose',
        icon: 'calendar-heart',
        items: [
          { id: 'festival', action: '节日专属任务(如春节)', coin: '以活动为准', unit: '出价多倍积分', desc: '以具体活动通知为准', icon: 'gift' }
        ]
      }
    ],

    // ─────────────────────────────────────────────
    // 三、推荐任务(会员中心展示，后台可配置)
    // ─────────────────────────────────────────────
    // highlight=true 为核心任务，在会员中心以红色标记为"核心任务"
    // unit 为积分后缀(如 "/台" / "/次")，空表示纯数字
    recommendedTasks: [
      { id: 't_deal',     action: '车辆成交',                       points: 50, unit: '',    desc: '限非报废车，过户完成（资料回收完毕）后获得，售后退车退回', highlight: true },
      { id: 't_bid',      action: '出价竞拍',                       points: 10, unit: '/台', desc: '限非报废车，按出价台次计算',             highlight: true },
      { id: 't_verify',   action: '首次实名认证',                   points: 5,  unit: '/次', desc: '一次性奖励', once: true },
      { id: 't_deposit',  action: '首充保证金',                     points: 5,  unit: '/次', desc: '一次性奖励', once: true },
      { id: 't_vote',     action: '参与平台投票 / 问卷 / 调研',     points: 2,  unit: '/次', desc: '' },
      { id: 't_festival', action: '活动专属任务',                   points: 20, unit: '/台', desc: '以具体活动通知为准',                highlight: true,
        activityName: '国庆节双倍积分活动', activityPeriod: '2026.10.1 - 10.7', activityDesc: '活动期间出价积分翻 2 倍，成交积分翻 3 倍' }
    ],

    // ─────────────────────────────────────────────
    // 四、积分可兑换的权益卡(含有效期配置，用于商城与我的权益卡)
    // ─────────────────────────────────────────────
    redeemableRewards: [
      { id: 'r_compfee_50',        name: '综合服务费 50 元券',       desc: '限平台成交车辆(非报废车)',                                        coin: 500, scope: '所有等级商户', icon: 'percent',      validityDays: 30, restriction: '综合服务费直减 50 元;限平台成交车辆，报废车不可用。' },
      { id: 'r_servicecenter_100', name: '服务中心消费 100 元券',    desc: '限非平台成交车辆，在南沙、白云、佛山、东莞服务中心办理过户服务', coin: 500, scope: '所有等级商户', icon: 'building-2',   validityDays: 30, restriction: '服务中心消费直减 100 元;限南沙、白云、佛山、东莞服务中心。' },
      { id: 'r_svc_insurance', name: '出险报告（车信盟）', desc: '车信盟出险/事故记录报告',                                          coin: 280, scope: '所有等级商户', icon: 'shield-alert',     validityDays: 30, restriction: '车信盟·出险/事故记录报告查询；按次核销，不同类型数据报告可叠加使用。' },
      { id: 'r_svc_maintain',  name: '维保报告（唯车转）', desc: '唯车转维修保养记录报告',                                          coin: 200, scope: '所有等级商户', icon: 'wrench',           validityDays: 30, restriction: '唯车转·维修保养记录报告查询；按次核销，不同类型数据报告可叠加使用。' },
      { id: 'r_svc_battery',   name: '电池报告（唯车转）', desc: '唯车转三电检测报告',                                              coin: 300, scope: '所有等级商户', icon: 'battery-charging', validityDays: 30, restriction: '唯车转·三电检测报告查询；按次核销，不同类型数据报告可叠加使用。' },
      { id: 'r_svc_mileage',   name: '里程报告（唯车转）', desc: '唯车转里程校验报告',                                              coin: 180, scope: '所有等级商户', icon: 'gauge',            validityDays: 30, restriction: '唯车转·里程校验报告查询；按次核销，不同类型数据报告可叠加使用。' },
      { id: 'r_svc_overall',   name: '综合报告（柠檬查）', desc: '柠檬查车辆综合检测报告',                                          coin: 380, scope: '所有等级商户', icon: 'file-search',      validityDays: 30, restriction: '柠檬查·车辆综合检测报告查询；按次核销，不同类型数据报告可叠加使用。' }
    ],

    // ─────────────────────────────────────────────
    // 五、Q&A 常见问题(移动端 landing 与 PC 端 member-intro 共用)
    // ─────────────────────────────────────────────
    qaList: [
      { q: '等级体系介绍',           a: '<p>唯普会员等级<strong>每月 1 日统一定级</strong>，由用户最近 3 个自然月的累计成交台数与当前账户(需 ≥ 2000 元)共同决定。本月内成交或账户的变化，将在<strong>下月 1 日</strong>定级时生效，本月等级保持不变。</p><p>每个等级可享受不同类型的权益，等级越高权益越丰富。</p>' },
      { q: '什么是成交台数?',        a: '<p>成交台数是用户最近 3 个自然月(含本月)在唯普平台<strong>已付款</strong>的车辆数量，且<strong>不含退车</strong>。</p><p>特别提示：仲裁退车将冲减对应的成交台数。</p>' },
      { q: '会员等级变化规则',   a: '<p>会员等级<strong>每月 1 日统一定级</strong>，依据用户最近 3 个自然月的累计成交台数与当前账户(需 ≥ 2000 元)评定，定级结果在本月内保持不变。</p><p><strong>升级：</strong>本月中即使成交台数已达到更高等级门槛，等级也不会立即变动，将于<strong>下月 1 日</strong>统一升级；在此之前，会员页面会提前显示「已满足 V× 条件 · 下月 1 日自动升级」；若距更高等级仅差 3 台以内，会同步提示「本月再成交 X 台可直升 V×」。</p><p><strong>降级：</strong>若账户低于 2000 元或成交台数不足，同样在下月 1 日统一下调。</p>' },
      { q: '如何查看会员等级权益?',  a: '<p>您可在会员页面通过切换等级的方式查看各等级的权益，其中未达到的等级显示为未解锁状态。</p><p>会员等级越高，可享权益越丰富。</p>' },
      { q: '会员等级有效期多久?',    a: '<p>您的会员等级会在每月 1 日进行更新，更新后的等级有效期至本月最后一日。</p>' },
      { q: '积分有效期如何计算?',    a: '<p>积分自<strong>获得当月</strong>起 12 个自然月内有效，到期自动清零。例如 2026 年 4 月获得的积分，有效期至 2027 年 4 月 30 日。</p><p>建议定期登录积分明细页确认积分余额与到期情况，及时前往积分商城兑换使用。</p>' }
    ]
  };

  // ─────────────────────────────────────────────
  // 工具方法：供页面复用
  // ─────────────────────────────────────────────
  MEMBER_CONFIG.getLevelByIndex = function (idx) {
    return MEMBER_CONFIG.levels[idx] || MEMBER_CONFIG.levels[0];
  };
  MEMBER_CONFIG.getLevelByCode = function (code) {
    for (var i = 0; i < MEMBER_CONFIG.levels.length; i++) {
      if (MEMBER_CONFIG.levels[i].code === code || MEMBER_CONFIG.levels[i].short === code) return MEMBER_CONFIG.levels[i];
    }
    return MEMBER_CONFIG.levels[0];
  };
  MEMBER_CONFIG.getLevelByDeals = function (deals) {
    for (var i = MEMBER_CONFIG.levels.length - 1; i >= 0; i--) {
      var t = MEMBER_CONFIG.levels[i].threshold;
      if (deals >= t.dealsMin) return MEMBER_CONFIG.levels[i];
    }
    return MEMBER_CONFIG.levels[0];
  };
  // 等级进度状态机(月度统一定级 · 5 态):每月 1 日按「前2月+本月成交台数 + 账户≥2000」定级,下月 1 日生效。
  // 入参 lockedShort=已生效等级 / deals=W(前2月+本月累计成交台数,含本月) / accountOk=账户是否≥2000
  // kind(账户达标后看 W 落在"保级/冲级/已达标"哪段):
  //   account-low  账户<2000 → 页面按 lockedShort 出文案(V0=充至2000可参与升级 / V1-V3=下月有降级风险)
  //   keep-level   W < 当前等级门槛(成交下滑) → 保级,本月再成交 holdNeed 台
  //   to-next      当前级门槛 ≤ W < 下一级门槛 → 冲下一级,本月再成交 need 台
  //   ready        W ≥ 下一级门槛(本月已冲够) → 已达标待升级,下月 1 日自动升 qualifiedShort;
  //                qualifiedShort 未封顶且距更高一级 ≤3 台时,文案带「本月再成交 aboveNeed 台可直升 aboveShort」
  //                (压区间顶端不漏冲刺窗口;差 >3 台本月不可达,提示只是噪音,回退纯升级文案)
  //   max          已 V3 且 W ≥ 15 → 已封顶
  MEMBER_CONFIG.getLevelProgress = function (lockedShort, deals, accountOk) {
    var levels = MEMBER_CONFIG.levels;
    var lockedIdx = levels.indexOf(MEMBER_CONFIG.getLevelByCode(lockedShort));
    var next = levels[lockedIdx + 1] || null;
    var curMin = levels[lockedIdx].threshold.dealsMin || 0;       // 维持当前等级门槛
    var dealsLevel = MEMBER_CONFIG.getLevelByDeals(deals);        // W 对应应得等级
    var need = next ? Math.max(0, next.threshold.dealsMin - deals) : 0;   // 冲下一级还需
    var holdNeed = Math.max(0, curMin - deals);                          // 保级还需
    var above = levels[levels.indexOf(dealsLevel) + 1] || null;          // 应得级再上一级(ready 复合文案用)
    var aboveNeed = above ? Math.max(0, above.threshold.dealsMin - deals) : 0;
    if (aboveNeed > 3) { above = null; aboveNeed = 0; }                  // 差 >3 台不提示冲刺:本月不可达的目标只是噪音
    var denom = curMin || (next ? next.threshold.dealsMin : 1);
    var kind, percent;
    if (!accountOk)                            { kind = 'account-low'; percent = Math.min(100, Math.round(deals / denom * 100)); }
    else if (deals < curMin)                   { kind = 'keep-level'; percent = Math.min(100, Math.round(deals / (curMin || 1) * 100)); }
    else if (!next)                            { kind = 'max'; percent = 100; }
    else if (deals >= next.threshold.dealsMin) { kind = 'ready'; percent = 100; }
    else                                       { kind = 'to-next'; percent = Math.min(100, Math.round(deals / next.threshold.dealsMin * 100)); }
    return {
      kind: kind,
      lockedShort: levels[lockedIdx].short,
      nextShort: next ? next.short : null,
      qualifiedShort: dealsLevel.short,            // ready 文案「已满足 V× 条件」用
      dealsLevelShort: dealsLevel.short,
      deals: deals,
      need: need,                                  // to-next:本月再成交 need 台升下一级
      holdNeed: holdNeed,                          // keep-level:本月再成交 holdNeed 台保级
      aboveShort: above ? above.short : null,      // ready:应得级未封顶且差 ≤3 台时,可再冲的更高一级
      aboveNeed: aboveNeed,                        // ready:本月再成交 aboveNeed 台可直升 aboveShort
      percent: percent
    };
  };
  MEMBER_CONFIG.yuanFromCoin = function (coin) {
    return (Number(coin) * MEMBER_CONFIG.coin.unitYuan).toFixed(2);
  };
  // 权益展示顺序(全站统一):调整此数组即可全局生效
  MEMBER_CONFIG.benefitOrder = [
    'history_data', 'reserve_price',
    'sales_advisor', 'service_1v1',
    'coin_exchange_100', 'coin_exchange_95', 'coin_exchange_80',
    'refund_1'
  ];
  MEMBER_CONFIG.sortBenefits = function (list) {
    return list.slice().sort(function (a, b) {
      var ai = MEMBER_CONFIG.benefitOrder.indexOf(a.id);
      var bi = MEMBER_CONFIG.benefitOrder.indexOf(b.id);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  };

  global.MEMBER_CONFIG = MEMBER_CONFIG;
})(typeof window !== 'undefined' ? window : this);
