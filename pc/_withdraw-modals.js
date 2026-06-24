/* PC 公共组件 · 可用余额提现弹框 + 保证金提取弹框
 * 用法:
 *   <script src="_withdraw-modals.js"></script>
 *   ...
 *   <withdraw-balance-modal :visible="showBalance" :show-demo-panel="true" @close="showBalance=false"></withdraw-balance-modal>
 *   <withdraw-deposit-modal :visible="showDeposit" :show-demo-panel="true" @close="showDeposit=false"></withdraw-deposit-modal>
 *
 * 触发逻辑(两个弹框一致):
 *   - V0 用户直接提交,不弹二次确认
 *   - V1-V3 用户且提交后「可维持等级金额」(账户总金额 − 审批中在途出账)<2000 元,弹「确认提现/提取」红色加粗确认
 *     在途出账 = 已发起、审批中、即将离开平台的提现 / 提取微信(pendingOut),不再算作可维持等级的资产
 *   - 提交成功 → 居中黑底 toast「提交申请后,审核预计需10个工作日,审批通过后可到帐您绑定的银行账户」,2.4s 后消失
 *   - 等级读 window.VPUser.get().level,默认 V2(便于评审看触发流程);切换演示面板的等级会写回 vp_user
 */

(function () {
  const LEVELS = [{ code: 'V0' }, { code: 'V1' }, { code: 'V2' }, { code: 'V3' }];

  // 注入一次性公共样式
  function injectStyle() {
    if (document.getElementById('wm-style')) return;
    const css = `
.wm-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-start;justify-content:center;z-index:9000;padding:40px 24px;overflow-y:auto}
.wm-mask.center{align-items:center}
.wm-dlg{background:#fff;border-radius:6px;width:100%;max-width:480px;box-shadow:0 12px 48px rgba(0,0,0,.25);overflow:hidden;font-size:14px;color:#1f2937}
.wm-dlg.narrow{max-width:460px}
.wm-head{background:linear-gradient(180deg,#f56c6c 0%,#e64646 100%);color:#fff;padding:14px 20px;font-size:16px;font-weight:600;text-align:center;position:relative}
.wm-head .close{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:24px;height:24px;cursor:pointer;opacity:.85;display:inline-flex;align-items:center;justify-content:center}
.wm-head .close:hover{opacity:1}
.wm-body{padding:22px 28px 8px}
.wm-row{display:flex;align-items:center;padding:9px 0}
.wm-row .lbl{width:88px;color:#475569;flex-shrink:0;font-size:13.5px}
.wm-row .val{flex:1;color:#1f2937}
.wm-row.input-row{padding:8px 0}
.wm-amount-input{flex:1;border:none;outline:none;border-bottom:1px solid #cbd5e1;padding:6px 0;font-size:14px;color:#1f2937;background:transparent;text-align:right;padding-right:4px}
.wm-amount-input:focus{border-bottom-color:#d12c1f}
.wm-amount-input::placeholder{color:#cbd5e1}
.wm-amount-unit{color:#475569;margin-left:4px;font-size:13.5px}
.wm-remark-input{flex:1;border:none;outline:none;border-bottom:1px solid #cbd5e1;padding:6px 0;font-size:14px;color:#1f2937;background:transparent}
.wm-remark-input:focus{border-bottom-color:#d12c1f}
.wm-remark-input::placeholder{color:#cbd5e1}
.wm-notice{font-size:12.5px;color:#f56c6c;line-height:1.7;padding:10px 0 4px;padding-left:88px}
.wm-foot{display:flex;gap:12px;justify-content:center;padding:14px 28px 22px}
.wm-btn{min-width:84px;height:34px;padding:0 18px;border-radius:4px;font-size:13.5px;border:1px solid #dcdfe6;background:#fff;color:#1f2937;cursor:pointer;transition:all .12s}
.wm-btn:hover{color:#d12c1f;border-color:#fbcccd;background:#fff5f5}
.wm-btn.primary{background:#f56c6c;border-color:#f56c6c;color:#fff}
.wm-btn.primary:hover{background:#e64646;border-color:#e64646;color:#fff}
.wm-btn.disabled,.wm-btn.primary.disabled{background:#fab6b6;border-color:#fab6b6;color:#fff;cursor:not-allowed}
.wm-extract-group{margin-bottom:14px}
.wm-extract-header{display:flex;align-items:center;gap:8px;margin-bottom:6px;padding-left:2px}
.wm-extract-icon{width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
.wm-extract-icon.wechat{background:#22c55e}
.wm-extract-icon.balance{background:#f59e0b}
.wm-extract-label{font-size:14px;color:#1f2937;font-weight:600}
.wm-extract-row{display:flex;align-items:center;padding:11px 4px;border-bottom:1px dashed #ebeef5;cursor:pointer;user-select:none}
.wm-extract-row:last-child{border-bottom:none}
.wm-row-date{font-size:13px;color:#475569;flex:0 0 96px}
.wm-row-amount{font-size:14px;color:#1f2937;flex:1}
.wm-row-fee-tag{color:#94a3b8;font-size:12px;margin-left:2px}
.wm-row-radio{width:16px;height:16px;border-radius:50%;border:1.5px solid #cbd5e1;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center}
.wm-extract-row.checked .wm-row-radio{background:#ef4444;border-color:#ef4444}
.wm-extract-row.checked .wm-row-radio::after{content:'';width:5px;height:5px;background:#fff;border-radius:50%}
.wm-summary{padding:10px 22px 4px;text-align:right}
.wm-summary .fee{font-size:12.5px;color:#94a3b8;margin-bottom:4px}
.wm-summary .fee b{color:#475569}
.wm-summary .total{font-size:14.5px;color:#1f2937}
.wm-summary .total b{color:#ef4444;font-size:20px;font-weight:700;margin:0 2px}
.wm-apply-area{padding:12px 22px 18px}
.wm-btn-apply{width:100%;height:38px;background:linear-gradient(180deg,#f56c6c 0%,#e64646 100%);color:#fff;font-size:14px;font-weight:600;border:none;border-radius:4px;cursor:pointer;transition:all .12s}
.wm-btn-apply:hover{background:linear-gradient(180deg,#e64646 0%,#cf3535 100%)}
.wm-btn-apply.disabled{background:#fab6b6;cursor:not-allowed}
.wm-notice-block{padding:6px 22px 18px;border-top:1px solid #f1f5f9;margin-top:4px}
.wm-notice-title{font-size:13px;color:#1f2937;font-weight:600;margin:8px 0}
.wm-notice-block ol{padding:0;margin:0;list-style:none}
.wm-notice-block li{font-size:12px;color:#64748b;line-height:1.75;margin-bottom:6px}
.wm-alert-card{background:#fff;border-radius:6px;width:100%;max-width:360px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.25)}
.wm-alert-body{padding:26px 26px 18px;text-align:center}
.wm-alert-icon{width:52px;height:52px;border-radius:50%;background:#fef3c7;color:#f59e0b;display:inline-flex;align-items:center;justify-content:center;margin:0 auto 14px}
.wm-alert-title{font-size:16px;font-weight:700;color:#1f2937;margin-bottom:10px}
.wm-alert-desc{font-size:13.5px;color:#475569;line-height:1.75}
.wm-alert-desc b{color:#7c3aed;font-weight:700}
.wm-alert-foot{display:flex;gap:10px;justify-content:center;padding:14px 26px 22px}
.wm-toast{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(15,23,42,.92);color:#fff;padding:14px 22px;border-radius:8px;font-size:14px;z-index:99999;max-width:320px;text-align:center;line-height:1.7}
.wm-demo-panel{background:#fff;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.08);padding:12px 14px;border:1px solid #e2e8f0;width:200px}
.wm-demo-panel+.wm-demo-panel{margin-top:10px}
.wm-demo-title{font-size:11.5px;color:#94a3b8;margin-bottom:8px;display:flex;align-items:center;gap:5px}
.wm-demo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
.wm-demo-btn{padding:5px 8px;border-radius:4px;font-size:11.5px;font-weight:600;background:#f1f5f9;color:#64748b;border:none;cursor:pointer;transition:all .12s}
.wm-demo-btn.active{background:#7c3aed;color:#fff}
.wm-demo-list{display:flex;flex-direction:column;gap:6px}
.wm-demo-hint{font-size:10.5px;color:#94a3b8;margin-top:8px;line-height:1.5}
`;
    const s = document.createElement('style');
    s.id = 'wm-style';
    s.textContent = css;
    document.head.appendChild(s);
  }
  injectStyle();

  function formatCN(num) {
    return Number(num).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // 共用账户数据(scene: 'normal' 正常大额 / 'low' 低余额 / 'pending' 在途出账)
  //   'low'     提现弹框看 availableBalance(2500,输入 ≥501 触发);提取弹框 500 + 列表 = 跌破 2000
  //   'pending' 在途出账场景:账户总额 4000,其中 2000 是审批中(即将出账)的提取微信在途(pendingOut)。
  //             用于验证「再提一笔时要扣掉已在途的钱」——旧口径不提示,新口径提示。
  // pendingOut = 审批中即将离开平台的金额(提现在途 + 提取微信在途),不计入可维持等级的资产。
  function getAccountSnapshot(scene, opts) {
    opts = opts || {};
    if (scene === 'low') {
      return {
        availableBalance: opts.includeDeposits ? 500 : 2500,
        frozenBalance: 0, availableDeposit: 0, frozenDeposit: 0, pendingOut: 0
      };
    }
    if (scene === 'pending') {
      // 提现弹框:可用余额 2000 + 已有 2000 提取微信在途(挂在 frozenDeposit) = 总额 4000
      // 提取弹框:可用余额 0 + 列表待提 2000 + 已有 2000 在途 = 总额 4000(列表金额另算入 accountTotal)
      return {
        availableBalance: opts.includeDeposits ? 0 : 2000,
        frozenBalance: 0, availableDeposit: 0, frozenDeposit: 2000, pendingOut: 2000
      };
    }
    return {
      availableBalance: 139236697.94,
      frozenBalance: 3631.00,
      availableDeposit: 73500.00,
      frozenDeposit: 170500.00,
      pendingOut: 0
    };
  }

  // 保证金提取列表数据
  function getDepositDataset(scene) {
    if (scene === 'low') {
      return {
        wechatDeposits: [
          { id: 'w1', date: '2023-10-07', amount: 1000, fee: 50, checked: false }
        ],
        balanceDeposits: [
          { id: 'b1', date: '2023-10-07', amount: 1000, fee: 0,  checked: false }
        ]
      };
    }
    if (scene === 'pending') {
      // 列表给一笔待提取的微信保证金 2000(默认勾选),配合 snapshot 的 2000 在途出账
      return {
        wechatDeposits: [
          { id: 'w1', date: '2023-10-07', amount: 2000, fee: 0, checked: true }
        ],
        balanceDeposits: []
      };
    }
    return {
      wechatDeposits: [
        { id: 'w1', date: '2023-10-07', amount: 2000, fee: 50, checked: true },
        { id: 'w2', date: '2023-10-07', amount: 2000, fee: 0, checked: true },
        { id: 'w3', date: '2023-10-07', amount: 4000, fee: 50, checked: false }
      ],
      balanceDeposits: [
        { id: 'b1', date: '2023-10-07', amount: 2000, fee: 0, checked: false },
        { id: 'b2', date: '2023-10-07', amount: 10000, fee: 50, checked: true }
      ]
    };
  }

  // ============ 提现弹框 ============
  window.WithdrawBalanceModal = {
    props: {
      visible: { type: Boolean, default: false },
      showDemoPanel: { type: Boolean, default: true }
    },
    emits: ['close'],
    template: `
  <!-- 主弹框 -->
  <div v-if="visible" class="wm-mask center" @click.self="onClose">
    <div class="wm-dlg">
      <div class="wm-head">
        提现
        <span class="close" @click="onClose"><i data-lucide="x" class="w-4 h-4"></i></span>
      </div>
      <div class="wm-body">
        <div class="wm-row"><span class="lbl">到账银行卡</span><span class="val">中信银行(5544****5445)</span></div>
        <div class="wm-row"><span class="lbl">可用余额</span><span class="val">{{ formatCN(account.availableBalance) }}元</span></div>
        <div class="wm-row input-row">
          <span class="lbl">提现金额</span>
          <input v-model="amountInput" type="number" class="wm-amount-input" placeholder="0.00" inputmode="decimal" min="0">
          <span class="wm-amount-unit">元</span>
        </div>
        <div class="wm-notice">注意：提交申请后，审核预计需10个工作日，审批通过后可到帐您绑定的银行账户。</div>
        <div class="wm-row input-row" style="margin-top:4px">
          <span class="lbl">提现备注</span>
          <input v-model="remark" type="text" class="wm-remark-input" placeholder="请输入" maxlength="50">
        </div>
      </div>
      <div class="wm-foot">
        <button :class="['wm-btn primary', canSubmit ? '' : 'disabled']" :disabled="!canSubmit" @click="onSubmitClick">提交</button>
        <button class="wm-btn" @click="onClose">返回</button>
      </div>
    </div>
  </div>
  <!-- 等级保护二次确认 -->
  <div v-if="visible && showLevelModal" class="wm-mask center" style="z-index:9100" @click.self="showLevelModal = false">
    <div class="wm-alert-card">
      <div class="wm-alert-body">
        <div class="wm-alert-icon"><i data-lucide="alert-triangle" class="w-7 h-7"></i></div>
        <div class="wm-alert-title">确认提现</div>
        <div class="wm-alert-desc">
          提现后您的账户总金额将低于 <b>¥2,000</b>，<br>
          下月起您的 <b>{{ userLevel }}</b> 等级与对应权益将自动失效，<br>是否确认提现？
        </div>
      </div>
      <div class="wm-alert-foot">
        <button class="wm-btn" @click="showLevelModal = false">取消</button>
        <button class="wm-btn primary" style="font-weight:700" @click="confirmSubmit">确认提现</button>
      </div>
    </div>
  </div>
  <!-- Demo 切换面板(z 要高于 mask 9000,否则点击被 mask 拦截直接关弹框) -->
  <div v-if="visible && showDemoPanel" class="fixed top-4 right-4" style="z-index:9050">
    <div class="wm-demo-panel">
      <div class="wm-demo-title"><i data-lucide="users" class="w-3 h-3"></i><span>模拟用户等级</span></div>
      <div class="wm-demo-grid">
        <button v-for="lv in LEVELS" :key="lv.code" @click="setLevel(lv.code)"
          :class="['wm-demo-btn', userLevel === lv.code ? 'active' : '']">{{ lv.code }}</button>
      </div>
    </div>
    <div class="wm-demo-panel">
      <div class="wm-demo-title"><i data-lucide="sliders-horizontal" class="w-3 h-3"></i><span>余额场景</span></div>
      <div class="wm-demo-list">
        <button @click="scene = 'normal'" :class="['wm-demo-btn', scene === 'normal' ? 'active' : '']">正常余额</button>
        <button @click="scene = 'low'" :class="['wm-demo-btn', scene === 'low' ? 'active' : '']">低余额(2500元)</button>
        <button @click="scene = 'pending'" :class="['wm-demo-btn', scene === 'pending' ? 'active' : '']">在途出账</button>
      </div>
      <div class="wm-demo-hint" v-if="scene === 'pending'">账户总额 4000(含 2000 提取微信在途)，提现 2000：旧口径剩 2000 不提示；新口径扣在途后为 0，提示</div>
      <div class="wm-demo-hint" v-else>V1-V3 + 输入 ≥ 501 触发等级失效提示</div>
    </div>
  </div>
  <!-- toast -->
  <div v-if="toastMsg" class="wm-toast">{{ toastMsg }}</div>
    `,
    setup(props, { emit }) {
      const { ref, computed, watch, nextTick } = Vue;
      const stored = window.VPUser && window.VPUser.get();
      const userLevel = ref(stored && stored.level ? stored.level : 'V2');
      const scene = ref('normal');
      const account = computed(() => getAccountSnapshot(scene.value));
      const accountTotal = computed(() =>
        account.value.availableBalance + account.value.frozenBalance +
        account.value.availableDeposit + account.value.frozenDeposit
      );

      const amountInput = ref('');
      const remark = ref('');
      const toastMsg = ref('');
      const showLevelModal = ref(false);

      const numAmount = computed(() => parseFloat(amountInput.value) || 0);
      const canSubmit = computed(() => numAmount.value > 0 && numAmount.value <= account.value.availableBalance);

      function needLevelWarning() {
        if (userLevel.value === 'V0') return false;
        // 扣掉审批中、即将出账的在途金额(那笔钱已不属于可维持等级的资产)
        return (accountTotal.value - account.value.pendingOut - numAmount.value) < 2000;
      }
      function setLevel(code) {
        userLevel.value = code;
        if (window.VPUser) window.VPUser.set(code);
      }
      function onClose() {
        amountInput.value = '';
        remark.value = '';
        showLevelModal.value = false;
        emit('close');
      }
      function showToast(msg) {
        toastMsg.value = msg;
        setTimeout(() => { toastMsg.value = ''; }, 2400);
      }
      function onSubmitClick() {
        if (!canSubmit.value) return;
        if (needLevelWarning()) { showLevelModal.value = true; return; }
        doSubmit();
      }
      function confirmSubmit() { showLevelModal.value = false; doSubmit(); }
      function doSubmit() {
        showToast('提交申请后，审核预计需10个工作日，审批通过后可到帐您绑定的银行账户');
        amountInput.value = '';
        remark.value = '';
        emit('close');
      }

      watch(() => props.visible, (v) => { if (v) nextTick(() => window.lucide && lucide.createIcons()); });
      watch([amountInput, toastMsg, showLevelModal, scene, userLevel], () =>
        nextTick(() => window.lucide && lucide.createIcons()));

      return {
        LEVELS, userLevel, scene, account,
        amountInput, remark, toastMsg, canSubmit, showLevelModal,
        formatCN, setLevel, onClose, onSubmitClick, confirmSubmit
      };
    }
  };

  // ============ 保证金提取弹框 ============
  window.WithdrawDepositModal = {
    props: {
      visible: { type: Boolean, default: false },
      showDemoPanel: { type: Boolean, default: true }
    },
    emits: ['close'],
    template: `
  <div v-if="visible" class="wm-mask" @click.self="onClose">
    <div class="wm-dlg narrow">
      <div class="wm-head">
        保证金提取
        <span class="close" @click="onClose"><i data-lucide="x" class="w-4 h-4"></i></span>
      </div>
      <div class="wm-body" style="padding:18px 22px 6px">
        <div v-if="wechatDeposits.length" class="wm-extract-group">
          <div class="wm-extract-header">
            <span class="wm-extract-icon wechat"><i data-lucide="message-circle" class="w-3 h-3"></i></span>
            <span class="wm-extract-label">提取微信</span>
          </div>
          <div>
            <div v-for="d in wechatDeposits" :key="d.id"
                 :class="['wm-extract-row', d.checked ? 'checked' : '']"
                 @click="toggleDeposit(d)">
              <span class="wm-row-date">{{ d.date }}</span>
              <span class="wm-row-amount">{{ d.amount.toLocaleString() }}元 <span class="wm-row-fee-tag">[{{ d.fee ? '含'+d.fee+'元手续费' : '0手续费' }}]</span></span>
              <span class="wm-row-radio"></span>
            </div>
          </div>
        </div>
        <div v-if="balanceDeposits.length" class="wm-extract-group">
          <div class="wm-extract-header">
            <span class="wm-extract-icon balance"><i data-lucide="circle-dollar-sign" class="w-3 h-3"></i></span>
            <span class="wm-extract-label">提取可用余额</span>
          </div>
          <div>
            <div v-for="d in balanceDeposits" :key="d.id"
                 :class="['wm-extract-row', d.checked ? 'checked' : '']"
                 @click="toggleDeposit(d)">
              <span class="wm-row-date">{{ d.date }}</span>
              <span class="wm-row-amount">{{ d.amount.toLocaleString() }}元 <span class="wm-row-fee-tag">[{{ d.fee ? '含'+d.fee+'元手续费' : '0手续费' }}]</span></span>
              <span class="wm-row-radio"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="wm-summary">
        <div class="fee">平台手续费：<b>{{ totalFee }}元</b></div>
        <div class="total">合计：<b>{{ totalAmount.toLocaleString() }}</b> 元</div>
      </div>
      <div class="wm-apply-area">
        <button :class="['wm-btn-apply', canSubmit ? '' : 'disabled']" :disabled="!canSubmit" @click="onSubmitClick">申请提取</button>
      </div>
      <div class="wm-notice-block">
        <div class="wm-notice-title">保证金说明：</div>
        <ol>
          <li>1. 保证金申请提取后，平台将会在 2~4 个工作日内完成打款，若有疑问请咨询在线客服。</li>
          <li>2. 保证金提取仅支持原路提取（即微信充值只能提取至支付时的微信账号，可用余额充值只能提取至可用余额中）。</li>
          <li>3. 保证金提取单笔手续费 50 元，支持批量提取，手续费按 50 元/笔累计，上不封顶。免手续费说明：单笔保证金关联订单已成交，即可免提取手续费（具体请以页面显示金额为准）。</li>
        </ol>
      </div>
    </div>
  </div>
  <div v-if="visible && showLevelModal" class="wm-mask center" style="z-index:9100" @click.self="showLevelModal = false">
    <div class="wm-alert-card">
      <div class="wm-alert-body">
        <div class="wm-alert-icon"><i data-lucide="alert-triangle" class="w-7 h-7"></i></div>
        <div class="wm-alert-title">确认提取</div>
        <div class="wm-alert-desc">
          提取后您的账户总金额将低于 <b>¥2,000</b>，<br>
          下月起您的 <b>{{ userLevel }}</b> 等级与对应权益将自动失效，<br>是否确认提取？
        </div>
      </div>
      <div class="wm-alert-foot">
        <button class="wm-btn" @click="showLevelModal = false">取消</button>
        <button class="wm-btn primary" style="font-weight:700" @click="confirmSubmit">确认提取</button>
      </div>
    </div>
  </div>
  <div v-if="visible && showDemoPanel && !balanceOnlyChecked" class="fixed top-4 right-4" style="z-index:9050">
    <div class="wm-demo-panel">
      <div class="wm-demo-title"><i data-lucide="users" class="w-3 h-3"></i><span>模拟用户等级</span></div>
      <div class="wm-demo-grid">
        <button v-for="lv in LEVELS" :key="lv.code" @click="setLevel(lv.code)"
          :class="['wm-demo-btn', userLevel === lv.code ? 'active' : '']">{{ lv.code }}</button>
      </div>
    </div>
    <div class="wm-demo-panel">
      <div class="wm-demo-title"><i data-lucide="sliders-horizontal" class="w-3 h-3"></i><span>余额场景</span></div>
      <div class="wm-demo-list">
        <button @click="scene = 'normal'" :class="['wm-demo-btn', scene === 'normal' ? 'active' : '']">正常余额</button>
        <button @click="scene = 'low'" :class="['wm-demo-btn', scene === 'low' ? 'active' : '']">低余额场景</button>
        <button @click="scene = 'pending'" :class="['wm-demo-btn', scene === 'pending' ? 'active' : '']">在途出账</button>
      </div>
      <div class="wm-demo-hint" v-if="scene === 'pending'">账户总额 4000(含 2000 提取微信在途)，再提微信 2000：旧口径剩 2000 不提示；新口径扣在途后为 0，提示</div>
      <div class="wm-demo-hint" v-else>勾选「微信」项 + 低余额 即可触发等级提示;<br>纯「可用余额」项不影响账户总额、不弹框</div>
    </div>
  </div>
  <div v-if="toastMsg" class="wm-toast">{{ toastMsg }}</div>
    `,
    setup(props, { emit }) {
      const { ref, computed, watch, nextTick } = Vue;
      const stored = window.VPUser && window.VPUser.get();
      const userLevel = ref(stored && stored.level ? stored.level : 'V2');
      const scene = ref('normal');

      const initial = getDepositDataset('normal');
      const wechatDeposits = ref(initial.wechatDeposits);
      const balanceDeposits = ref(initial.balanceDeposits);

      const account = computed(() => getAccountSnapshot(scene.value, { includeDeposits: true }));
      const allDeposits = computed(() => [...wechatDeposits.value, ...balanceDeposits.value]);
      const availableDepositTotal = computed(() => allDeposits.value.reduce((s, d) => s + d.amount, 0));
      const accountTotal = computed(() =>
        account.value.availableBalance + account.value.frozenBalance +
        availableDepositTotal.value + account.value.frozenDeposit
      );

      watch(scene, (s) => {
        const d = getDepositDataset(s);
        wechatDeposits.value = d.wechatDeposits;
        balanceDeposits.value = d.balanceDeposits;
      });

      const toastMsg = ref('');
      const showLevelModal = ref(false);
      const checkedDeposits = computed(() => allDeposits.value.filter(d => d.checked));
      const totalAmount = computed(() => checkedDeposits.value.reduce((s, d) => s + d.amount, 0));
      const totalFee = computed(() => checkedDeposits.value.reduce((s, d) => s + d.fee, 0));
      const canSubmit = computed(() => checkedDeposits.value.length > 0);
      // 当前选择是否「只勾了可用余额项」(站内转账,不会触发等级失效),此情况下隐藏 demo 演示面板
      const balanceOnlyChecked = computed(() => {
        const w = wechatDeposits.value.some(d => d.checked);
        const b = balanceDeposits.value.some(d => d.checked);
        return b && !w;
      });

      function needLevelWarning() {
        if (userLevel.value === 'V0') return false;
        // 仅微信渠道是真出账(钱离开平台账户),影响账户总额;
        // 提取至可用余额属于站内转账(保证金→可用余额),不影响账户总额、不提示
        const wechatOut = wechatDeposits.value.filter(d => d.checked).reduce((s, d) => s + d.amount, 0);
        if (wechatOut <= 0) return false;
        // 再扣掉已在审批中、即将出账的在途金额
        return (accountTotal.value - account.value.pendingOut - wechatOut) < 2000;
      }
      function toggleDeposit(d) { d.checked = !d.checked; }
      function setLevel(code) {
        userLevel.value = code;
        if (window.VPUser) window.VPUser.set(code);
      }
      function onClose() {
        allDeposits.value.forEach(d => d.checked = false);
        showLevelModal.value = false;
        emit('close');
      }
      function showToast(msg) {
        toastMsg.value = msg;
        setTimeout(() => { toastMsg.value = ''; }, 2400);
      }
      function onSubmitClick() {
        if (!canSubmit.value) return;
        if (needLevelWarning()) { showLevelModal.value = true; return; }
        doSubmit();
      }
      function confirmSubmit() { showLevelModal.value = false; doSubmit(); }
      function doSubmit() {
        showToast('提交申请后，审核预计需10个工作日，审批通过后可到帐您绑定的银行账户');
        allDeposits.value.forEach(d => d.checked = false);
        emit('close');
      }

      watch(() => props.visible, (v) => {
        if (v) {
          // 打开时重置数据集到初始 demo 状态(避免上一次关闭后所有项变成未勾选,demo 看上去废了)
          const d = getDepositDataset(scene.value);
          wechatDeposits.value = d.wechatDeposits;
          balanceDeposits.value = d.balanceDeposits;
          nextTick(() => window.lucide && lucide.createIcons());
        }
      });
      watch([wechatDeposits, balanceDeposits], () => nextTick(() => window.lucide && lucide.createIcons()), { deep: true });
      watch([toastMsg, showLevelModal, scene, userLevel], () =>
        nextTick(() => window.lucide && lucide.createIcons()));

      return {
        LEVELS, userLevel, scene,
        wechatDeposits, balanceDeposits, balanceOnlyChecked,
        toastMsg, totalAmount, totalFee, canSubmit, showLevelModal,
        toggleDeposit, setLevel, onClose, onSubmitClick, confirmSubmit
      };
    }
  };
})();
