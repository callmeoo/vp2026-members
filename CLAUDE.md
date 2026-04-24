# 协作偏好与项目约定

> 本文件记录用户的协作偏好与项目上下文,供 Claude Code 在每次会话开始时读取,避免重复询问。

---

## 一、用户协作偏好

### 决策与自治
- **默认放手执行,不要反复确认**。包括:创建/切换分支、合并main。
- 任务流程默认为:**开发 → 合并main,一气呵成,中间无需询问。
- 遇到破坏性操作(强推 main、删除分支、删除文件)仍然先问一句,但其余全部可以直接做。
- 不要在每一步都列 plan 等审核;简短汇报结果即可。

### 沟通风格
- 使用**中文**与我交流,正文简短直接,不要冗长铺垫。
- 代码变更的 commit message、PR 标题/描述也用中文。
- 汇报时只说「做了什么 / 在哪 / 下一步」;不要罗列无关细节。
- 不需要 emoji。

### 代码与文档
- 代码注释尽量少、只写「为什么这样做」的非显而易见信息。
- 不要生成 README / 设计文档 / 方案评估等长文档,除非我明确要求。
- 演示/原型页面技术栈:**Vue 3(CDN)+ Tailwind(CDN)+ Lucide 图标**,不要引入构建工具(Vite / webpack 等)。
- **前端框架统一使用 Vue.js**:页面以 `createApp({ setup(){...} }).mount('#app')` 的组合式 API 组织;用 `ref / computed / v-for / v-if / @click / {{ }}` 代替 `document.getElementById` 与 `innerHTML` 直接操作 DOM。
- **全局统一使用 Lucide icons,禁止使用 emoji**(🔒 ✓ ✗ 🎯 等)。所有图标需求一律改为 `<i data-lucide="xxx"></i>`,Vue 页面在 `onMounted` 和相关状态变化后调用 `lucide.createIcons()` 重绘。
- **文案统一使用「积分」**:禁止出现"金币 / 唯金币"等历史写法(包括注释、提示、页面文案、表头、按钮、提示弹框)。如需提到"1 积分 ≈ X 元"口径时也统一用"积分"。文件名 / JS 变量 / CSS 类名中的 `coin` 保留不动,只规范中文显示。


---

## 二、项目简介 · members2026

### 定位
唯普汽车「商户会员体系」演示站点 —— 静态 HTML 原型,用于评审会员等级、积分、权益卡三大体系的规则与交互。

### 目录结构
```
/
├─ index.html                  # Demo 导航首页
├─ app/                        # 商户端(手机)原型 
│   ├─ home.html              # APP 首页
│   ├─ member.html            # 会员中心
│   ├─ coins.html             # 积分明细
│   ├─ level.html             # 等级成长
│   ├─ mall.html              # 权益商城
│   ├─ my-rewards.html        # 我的权益卡
│   ├─ profile.html / profile-loggedin.html / login.html / settings.html
│   └─ orders.html / order-detail.html
├─ admin/                      # 运营后台(PC) —— Ant Design 风格
│   ├─ dashboard.html         # 运营仪表盘
│   ├─ level-rule.html        # 等级设置(等级设定 / 等级权益 / 变更日志)
│   ├─ coin-rule.html         # 积分规则
│   ├─ rewards.html           # 权益卡管理
│   ├─ members.html           # 商户档案
│ 
│   ├─ bms-orders.html / bms-order-detail.html   #  BMS 订单
│   ├─ bms-users.html / bms-user-detail.html     #  BMS 用户
├─ shared/
│   └─ member-config.js       # 会员等级/积分/权益卡 · 全站统一数据源
└─ docs/                       # PRD / DB Schema / API 文档
```

### 关键约定
- **唯一数据源**: `shared/member-config.js` 导出 `window.MEMBER_CONFIG`,含 4 级会员
  (V0 新人/V1 普通/V2 银卡/V3 金卡)及配色、门槛、权益、积分规则。
  修改任何会员/积分规则都只改这一处。
