/**
 * 推荐任务 · Vue 全局组件(移动端 + PC 端共用)
 *
 * 数据来源:window.MEMBER_CONFIG.recommendedTasks(shared/member-config.js)
 * 使用方式:
 *   1. 页面先引入 shared/member-config.js,再引入本文件
 *   2. createApp(...) 后调用 app.component('recommended-tasks', window.RecommendedTasksComponent)
 *   3. 模板中使用 <recommended-tasks :level="currentLv.short" :platform="'app'" :has-activity="true"></recommended-tasks>
 *
 * Props:
 *   - level: 当前用户等级 short(如 'V0','V1','V2','V3'),用于控制 V0 专属任务显隐
 *   - platform: 'app' | 'pc',决定渲染风格和跳转链接
 *   - hasActivity: Boolean,是否有活动(控制节日任务展示)
 *   - showActivityToggle: Boolean,是否展示活动切换按钮(仅 Demo 用)
 */
(function (global) {
  'use strict';

  // 注入组件样式(仅注入一次)
  if (!document.getElementById('rt-component-styles')) {
    var style = document.createElement('style');
    style.id = 'rt-component-styles';
    style.textContent = [
      '.rt-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #f1f5f9; }',
      '.rt-title { font-size:15px; font-weight:700; color:#1f2937; }',
      '.rt-header-right { display:flex; align-items:center; gap:8px; }',
      '.rt-sub { font-size:11px; color:#94a3b8; }',
      '.rt-toggle-label { font-size:11px; color:#94a3b8; }',
      '.rt-toggle-btn { padding:2px 10px; border-radius:100px; border:1px solid #e9d5ff; background:#faf5ff; color:#7c3aed; font-size:11px; font-weight:500; cursor:pointer; transition:all .12s; }',
      '.rt-toggle-btn.active { background:#7c3aed; border-color:#7c3aed; color:#fff; }',
      '.rt-list { }',
      '.rt-row { display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid #f8fafc; transition:background .1s; }',
      '.rt-row:last-child { border-bottom:none; }',
      '.rt-row:hover { background:#fafafa; }',
      '.rt-row-body { flex:1; min-width:0; }',
      '.rt-task-name { font-size:14px; font-weight:700; color:#1f2937; line-height:1.4; }',
      '.rt-task-meta { display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-top:4px; font-size:12px; color:#94a3b8; }',
      '.rt-pts { font-weight:700; }',
      '.rt-pts-normal { color:#7c3aed; }',
      '.rt-pts-highlight { color:#ef4444; }',
      '.rt-activity-badge { display:inline-flex; align-items:center; gap:4px; color:#ef4444; font-weight:600; }',
      '.rt-btn { flex-shrink:0; padding:6px 18px; border-radius:100px; font-size:13px; font-weight:600; cursor:pointer; border:none; white-space:nowrap; text-decoration:none; display:inline-block; text-align:center; }',
      '.rt-btn-go { background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; }',
      '.rt-btn-go:hover { opacity:.88; }',
      '.rt-btn-pending { background:#f1f5f9; color:#94a3b8; cursor:not-allowed; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  var PENDING_TASKS = ['t_vote'];
  // 一次性任务:Mock 完成后不再展示(评审用 demo toggle 可切换)
  var ONCE_TASKS = ['t_verify', 't_deposit'];

  // 根据平台决定跳转链接
  function getTaskHref(taskId, platform) {
    if (PENDING_TASKS.indexOf(taskId) >= 0) return null;
    if (platform === 'pc') return 'sources.html';
    // app 端
    var ALLCARS_TASKS = ['t_deal', 't_bid', 't_share', 't_festival'];
    if (ALLCARS_TASKS.indexOf(taskId) >= 0) return 'allcars.html';
    if (ONCE_TASKS.indexOf(taskId) >= 0) return 'allcars.html';
    return null;
  }

  global.RecommendedTasksComponent = {
    name: 'RecommendedTasks',
    props: {
      level: { type: String, default: 'V0' },
      platform: { type: String, default: 'app' },
      hasActivity: { type: Boolean, default: true },
      showActivityToggle: { type: Boolean, default: false }
    },
    emits: ['update:hasActivity'],
    data: function () {
      // Mock:首次任务的完成状态。默认两个都未完成,都展示。
      // 评审用 demo toggle 可一键切换为「已完成」,完成后两个任务从列表消失。
      return {
        onceCompleted: { t_verify: false, t_deposit: false }
      };
    },
    template: [
      '<div class="recommended-tasks-wrap">',
      '  <!-- 标题栏 -->',
      '  <div class="rt-header">',
      '    <span class="rt-title">推荐任务</span>',
      '    <div class="rt-header-right">',
      '      <template v-if="showActivityToggle">',
      '        <span class="rt-toggle-label">演示状态:</span>',
      '        <button @click="$emit(\'update:hasActivity\', true)"',
      '          :class="[\'rt-toggle-btn\', hasActivity ? \'active\' : \'\']">有活动</button>',
      '        <button @click="$emit(\'update:hasActivity\', false)"',
      '          :class="[\'rt-toggle-btn\', !hasActivity ? \'active\' : \'\']">无活动</button>',
      '        <span class="rt-toggle-label" style="margin-left:6px">首次任务:</span>',
      '        <button @click="setOnce(false)"',
      '          :class="[\'rt-toggle-btn\', !allOnceDone ? \'active\' : \'\']">未完成</button>',
      '        <button @click="setOnce(true)"',
      '          :class="[\'rt-toggle-btn\', allOnceDone ? \'active\' : \'\']">已完成</button>',
      '      </template>',
      '      <span class="rt-sub">完成任务获积分</span>',
      '    </div>',
      '  </div>',
      '  <!-- 任务列表 -->',
      '  <div class="rt-list">',
      '    <div v-for="t in visibleTasks" :key="t.id" class="rt-row">',
      '      <div class="rt-row-body">',
      '        <div class="rt-task-name">{{ t.action }}</div>',
      '        <!-- 活动专属任务 -->',
      '        <template v-if="t.id === \'t_festival\'">',
      '          <div v-if="hasActivity" class="rt-task-meta">',
      '            <span class="rt-activity-badge">',
      '              <i data-lucide="calendar-heart" class="w-3.5 h-3.5"></i>2026.10.1 - 10.7',
      '            </span>',
      '            <span>出价 <span class="rt-pts rt-pts-highlight">2 倍</span>积分</span>',
      '            <span>成交 <span class="rt-pts rt-pts-highlight">3 倍</span>积分</span>',
      '          </div>',
      '          <div v-else class="rt-task-meta">',
      '            <span>以具体活动为准,敬请期待</span>',
      '          </div>',
      '        </template>',
      '        <!-- 其他任务 -->',
      '        <div v-else class="rt-task-meta">',
      '          <span>积分 <span class="rt-pts" :class="t.highlight ? \'rt-pts-highlight\' : \'rt-pts-normal\'">+{{ t.points }}{{ t.unit }}</span></span>',
      '          <span v-if="t.dailyMax">日上限 <span class="rt-pts rt-pts-normal">{{ t.dailyMax }} 积分</span></span>',
      '          <span v-if="t.desc">{{ t.desc }}</span>',
      '        </div>',
      '      </div>',
      '      <a v-if="taskAction(t).href" :href="taskAction(t).href"',
      '         class="rt-btn rt-btn-go">{{ taskAction(t).label }}</a>',
      '      <button v-else-if="taskAction(t).label === \'敬请期待\'" disabled',
      '         class="rt-btn rt-btn-pending">{{ taskAction(t).label }}</button>',
      '      <button v-else class="rt-btn rt-btn-go">{{ taskAction(t).label }}</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    computed: {
      visibleTasks: function () {
        var cfg = global.MEMBER_CONFIG;
        if (!cfg || !cfg.recommendedTasks) return [];
        var once = this.onceCompleted;
        return cfg.recommendedTasks.filter(function (t) {
          // 一次性任务(首次实名/首充):完成后不再展示
          if (t.once && once[t.id]) return false;
          return true;
        });
      },
      allOnceDone: function () {
        return !!this.onceCompleted.t_verify && !!this.onceCompleted.t_deposit;
      }
    },
    methods: {
      setOnce: function (done) {
        this.onceCompleted = { t_verify: done, t_deposit: done };
      },
      taskAction: function (t) {
        if (t.id === 't_festival') {
          if (this.hasActivity) {
            return { href: this.platform === 'pc' ? 'sources.html' : 'allcars.html', label: '去完成' };
          }
          return { href: null, label: '敬请期待' };
        }
        var href = getTaskHref(t.id, this.platform);
        if (href) return { href: href, label: '去完成' };
        if (PENDING_TASKS.indexOf(t.id) >= 0) return { href: null, label: '敬请期待' };
        return { href: null, label: '去完成' };
      }
    },
    mounted: function () {
      if (global.lucide) global.lucide.createIcons();
    },
    updated: function () {
      var self = this;
      setTimeout(function () { if (global.lucide) global.lucide.createIcons(); }, 0);
    }
  };
})(typeof window !== 'undefined' ? window : this);
