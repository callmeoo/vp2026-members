/**
 * 推荐任务 · Vue 全局组件(移动端 + PC 端共用)
 *
 * 数据来源：window.MEMBER_CONFIG.recommendedTasks(shared/member-config.js)
 *
 * Props:
 *   - level: 当前用户等级 short(V0~V3)
 *   - platform: 'app' | 'pc'，决定渲染风格和跳转链接
 *   - isLogin: Boolean，是否已登录(默认 true)
 *   - hasActivity: Boolean，是否有限时活动
 *   - verifyDone: Boolean，是否已完成首次实名认证
 *   - depositDone: Boolean，是否已完成首充保证金
 *   - voteDone: Boolean，是否已完成调研问卷
 *
 * 统一跳转规则：
 *   - t_deal / t_bid / t_festival(有活动): 不论是否登录 → 全部车源(allcars.html / sources.html)
 *   - t_verify:  未登录 → login.html(登录后跳实名认证页)；已登录 → 实名认证页(verify.html)
 *   - t_deposit: 未登录 → login.html(登录后判断实名)；已登录 · 已实名 → 充值页(recharge.html)；已登录 · 未实名 → toast「请先完成实名认证」
 *   - t_vote: 未登录 → login.html(登录后跳调研问卷页)；已登录 → 调研问卷页(survey.html)。提交后由调研页负责回跳至个人中心(profile-loggedin.html / pc:member.html)
 *   - t_festival(无活动): 按钮置灰为「敬请期待」，不可点击
 */
(function (global) {
  'use strict';

  if (!document.getElementById('rt-component-styles')) {
    var style = document.createElement('style');
    style.id = 'rt-component-styles';
    style.textContent = [
      '.rt-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #f1f5f9; }',
      '.rt-title { font-size:15px; font-weight:700; color:#1f2937; }',
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
      '.rt-btn { flex-shrink:0; padding:6px 18px; border-radius:100px; font-size:13px; font-weight:600; cursor:pointer; border:none; white-space:nowrap; text-align:center; }',
      '.rt-btn-go { background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; }',
      '.rt-btn-go:hover { opacity:.88; }',
      '.rt-btn-pending { background:#f1f5f9; color:#94a3b8; cursor:not-allowed; }',
      '.rt-toast { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); background:rgba(15,23,42,.92); color:#fff; padding:10px 20px; border-radius:8px; font-size:14px; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,.25); }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // 跳转目标(已登录态)
  var TARGETS = {
    allcars:  { app: 'allcars.html',  pc: 'sources.html' },
    verify:   { app: 'verify.html',   pc: 'verify.html'  },
    recharge: { app: 'recharge.html', pc: 'recharge.html' },
    survey:   { app: 'survey.html',   pc: 'survey.html' },
    login:    { app: 'login.html',    pc: 'login.html' }
  };

  global.RecommendedTasksComponent = {
    name: 'RecommendedTasks',
    props: {
      level:       { type: String,  default: 'V0' },
      platform:    { type: String,  default: 'app' },
      isLogin:     { type: Boolean, default: true },
      hasActivity: { type: Boolean, default: true },
      verifyDone:  { type: Boolean, default: false },
      depositDone: { type: Boolean, default: false },
      voteDone:    { type: Boolean, default: false }
    },
    data: function () {
      return { toastMsg: '' };
    },
    template: [
      '<div class="recommended-tasks-wrap">',
      '  <div class="rt-header"><span class="rt-title">推荐任务</span></div>',
      '  <div class="rt-list">',
      '    <div v-for="t in visibleTasks" :key="t.id" class="rt-row">',
      '      <div class="rt-row-body">',
      '        <div class="rt-task-name">{{ t.action }}</div>',
      '        <template v-if="t.id === \'t_festival\'">',
      '          <div v-if="hasActivity" style="margin-top:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 12px;font-size:12px;line-height:1.9;color:#92400e">',
      '            <div><span style="color:#b45309;font-weight:600">活动名称：</span>{{ t.activityName }}</div>',
      '            <div><span style="color:#b45309;font-weight:600">活动时间：</span>{{ t.activityPeriod }}</div>',
      '            <div><span style="color:#b45309;font-weight:600">活动内容：</span>{{ t.activityDesc }}</div>',
      '          </div>',
      '          <div v-if="!hasActivity" class="rt-task-meta"><span>以具体活动为准，敬请期待</span></div>',
      '        </template>',
      '        <div v-else class="rt-task-meta">',
      '          <span>积分 <span class="rt-pts" :class="t.highlight ? \'rt-pts-highlight\' : \'rt-pts-normal\'">+{{ t.points }}{{ t.unit }}</span></span>',
      '          <span v-if="t.dailyMax">日上限 <span class="rt-pts rt-pts-normal">{{ t.dailyMax }} 积分</span></span>',
      '          <span v-if="t.desc">{{ t.desc }}</span>',
      '        </div>',
      '      </div>',
      '      <button v-if="taskAction(t).pending" disabled class="rt-btn rt-btn-pending">敬请期待</button>',
      '      <button v-else class="rt-btn rt-btn-go" @click="handleClick(t)">去完成</button>',
      '    </div>',
      '  </div>',
      '  <div v-if="toastMsg" class="rt-toast">{{ toastMsg }}</div>',
      '</div>'
    ].join('\n'),
    computed: {
      visibleTasks: function () {
        var cfg = global.MEMBER_CONFIG;
        if (!cfg || !cfg.recommendedTasks) return [];
        var self = this;
        return cfg.recommendedTasks.filter(function (t) {
          if (t.id === 't_verify'  && self.verifyDone)  return false;
          if (t.id === 't_deposit' && self.depositDone) return false;
          if (t.id === 't_vote'    && self.voteDone)    return false;
          return true;
        });
      }
    },
    methods: {
      // 标记任务是否为「敬请期待」(置灰按钮)
      taskAction: function (t) {
        if (t.id === 't_festival' && !this.hasActivity) return { pending: true };
        return { pending: false };
      },
      // 统一跳转 / toast 逻辑
      handleClick: function (t) {
        // 实名认证： 未登录先去登录，登录后才能进认证页
        if (t.id === 't_verify') {
          if (!this.isLogin) { this.go(TARGETS.login); return; }
          this.go(TARGETS.verify);
          return;
        }
        // 首充保证金： 未登录先去登录；已登录但未实名 toast；已实名跳充值
        if (t.id === 't_deposit') {
          if (!this.isLogin) { this.go(TARGETS.login); return; }
          if (!this.verifyDone) { this.showToast('请先完成实名认证'); return; }
          this.go(TARGETS.recharge);
          return;
        }
        // 调研问卷： 未登录先去登录，登录后进调研页(提交后由调研页回跳个人中心)
        if (t.id === 't_vote') {
          if (!this.isLogin) { this.go(TARGETS.login); return; }
          this.go(TARGETS.survey);
          return;
        }
        // 成交 / 出价 / 活动专属(有活动): 不论是否登录 → 全部车源
        this.go(TARGETS.allcars);
      },
      go: function (target) {
        var url = target[this.platform] || target.app;
        window.location.href = url;
      },
      showToast: function (msg) {
        var self = this;
        this.toastMsg = msg;
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(function () { self.toastMsg = ''; }, 2000);
      }
    },
    mounted: function () { if (global.lucide) global.lucide.createIcons(); },
    updated: function () {
      setTimeout(function () { if (global.lucide) global.lucide.createIcons(); }, 0);
    }
  };
})(typeof window !== 'undefined' ? window : this);
