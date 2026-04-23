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
    updatedAt: '2026-04-17',

    // ─────────────────────────────────────────────
    // 一、会员等级体系(根据近 3 月累计成交台数 + 账户金额门槛评定)
    // ─────────────────────────────────────────────
    levels: [
      {
        code: 'LV0',
        short: 'V0',
        name: '新人会员',
        color: '#94a3b8',
        gradient: ['#64748b', '#94a3b8'],
        threshold: { dealsMin: 0, dealsMax: 0, accountMin: 0, accountMax: 2000 },
        thresholdText: '账户金额 < 2000,或近 3 个月无成交',
        feature: '基础商户,无成交记录,平台行为少',
        merchantCount: 14438,
        // 该等级享有的会员权益(以会员权益为主,积分为辅)
        benefits: [
          { id: 'coin_exchange_100', icon: 'coins', label: '积分 1:1 兑换', desc: '按 1 积分 = 0.093 元等值兑换权益卡' }
        ]
      },
      {
        code: 'LV1',
        short: 'V1',
        name: '普通会员',
        color: '#0ea5e9',
        gradient: ['#38bdf8', '#0ea5e9'],
        threshold: { dealsMin: 1, dealsMax: 2, accountMin: 2000 },
        thresholdText: '账户金额 ≥ 2000,或近 3 个月交易量 1-2 台',
        feature: '入门成交商户,有基础交易行为,低频次使用增值产品',
        merchantCount: 499,
        benefits: [
          { id: 'coin_exchange_100', icon: 'coins', label: '积分 1:1 兑换', desc: '按 1 积分 = 0.093 元等值兑换' },
          { id: 'history_data', icon: 'scroll-text', label: '历史数据查询', desc: '查询车源历史成交数据' },
          { id: 'reserve_price', icon: 'target', label: '保留价查询', desc: '查询车辆保留底价' },
          { id: 'sales_advisor', icon: 'briefcase', label: '专属销售顾问', desc: '1 对 1 销售顾问服务' },
          { id: 'service_1v1', icon: 'headphones', label: '1V1 客服', desc: '专属客服通道' }
        ]
      },
      {
        code: 'LV2',
        short: 'V2',
        name: '银卡会员',
        color: '#8b5cf6',
        gradient: ['#a78bfa', '#8b5cf6'],
        threshold: { dealsMin: 3, dealsMax: 9, accountMin: 2000 },
        thresholdText: '账户金额 ≥ 2000,或近 3 个月交易量 3-9 台',
        feature: '稳定成交商户,有固定交易节奏,中度使用增值产品',
        merchantCount: 310,
        benefits: [
          { id: 'coin_exchange_95', icon: 'tag', label: '积分 95 折兑换', desc: '兑换权益卡时享 95 折' },
          { id: 'service_pack', icon: 'package', label: '服务中心权益包', desc: '停车费减免、物流、代驾等上门服务' },
          { id: 'history_data', icon: 'scroll-text', label: '历史数据查询', desc: '查询车源历史成交数据' },
          { id: 'reserve_price', icon: 'target', label: '保留价查询', desc: '查询车辆保留底价' },
          { id: 'sales_advisor', icon: 'briefcase', label: '专属销售顾问', desc: '1 对 1 销售顾问服务' },
          { id: 'service_1v1', icon: 'headphones', label: '1V1 客服', desc: '专属客服通道' }
        ]
      },
      {
        code: 'LV3',
        short: 'V3',
        name: '金卡会员',
        color: '#f59e0b',
        gradient: ['#fbbf24', '#f59e0b'],
        threshold: { dealsMin: 10, accountMin: 2000 },
        thresholdText: '账户金额 ≥ 2000,或近 3 个月交易量 ≥ 10 台',
        feature: '高贡献商户,平台营收中坚,高频使用核心增值产品',
        merchantCount: 121,
        benefits: [
          { id: 'coin_exchange_80', icon: 'tag', label: '积分 8 折兑换', desc: '兑换权益卡时享 8 折' },
          { id: 'service_pack', icon: 'package', label: '服务中心权益包', desc: '停车费减免、物流、代驾等上门服务' },
          { id: 'refund_1', icon: 'undo-2', label: '无偿退车 1 台', desc: '每定级周期可享 1 台无偿退车' },
          { id: 'history_data', icon: 'scroll-text', label: '历史数据查询', desc: '查询车源历史成交数据' },
          { id: 'reserve_price', icon: 'target', label: '保留价查询', desc: '查询车辆保留底价' },
          { id: 'sales_advisor', icon: 'briefcase', label: '专属销售顾问', desc: '1 对 1 销售顾问服务' }
        ]
      }
    ],

    // ─────────────────────────────────────────────
    // 二、积分规则 · 根据商户行为动态赋值
    // ─────────────────────────────────────────────
    coin: {
      unitYuan: 0.093,                 // 一个积分 = 0.093 元
      validityMonths: 12,              // 自获得当月起 12 个自然月内有效
      validityDesc: '商户获得积分后,有效期为获得当月的 12 个自然月'
    },

    // 积分获取规则(按类别分组)
    coinEarning: [
      {
        category: '商户行为 & 核心交易类',
        color: 'emerald',
        icon: 'wallet',
        items: [
          { id: 'deal', action: '完成车辆交易', coin: 50, unit: '积分', desc: '成交一台车可获得', icon: 'wallet' },
          { id: 'bid', action: '有效出价参与竞拍', coin: 10, unit: '积分/台', desc: '出价 1 台车 1 次,不封顶', icon: 'gavel' }
        ]
      },
      {
        category: '活跃互动类(低门槛)',
        color: 'sky',
        icon: 'message-circle',
        items: [
          { id: 'vote', action: '参与平台投票 / 问卷 / 调研', coin: '1-5', unit: '积分/次', desc: '视当期互动方案,回馈平台商户', icon: 'clipboard-list' },
          { id: 'bank_verify', action: '完善账户银行卡信息,并充值保证金', coin: '1-5', unit: '积分/次', desc: '一次性奖励,仅首次完善有效', icon: 'credit-card' },
          { id: 'biz_verify', action: '上传营业执照并完成实名认证(解锁企业车商特权)', coin: '1-5', unit: '积分/次', desc: '一次性奖励,仅首次完善有效', icon: 'badge-check' }
        ]
      },
      {
        category: '社交裂变类(高积分)',
        color: 'violet',
        icon: 'share-2',
        items: [
          { id: 'share', action: '转发车源并成功分享朋友圈', coin: 1, unit: '积分', desc: '', icon: 'megaphone' },
          { id: 'invite_member', action: '邀请好友注册并开通会员', coin: 2, unit: '积分', desc: '双方都有积分增送,好友需完成实名认证 + 保证金充值', icon: 'user-plus' },
          { id: 'refer_deal', action: '推荐好友完成首笔交易', coin: 2, unit: '积分', desc: '好友需在 30 天内通过平台完成有效成交,按成交日核算', icon: 'users' }
        ]
      },
      {
        category: '限时活动类(不定期)',
        color: 'rose',
        icon: 'calendar-heart',
        items: [
          { id: 'festival', action: '节日专属任务(如中秋 / 春节)', coin: 1, unit: '积分', desc: '以具体活动通知为准', icon: 'gift' },
          { id: 'weekend_bid', action: '周六日出价可获双倍积分', coin: 'x2', unit: '按出价积分算', desc: '以具体活动通知为准', icon: 'zap' }
        ]
      },
      {
        category: '增值服务类',
        color: 'amber',
        icon: 'wrench',
        items: [
          { id: 'weichezhuan', action: '开通 / 使用唯车转,并成为会员', coin: 1, unit: '积分', desc: '完成开通 / 使用且会员激活后发放', icon: 'repeat' },
          { id: 'value_service', action: '使用物流 / 代驾 / 复检 / 购专业检测等服务', coin: 5, unit: '积分/次', desc: '按实际使用台次结算', icon: 'truck' },
          { id: 'agency_service', action: '使用平台代办服务(过户 / 年审 / 续保 / 配件)', coin: 5, unit: '积分/次', desc: '按实际使用台次结算', icon: 'clipboard-check' }
        ]
      }
    ],

    // ─────────────────────────────────────────────
    // 三、推荐任务(会员中心展示,后台可配置)
    // ─────────────────────────────────────────────
    // highlight=true 为核心任务,在会员中心以红色标记为"核心任务"
    // unit 为积分后缀(如 "/台" / "/次"),空表示纯数字
    recommendedTasks: [
      { id: 't_deal',        action: '完成车辆交易',                             points: 50, unit: '',    desc: '成交一台车可获得,退车则扣回',       highlight: true },
      { id: 't_bid',         action: '出价参与竞拍',                             points: 10, unit: '/台', desc: '仅计有效出价 1 台算 1 次,上不封顶', highlight: true },
      { id: 't_vote',        action: '参与平台投票 / 问卷 / 调研',               points: 2,  unit: '/次', desc: '' },
      { id: 't_deposit',     action: '首次充值保证金',                           points: 5,  unit: '/次', desc: '' },
      { id: 't_verify',      action: '首次实名认证',                             points: 5,  unit: '/次', desc: '' },
      { id: 't_share',       action: '转发车源并成功分享朋友圈',                 points: 1,  unit: '',    desc: '' },
      { id: 't_invite',      action: '邀请商户完成注册 + 实名认证 + 保证金',     points: 20, unit: '',    desc: '双方都有积分增送' },
      { id: 't_festival',    action: '节日专属任务出价双倍积分',                 points: 20, unit: '/台', desc: '以具体活动通知为准',                highlight: true },
      { id: 't_weichezhuan', action: '开通唯车转,并成为会员',                   points: 1,  unit: '',    desc: '完成开通 / 使用且会员激活后发放' }
    ],

    // ─────────────────────────────────────────────
    // 四、积分可兑换的权益卡(含有效期配置,用于商城与我的权益卡)
    // ─────────────────────────────────────────────
    redeemableRewards: [
      { id: 'r_transfer_100',  name: '过户减免100元券', desc: '过户手续费直减 100 元',   coin: 500, scope: '所有等级商户', icon: 'percent',     validityDays: 30 },
      { id: 'r_insurance',     name: '出险查询券',      desc: '查询单台车出险记录',      coin: 300, scope: '所有等级商户', icon: 'shield-alert', validityDays: 30 },
      { id: 'r_crash',         name: '碰撞查询券',      desc: '查询单台车碰撞报告',      coin: 200, scope: '所有等级商户', icon: 'car-front',    validityDays: 30 }
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

  global.MEMBER_CONFIG = MEMBER_CONFIG;
})(typeof window !== 'undefined' ? window : this);