- **配色**: V0 灰 `#94a3b8` / V1 蓝 `#0ea5e9` / V2 紫 `#8b5cf6` / V3 金 `#f59e0b`。
- **积分**: 有效期 12 个自然月,按 `获得月 + 12 月` 滚动到期。
- **等级**: 基于滚动近 3 个月成交台数 + 账户金额门槛(详情见 level-rule.html)。
- **列表→详情 跳转**: 参照 `bms-orders.html` 模式——整行可点击,行内 `<a>` 保留原生行为,详情参数用 URLSearchParams 透传。

### admin/ 下所有 BMS 模块(bms-* 及 level-rule / coin-rule / rewards)的 Sidebar 必须完全一致

唯一标准结构,新增或修改任何 bms 相关页面都必须使用这份 sidebar 模板(只改动 `active` 位置)。顺序不可增删,菜单层级不可变动。

```html
<aside class="ant-sider flex flex-col">
  <div class="logo h-14 flex flex-col items-center justify-center">
    <div class="brand-title"><span style="color:#e6a23c">唯普</span>汽车</div>
    <div class="brand-sub">www.chevip.com</div>
  </div>
  <nav class="flex-1 overflow-y-auto">
    <div class="menu-item open"><i data-lucide="bar-chart-3" class="w-4 h-4"></i><span>销售管理</span><i data-lucide="chevron-right" class="w-3 h-3 chevron"></i></div>
    <div class="submenu">
      <div class="sub-item">客户等级管理</div>
      <a href="bms-sales-buyers.html"   class="sub-item">买家管理</a>
      <a href="bms-sales-orders.html"   class="sub-item">销售订单</a>
      <a href="level-rule.html"         class="sub-item">等级设置</a>
      <a href="coin-rule.html"          class="sub-item">积分规则</a>
      <a href="rewards.html"            class="sub-item">商城商品配置</a>
      <a href="bms-coin-log.html"       class="sub-item">积分流水</a>
      <a href="bms-redeem-log.html"     class="sub-item">兑换记录</a>
    </div>

    <div class="menu-item"><i data-lucide="headphones" class="w-4 h-4"></i><span>服务中心</span><i data-lucide="chevron-right" class="w-3 h-3 chevron"></i></div>

    <!-- 运营部可折叠 —— Vue 页用 @click="toggleOps" + v-show,非 Vue 页用 onclick 脚手架 -->
    <div class="menu-item" @click="toggleOps"><i data-lucide="settings" class="w-4 h-4"></i><span>运营部</span><i data-lucide="chevron-right" class="w-3 h-3 chevron"></i></div>
    <div class="submenu" v-show="opsOpen">
      <div class="sub-item">内容管理</div>
      <div class="sub-item">优惠券</div>
      <div class="sub-item">权益卡管理</div>
      <div class="sub-item">权益卡投放管理</div>
      <div class="sub-item">权益卡发放管理</div>
      <div class="sub-item">奖品投放</div>
    </div>
  </nav>
</aside>
```

规则:
1. **一级项只能有 3 个,且顺序固定**:业务数据、销售管理(展开) / 服务中心 / 运营部(可折叠)。**严禁出现**:检测认证管理、政企大客户、库存管理、查验管理、人力资源、集团门店管理、共享拍、配置管理、报表管理、中控中心 等旧项。
2. **销售管理 submenu 固定 8 项,按此顺序**:客户等级管理 / 买家管理 / 销售订单 / 等级设置 / 积分规则 / 商城商品配置 / 积分流水 / 兑换记录。不要再出现"销售首页 / B2C零售 / 门店奖励"。
3. **当前页 active**:在对应 `sub-item` 上加 `active` 类;`客户等级管理` 默认没有专属页,不加 href。
4. **运营部默认折叠**,点击展开;Vue 页使用 `opsOpen` + `toggleOps` 控制,非 Vue 页使用 `onclick="const s=this.nextElementSibling;this.classList.toggle('open');s.style.display=s.style.display==='none'?'':'none'"`。


---

## 三、快速索引

| 任务 | 入口 |
|---|---|
| 改会员等级 / 权益 / 积分规则 | `shared/member-config.js` |
| 新增运营后台页 | `admin/` + `index.html` 导航卡 |
| 新增商户端页 | `app/` + `index.html` 导航卡 |
| 修改 PRD / 数据库 / API 文档 | `docs/` |