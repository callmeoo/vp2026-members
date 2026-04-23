# 协作偏好与项目约定

> 本文件记录用户的协作偏好与项目上下文,供 Claude Code 在每次会话开始时读取,避免重复询问。

---

## 一、用户协作偏好

### 决策与自治
- **默认放手执行,不要反复确认**。包括:创建/切换分支、提交、推送、创建 PR、合并 PR、发布。
- 任务流程默认为:**开发 → 提交 → 推送 → 创建 PR → 合并**,一气呵成,中间无需询问。
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


---

## 二、项目简介 · members2026

### 定位
唯普汽车「商户会员体系」演示站点 —— 静态 HTML 原型,用于评审会员等级、积分(积分)、权益卡三大体系的规则与交互。

### 目录结构
```
/
├─ index.html                  # Demo 导航首页
├─ app/                        # 商户端(手机)原型 —— 紫色"滴滴会员"风格
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
│   ├─ level-rule.html        # 等级规则
│   ├─ coin-rule.html         # 积分规则
│   ├─ rewards.html           # 权益卡管理
│   ├─ members.html           # 商户档案
│ 
│   ├─ bms-orders.html / bms-order-detail.html   # 现网 BMS 订单复刻
│   ├─ bms-users.html / bms-user-detail.html     # 现网 BMS 用户复刻
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


---

## 三、快速索引

| 任务 | 入口 |
|---|---|
| 改会员等级 / 权益 / 积分规则 | `shared/member-config.js` |
| 新增运营后台页 | `admin/` + `index.html` 导航卡 |
| 新增商户端页 | `app/` + `index.html` 导航卡 |
| 修改 PRD / 数据库 / API 文档 | `docs/` |