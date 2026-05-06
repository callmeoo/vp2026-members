/**
 * 唯普汽车商户会员体系 · 全站统一配置
 * --------------------------------------------------
 * 本文件为"会员等级体系 / 会员权益 / 积分规则"的唯一数据源。
 * 前端 app/*.html 与 后台 admin/*.html 均通过 <script src="../shared/member-config.js">
 * 引入,页面读取 window.MEMBER_CONFIG 动态渲染。
 *
 * 修改本文件即可同步更新所有页面,便于后续接入后端接口(只需将接口返回体填入同一结构)。
 *
 * 数据来源:《唯普汽车商户会员体系及积分运营方案》
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
        thresholdText: '账户金额 < 2000 且近 3 个月无成交',
        feature: '基础商户,无成交记录,平台行为少',
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
        feature: '入门成交商户,有基础交易行为,低频次使用增值产品',
        benefits: [
          { id: 'coin_exchange_100', icon: 'coins',       label: '积分 1:1 兑换', desc: '按 1 积分 = 0.1 元等值兑换' },
          { id: 'history_data',      icon: 'scroll-text', label: '历史数据查询', desc: '查询车源历史成交数据' },
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
        feature: '稳定成交商户,有固定交易节奏,中度使用增值产品',
        benefits: [
          { id: 'coin_exchange_95',  icon: 'tag',         label: '积分 95 折兑换', desc: '兑换时享 95 折' },
          { id: 'history_data',      icon: 'scroll-text', label: '历史数据查询',   desc: '查询车源历史成交数据' },
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
        feature: '高贡献商户,平台营收中坚,高频使用核心增值产品',
        benefits: [
          { id: 'coin_exchange_80',  icon: 'tag',         label: '积分 8 折兑换',   desc: '兑换优惠券时享 8 折' },
          { id: 'refund_1',          icon: 'undo-2',      label: '无理由退车 1 台', desc: '车辆中标后 24 小时内可申请,每定级周期 1 台' },
          { id: 'history_data',      icon: 'scroll-text', label: '历史数据查询',   desc: '查询车源历史成交数据' },
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
      validityDesc: '商户获得积分后,有效期为获得当月的 12 个自然月'
    },

    // 积分获取规则(按类别分组)
    coinEarning: [
      {
        category: '交易',
        color: 'emerald',
        icon: 'wallet',
        items: [
          { id: 'deal', action: '完成车辆交易', coin: 50, unit: '积分', desc: '过户后可获得', icon: 'wallet' },
          { id: 'bid',  action: '出价竞拍',     coin: 10, unit: '积分/台', desc: '出价 1 台获取积分 1 次,不封顶', icon: 'gavel' }
        ]
      },
      {
        category: '互动1',
        color: 'sky',
        icon: 'message-circle',
        items: [
          { id: 'vote',        action: '参与平台投票 / 问卷 / 调研', coin: '5',   unit: '积分/次', desc: '视当期互动方案,回馈平台商户', icon: 'clipboard-list' },
          { id: 'bank_verify', action: '首次充值保证金',              coin: '1-5', unit: '积分/次', desc: '一次性奖励,仅首次完善有效',   icon: 'credit-card' },
          { id: 'biz_verify',  action: '首次实名认证',                coin: '1-5', unit: '积分/次', desc: '一次性奖励,仅首次认证有效',   icon: 'badge-check' }
        ]
      },
      {
        category: '互动2',
        color: 'violet',
        icon: 'share-2',
        items: [
          { id: 'share', action: '转发车源并成功分享朋友圈', coin: 1, unit: '积分', desc: '', icon: 'megaphone' }
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
    // 三、推荐任务(会员中心展示,后台可配置)
    // ─────────────────────────────────────────────
    // highlight=true 为核心任务,在会员中心以红色标记为"核心任务"
    // unit 为积分后缀(如 "/台" / "/次"),空表示纯数字
    recommendedTasks: [
      { id: 't_deal',     action: '车辆成交',                       points: 50, unit: '',    desc: '成交一台车可获得,退车则扣回',       highlight: true },
      { id: 't_bid',      action: '出价竞拍',                       points: 10, unit: '/台', desc: '仅计有效出价 1 台算 1 次,上不封顶', highlight: true },
      { id: 't_vote',     action: '参与平台投票 / 问卷 / 调研',     points: 2,  unit: '/次', desc: '' },
      { id: 't_deposit',  action: '首次充值保证金',                 points: 5,  unit: '/次', desc: '' },
      { id: 't_verify',   action: '首次实名认证',                   points: 5,  unit: '/次', desc: '' },
      { id: 't_share',    action: '转发车源并成功分享朋友圈',       points: 1,  unit: '',    desc: '', dailyMax: 20 },
      { id: 't_festival', action: '活动专属任务',                   points: 20, unit: '/台', desc: '以具体活动通知为准',                highlight: true }
    ],

    // ─────────────────────────────────────────────
    // 四、积分可兑换的权益卡(含有效期配置,用于商城与我的权益卡)
    // ─────────────────────────────────────────────
    redeemableRewards: [
      { id: 'r_compfee_50',     name: '综合服务费 50 元券',      desc: '综合服务费直减 50 元;限平台成交车辆(非报废车)',                   coin: 500, scope: '所有等级商户', icon: 'percent',      validityDays: 30 },
      { id: 'r_servicecenter_100', name: '服务中心消费 100 元券', desc: '过户服务费直减 100 元;限非平台成交车辆,在南沙、白云、佛山、东莞服务中心办理过户服务', coin: 500, scope: '所有等级商户', icon: 'building-2',   validityDays: 30 },
      { id: 'r_dataquery_5',    name: '数据查询服务优惠券 5 元',  desc: '数据查询服务直减 5 元;优惠券不可叠加使用,V2/V3 等级打折兑换', coin: 50,  scope: '所有等级商户', icon: 'shield-alert', validityDays: 30 },
      { id: 'r_dataquery_10',   name: '数据查询服务优惠券 10 元', desc: '数据查询服务直减 10 元;优惠券不可叠加使用,V2/V3 等级打折兑换', coin: 100, scope: '所有等级商户', icon: 'car-front',    validityDays: 30 }
    ],

    // ─────────────────────────────────────────────
    // 五、Q&A 常见问题(移动端 landing 与 PC 端 member-intro 共用)
    // ─────────────────────────────────────────────
    qaList: [
      { q: '等级体系介绍',           a: '<p>唯普会员等级每月 1 日更新,由用户最近 3 个自然月(不含本月)的累计成交台数决定。用户最近 3 个自然月(含本月)的累计成交台数达到更高等级门槛,即可实时升级。</p><p>每个等级可享受不同类型的权益,等级越高权益越丰富。</p>' },
      { q: '什么是成交台数?',        a: '<p>成交台数是用户最近 3 个自然月(含本月)在唯普平台完成过户或付款的车辆数量。不同成交方式对应不同的倍数系数。</p><p>特别提示:退车、退款等反向交易将冲减对应的成交台数。</p>' },
      { q: '如何累积成交台数?',      a: '<p>使用唯普平台进行竞价、保留价购买、专场活动等方式成交车辆,均可累积成交台数。</p><p>成交台数以<strong>过户完成</strong>或<strong>付款完成</strong>为准,仅计算近 3 个自然月的数据。</p>' },
      { q: '唯普会员等级变化规则',   a: '<p>每月 1 日,系统将根据用户上一周期(本月前最近的 3 个自然月,不含本月)的累计成交台数进行定级。</p><p>达标则等级将更新。您可在会员等级页面查看最新的等级和对应的权益。</p><p><strong>注意:</strong>本月中,若您最近 3 个自然月(含本月)累计成交台数达到更高等级的门槛,将进行实时升级。但如月底时台数不足,则可能在下月 1 日降回对应等级。</p>' },
      { q: '如何查看会员等级权益?',  a: '<p>您可在会员页面通过切换等级的方式查看各等级的权益,其中未达到的等级显示为未解锁状态。</p><p>会员等级越高,可享权益越丰富。</p>' },
      { q: '会员等级有效期多久?',    a: '<p>您的会员等级会在每月 1 日进行更新,更新后的等级有效期至当月最后一日。</p>' },
      { q: '积分有效期如何计算?',    a: '<p>积分自<strong>获得当月</strong>起 12 个自然月内有效,到期自动清零。例如 2026 年 4 月获得的积分,有效期至 2027 年 4 月 30 日。</p><p>建议定期登录积分明细页确认积分余额与到期情况,及时前往积分商城兑换使用。</p>' }
    ]
  };

  // ─────────────────────────────────────────────
  // 工具方法:供页面复用
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
