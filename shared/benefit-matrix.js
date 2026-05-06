/**
 * 会员权益对比矩阵 · Vue 全局组件(移动端 + PC 端共用)
 *
 * 数据来源:window.MEMBER_CONFIG.levels[].benefits(shared/member-config.js)
 * 使用方式:
 *   1. 页面先引入 shared/member-config.js,再引入本文件
 *   2. createApp(...) 后调用 app.component('benefit-matrix', window.BenefitMatrixComponent)
 *   3. 模板中使用 <benefit-matrix></benefit-matrix>
 *
 * 权益类目顺序:历史数据查询 → 保留价查询 → 专属销售顾问 → 1V1专属客服 → 积分兑换折扣 → 无理由退车
 */
(function (global) {
  'use strict';

  function discountOf(lv) {
    var b = (lv.benefits || []).find(function (x) { return x.id && x.id.indexOf('coin_exchange_') === 0; });
    if (!b) return '1:1';
    if (b.id === 'coin_exchange_80') return '8 折';
    if (b.id === 'coin_exchange_95') return '95 折';
    return '1:1';
  }

  function tickClass(lvShort) {
    if (lvShort === 'V3') return 'bm-tick-v3';
    if (lvShort === 'V2') return 'bm-tick-v2';
    if (lvShort === 'V1') return 'bm-tick-v1';
    return 'bm-tick-v0';
  }

  function hasBenefit(lv, id) {
    return !!(lv.benefits || []).find(function (b) { return b.id === id; });
  }

  // 注入组件样式(仅注入一次)
  if (!document.getElementById('bm-component-styles')) {
    var style = document.createElement('style');
    style.id = 'bm-component-styles';
    style.textContent = [
      '.bm-wrap { border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; background:#fff; }',
      '.bm-header { display:grid; background:linear-gradient(135deg,#7c3aed 0%,#8b5cf6 100%); color:#fff; font-weight:600; font-size:14px; }',
      '.bm-header .bm-cell { padding:12px 6px; text-align:center; }',
      '.bm-header .bm-cell:first-child { text-align:left; padding-left:14px; }',
      '.bm-row { display:grid; border-bottom:1px solid #f1f5f9; }',
      '.bm-row:last-child { border-bottom:none; }',
      '.bm-row:nth-child(even) { background:#f8fafc; }',
      '.bm-cell { padding:13px 6px; text-align:center; font-size:14px; line-height:1.4; }',
      '.bm-cell:first-child { text-align:left; padding-left:14px; font-weight:500; color:#334155; }',
      '.bm-tick-v3 { color:#f59e0b; font-weight:700; }',
      '.bm-tick-v2 { color:#8b5cf6; font-weight:700; }',
      '.bm-tick-v1 { color:#0ea5e9; font-weight:700; }',
      '.bm-tick-v0 { color:#64748b; font-weight:600; }',
      '.bm-dash { color:#d1d5db; }',
      '.bm-check { display:inline-block; width:16px; height:16px; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  global.BenefitMatrixComponent = {
    name: 'BenefitMatrix',
    template: [
      '<div class="bm-wrap">',
      '  <div class="bm-header" style="grid-template-columns:1.3fr repeat(4,1fr)">',
      '    <div class="bm-cell">权益类目</div>',
      '    <div v-for="lv in levels" :key="lv.code" class="bm-cell">{{ lv.short }}<br>{{ lv.name }}</div>',
      '  </div>',
      '  <div v-for="(row, i) in rows" :key="i" class="bm-row" style="grid-template-columns:1.3fr repeat(4,1fr)">',
      '    <div class="bm-cell">{{ row.label }}</div>',
      '    <div v-for="(v, j) in row.values" :key="j" class="bm-cell" v-html="v"></div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    computed: {
      levels: function () {
        var cfg = global.MEMBER_CONFIG;
        return cfg && cfg.levels ? cfg.levels : [];
      },
      rows: function () {
        var cfg = global.MEMBER_CONFIG;
        if (!cfg || !cfg.levels) return [];
        var levels = cfg.levels;
        var check = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bm-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        var dash = '<span class="bm-dash">—</span>';

        function cellFor(lv, id, text) {
          if (!hasBenefit(lv, id)) return dash;
          return '<span class="' + tickClass(lv.short) + '">' + (text || check) + '</span>';
        }

        var matrixDefs = [
          { label: '历史数据查询', render: function (lv) { return cellFor(lv, 'history_data'); } },
          { label: '保留价查询',   render: function (lv) { return cellFor(lv, 'reserve_price'); } },
          { label: '专属销售顾问', render: function (lv) { return cellFor(lv, 'sales_advisor'); } },
          { label: '1V1 专属客服', render: function (lv) { return cellFor(lv, 'service_1v1'); } },
          { label: '积分兑换折扣', render: function (lv) { return '<span class="' + tickClass(lv.short) + '">' + discountOf(lv) + '</span>'; } },
          { label: '无理由退车',   render: function (lv) { return cellFor(lv, 'refund_1', '1 台'); } }
        ];

        return matrixDefs.map(function (d) {
          return { label: d.label, values: levels.map(function (lv) { return d.render(lv); }) };
        });
      }
    }
  };
})(typeof window !== 'undefined' ? window : this);
