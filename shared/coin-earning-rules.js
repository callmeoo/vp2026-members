/**
 * 积分获取规则 · Vue 全局组件
 *
 * 数据来源:window.MEMBER_CONFIG.coinEarning(shared/member-config.js)
 * 使用方式:
 *   1. 页面先引入 shared/member-config.js,再引入本文件
 *   2. createApp(...) 后调用 app.component('coin-earning-rules', window.CoinEarningRulesComponent)
 *   3. 模板中使用 <coin-earning-rules></coin-earning-rules>
 */
(function (global) {
  'use strict';

  global.CoinEarningRulesComponent = {
    name: 'CoinEarningRules',
    template: [
      '<div class="overflow-x-auto rounded-lg border border-slate-200">',
      '  <table class="w-full text-[11px] text-left border-collapse">',
      '    <thead class="bg-slate-50 text-slate-600">',
      '      <tr>',
      '        <th class="py-2 px-2 font-semibold text-left">获取方式</th>',
      '        <th class="py-2 px-2 font-semibold text-center whitespace-nowrap">积分值</th>',
      '      </tr>',
      '    </thead>',
      '    <tbody class="bg-white">',
      '      <tr v-for="it in items" :key="it.action" class="border-t border-slate-100 align-top">',
      '        <td class="py-2 px-2 text-slate-800 font-medium leading-snug">{{ it.action }}</td>',
      '        <td class="py-2 px-2 text-center whitespace-nowrap">',
      '          <div class="text-sm font-bold text-amber-600">+{{ it.coin }}</div>',
      '          <div class="text-[9px] text-slate-400">{{ it.unit }}</div>',
      '        </td>',
      '      </tr>',
      '    </tbody>',
      '  </table>',
      '</div>'
    ].join('\n'),
    computed: {
      items: function () {
        var cfg = global.MEMBER_CONFIG;
        if (!cfg || !cfg.coinEarning) return [];
        return cfg.coinEarning.reduce(function (acc, g) {
          return acc.concat(g.items);
        }, []);
      }
    }
  };
})(typeof window !== 'undefined' ? window : this);
