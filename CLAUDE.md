# 协作偏好与项目约定

> 本文件记录用户的协作偏好与项目上下文，供 Claude Code 在每次会话开始时读取，避免重复询问。

---

## 一、用户协作偏好

### 决策与自治
- **默认放手执行，不要反复确认**。包括：创建/切换分支、合并 main、本地 commit。
- 任务流程默认为：**开发 → 本地 commit**，完成即可，**不要自动 push 到 GitHub**。
- **GitHub 推送必须由用户显式触发**(例如「推一下」「push 到 github」「现在可以推了」)。
  原因：高频推送会触发 GitHub 风控，导致账号被封。多次本地改动累积后，由用户一次性下达推送指令再 push。
- 同理，**不要自动合并 main**(本仓库主分支直推，无 feature branch)，也避免在未推送前做远程操作。
- 遇到破坏性操作(强推 main、删除分支、删除文件)仍然先问一句，其余全部可以直接做。
- 不要在每一步都列 plan 等审核;简短汇报结果即可。

### 沟通风格
- 使用**中文**与我交流，正文简短直接，不要冗长铺垫。
- 代码变更的 commit message、PR 标题/描述也用中文。
- 汇报时只说「做了什么 / 在哪 / 下一步」;不要罗列无关细节。
- 不需要 emoji。

### 代码与文档
- 代码注释尽量少、只写「为什么这样做」的非显而易见信息。
- 不要生成 README / 设计文档 / 方案评估等长文档，除非我明确要求。
- 演示/原型页面技术栈：**Vue 3(CDN)+ Tailwind(CDN)+ Lucide 图标**，不要引入构建工具(Vite / webpack 等)。
- **前端框架统一使用 Vue.js**:页面以 `createApp({ setup(){...} }).mount('#app')` 的组合式 API 组织;用 `ref / computed / v-for / v-if / @click / {{ }}` 代替 `document.getElementById` 与 `innerHTML` 直接操作 DOM。
- **全局统一使用 Lucide icons，禁止使用 emoji**(🔒 ✓ ✗ 🎯 等)。所有图标需求一律改为 `<i data-lucide="xxx"></i>`,Vue 页面在 `onMounted` 和相关状态变化后调用 `lucide.createIcons()` 重绘。
- **文案统一使用「积分」**:禁止出现"金币 / 唯金币"等历史写法(包括注释、提示、页面文案、表头、按钮、提示弹框)。如需提到"1 积分 ≈ X 元"口径时也统一用"积分"。文件名 / JS 变量 / CSS 类名中的 `coin` 保留不动，只规范中文显示。
- **「商品」替代「权益卡」(UI 用词)**:用户面向的列名 / 弹窗标题 / 兑换按钮统一用「商品 / 商品兑换记录 / 商品名称」(因商城品类已扩展到优惠券、服务费券等，不只是权益卡)。`docs/PRD.md` 与 `redeemableRewards` 数据结构里的「权益卡」术语保留(产品定义未变)，只规范前端中文显示。

### Lucide 图标 + Vue @click 陷阱(踩过多次，务必遵守)
**`@click` 不要直接绑在 `<i data-lucide="xxx">` 上**——`lucide.createIcons()` 会用 `<svg>` 替换 `<i>` 元素，绑在原 `<i>` 上的 Vue 事件随之销毁，表现就是按钮"点了没反应"。

正确写法：把事件绑到外层 `<span>` / `<button>` 等不会被替换的元素：
```html
<!-- 错误 -->
<i data-lucide="x" @click="close"></i>
<!-- 正确 -->
<span class="cursor-pointer" @click="close"><i data-lucide="x"></i></span>
```

**多层嵌套时仍点不到 → 兜底**:外层 row 上绑 `@click`，但 row 内部嵌套了多个 svg / span / 文本，点击有时穿透不到 row 自身。给 row 加 `pointer-events: none` 到所有直接子元素，强制点击命中 row:
```css
.row { cursor: pointer; }
.row > * { pointer-events: none; }   /* 子元素不接收事件，直接冒泡到 row */
```
参考案例：`app/aftersale-apply.html` 的 `.benefit-row`。

---

## 二、项目简介 · members2026

### 定位
唯普汽车「商户会员体系」演示站点 —— 静态 HTML 原型，用于评审会员等级、积分、商品(权益卡/优惠券)三大体系的规则与交互。当前演示包含 **商户端(APP/小程序 + PC)**、**BMS 后台**、**FNC 后台** 三套界面。

远程仓库： `git@github.com:callmeoo/vp2026-members.git` (main 直推)。

### 目录结构
```
/
├─ index.html                  # Demo 导航首页 + 需求说明 + Word 内联展示
├─ app/                        # 商户端(手机) 原型
│   ├─ home.html / landing.html / member.html / coins.html / level.html
│   ├─ mall.html / my-rewards.html / coupons.html
│   ├─ profile.html / profile-loggedin.html / login.html / settings.html
│   ├─ orders.html / won-order(s)* / order-detail.html
│   ├─ car-detail.html / car-detail-reserve.html / car-bid.html / maintenance-query.html
│   ├─ allcars.html / all-cars.html / splash.html / recharge.html
│   ├─ survey.html            # 调研问卷(登录后从「推荐任务」进入,单次提交)
│   ├─ aftersale-apply.html   # 售后申请(含「无理由退车」勾选 + 24h 演示切换)
│   └─ aftersale-approval-list.html / aftersale-approval-detail.html
├─ pc/                         # 商户端(PC)原型
│   ├─ home.html / sources.html / reserved.html / auction.html / special.html
│   ├─ car-detail.html        # 含保留价/历史成交行情积分兑换闭环
│   ├─ member.html / member-intro.html / coins.html / mall.html / orders.html
│   ├─ card-pack.html         # 我的卡包(权益+优惠券)
│   ├─ recharge.html / survey.html
│   └─ common.css / _partials.js
├─ admin/                      # BMS / FNC 后台 — Ant Design 风格
│   ├─ _sidebar-alert.js      # 通用居中弹框 showRuleAlert(替代浏览器 alert)
│   ├─ dashboard.html / level-rule.html(隐藏) / coin-rule.html / rewards.html / members.html
│   ├─ bms-orders.html / bms-order-detail.html / order-detail.html       # 订单
│   ├─ bms-users.html / bms-user-detail.html                              # 用户
│   ├─ bms-sales-buyers.html / bms-sales-buyer-detail.html                # 买家
│   ├─ bms-sales-orders.html / sales-orders.html                          # 销售订单
│   ├─ bms-level-mgmt.html / bms-coin-log.html / bms-redeem-log.html      # 等级/积分
│   ├─ bms-survey.html        # 调研问卷结果(按 surveyId 聚合统计 + CSV 导出)
│   ├─ bms-coupons.html       # 运营部 · 优惠券(派发/类型/来源管理)
│   ├─ bms-aftersales*.html / bms-aftersale-approval-list.html            # 售后/审批
│   └─ fnc-home.html / fnc-wallet-log.html                                # FNC 后台
├─ shared/                     # 全站共享数据源 + 逻辑模块
│   ├─ member-config.js       # 会员/积分/Q&A/推荐任务 配置(window.MEMBER_CONFIG)
│   ├─ survey-config.js       # 调研问卷库(window.SURVEY_CONFIGS / SURVEY_CONFIG)
│   ├─ reserve-cars.js        # 有保留价车源列表 + window.VPUser 登录态
│   ├─ reserve-price-logic.js # 保留价/历史成交价兑换共享逻辑(ReservePriceLogic / HistoryPriceLogic)
│   ├─ recommended-tasks.js   # 推荐任务 Vue 全局组件(t_vote 跳 survey.html)
│   ├─ coin-earning-rules.js  # 积分获取规则展示
│   └─ benefit-matrix.js      # 权益矩阵渲染
└─ docs/                       # PRD / DB Schema / API 文档(原型阶段不维护)
```

### 关键约定

#### 数据层
- **`shared/member-config.js` → `window.MEMBER_CONFIG`**(会员/积分/Q&A 主配置):
  - `levels` — 4 级会员(V0 普通/V1 金卡/V2 白金/V3 钻石)，含配色/门槛/权益清单
  - `coin` — 积分单价、有效期
  - `coinEarning` — 积分获取规则(用于规则展示)
  - `recommendedTasks` — 推荐任务(含 `dailyMax`，`t_vote` 跳 `survey.html`)
  - `redeemableRewards` — 商城商品/权益卡
  - `qaList` — Q&A 常见问题(app/landing.html 与 pc/member-intro.html 共用，改这里两端同步)
- **`shared/survey-config.js` → `window.SURVEY_CONFIGS` / `SURVEY_CONFIG`**:调研问卷库,active 标记当前对外发放的问卷;`SURVEY_CONFIG` = active 一份,`SURVEY_CONFIGS` 是全部历史问卷数组(BMS 后台用)。题目支持 `single / multi / text` 三种题型,扩展字段(详见文件顶部注释):
  - `followUp.tagsByOption`(single) / `followUp.tags`(multi) — 选完后展开 chip 标签 + 补充文本框
  - `followUp.triggerOptions:['其他']`(multi) — 仅勾选指定选项时才展开补充框(用于「其他」补充场景,模板层自动隐藏 hint 提示行,只留输入框)
  - `text` 题加 `fields:[{key,label,placeholder,maxLength}]` 渲染为多字段并排填空(如「商户信息」题),`answers[qi]` 是 `{[key]:value}` 对象;模板层 `text` 类一律不显示右上「简述」标签
  - 题级 `hideTypeTag:true` 隐藏类型标签 / `hint:'...'` 在题面下方展示一段引导文案(紫色左边线提示卡)
- **`shared/reserve-price-logic.js`**:导出 `ReservePriceLogic` (50 积分 / V2+ 免费) + `HistoryPriceLogic` (100 积分 / V1+ 免费),两者同形,API:`canView(levelCode, carId)` / `getCoins()` / `exchange(carId, carTitle)` / `getUnlockedIds()`。
- **`shared/recommended-tasks.js`**:推荐任务 Vue 全局组件 `RecommendedTasksComponent`,处理 t_verify / t_deposit / t_vote 的登录拦截 + 跳转。
- **配色**(按 V 编号位置固定，与等级名解耦): V0 灰 `#94a3b8` / V1 蓝 `#0ea5e9` / V2 紫 `#8b5cf6` / V3 金 `#f59e0b`
- **积分**: 1 积分 = 0.1 元;有效期 12 个自然月，按 `获得月 + 12 月` 滚动到期
- **等级门槛**: V0 帐户 < 2000 且近 3 月无成交 / V1 ≥ 2000 且 1-3 台 / V2 ≥ 2000 且 4-14 台 / V3 ≥ 2000 且 ≥ 15 台

#### 业务规则
- **「无理由退车」权益**: V3 钻石专享，**车辆中标后 24 小时内可申请**，超时即使有权益也无法使用。所有相关页面(BMS 申请售后、APP/PC 售后申请)都需要在 UI 显示这个有效期，且支持「未超期 / 超 24h」演示切换。
- **保留价查询权益**:V1/V2/V3 直接查看;仅 V0 消耗 50 积分对单车兑换,有效期内反复查看。pc/car-detail.html + app/car-detail-reserve.html 入口。
- **历史成交行情权益**:V1/V2/V3 直接查看;V0 消耗 100 积分对单车兑换,有效期内反复查看。**仅车辆详情页有入口,出价页 (car-bid) 不展示**。
- **登录拦截**:`查看保留价` / `历史成交价` / `调研问卷` 均需登录后才可使用。未登录点击 → 跳 `login.html?from=<page>.html`;登录回跳后需**再次点击**入口才打开,不自动展开。
- **售后使用无理由退车的钱包账单**: FNC 钱包账单流水摘要追加 `(无理由退车)` 后缀，**整行标红**(`color:#f56c6c`)，格式 `订单售后款项(无理由退车):{车牌号}` / `扣减订单售后款项(无理由退车):{车牌号}`。
- **历史数据处理(7/1 上线日)**: 等级跑数 + 积分不追溯。系统对前 3 个月历史成交记录(抛成交退车) + 当前账户余额跑数，7/1 当天确定每个用户的等级与权益;积分从功能上线起正式计算，不补发。
- **调研问卷**:从「推荐任务」→「参与平台投票 / 问卷 / 调研」→「去完成」进入 `survey.html`(app/pc 同一份 config)。需登录;提交得 +2 积分;**同一用户只能填一次**,提交后 `chevip_survey_done='1'`,推荐任务列表自动隐藏该任务。提交记录写 `chevip_survey_submissions`,BMS 「调研问卷结果」按 surveyId 聚合统计。
- **跨页 demo state · localStorage 键清单**:
  | key | 含义 | 写入者 |
  |---|---|---|
  | `vp_user` | 登录态 + 等级(JSON `{level, loginAt}`) | `shared/reserve-cars.js → VPUser.set()` |
  | `chevip_user_coins` | 积分余额(默认 356) | 兑换 / demo 切换 |
  | `chevip_unlocked_reserve_ids` | 保留价已解锁车辆 id 列表 | ReservePriceLogic.exchange |
  | `chevip_unlocked_history_ids` | 历史成交价已解锁车辆 id 列表 | HistoryPriceLogic.exchange |
  | `chevip_redeemed_records` | 兑换流水(两类共用,按 `type: reserve_price / history_price` 区分) | 两类 exchange |
  | `chevip_survey_submissions` | 调研问卷提交数组(含 surveyId / user / answers) | app/pc survey.html |
  | `chevip_survey_done` | 当前用户已完成调研,推荐任务列表据此隐藏 t_vote | survey.html 提交成功 |
  | `chevip_user_name` | 兜底用户显示名(legacy) | demo seed |

#### UI 模式
- **列表→详情 跳转**: 参照 `bms-orders.html` 模式——整行可点击，行内 `<a>` 保留原生行为，详情参数用 URLSearchParams 透传。
- **PC 个人中心专属 nav header**: `pc/member.html` / `pc/coins.html` / `pc/mall.html` / `pc/orders.html` 不使用 `PC_COMMON.renderHeader()`(那是车源浏览 nav)，而是各自内联拼一个含「我的首页 / 我的交易 / 专用账号 / 会员中心 / 我的信息」5 项的 nav,active 项随当前页变化。
- **演示切换面板**: 涉及多状态展示的演示页(如 `pc/mall.html` 等级折扣切换、`bms-order-detail.html` 权益使用 / 24h 过期切换)，右上角浮窗或 Tab 行右侧加 demo toggle 按钮，**只为评审用**，不进生产。
- **「需求点说明」按钮**(评审专用): BMS 后台多个详情/列表页(bms-orders / bms-order-detail / bms-users / bms-user-detail / bms-sales-buyer-detail / fnc-wallet-log)在 tab 行右侧或表格上方加紫色「需求点说明」按钮，点击弹出 modal 列出当前页本期改造点。统一样式：`border:#a78bfa; bg:#faf5ff; color:#7c3aed`。
  - **红点规范(必须)**:按钮右上角常驻红点，不可消失，用于引导评审人员第一眼注意到需求说明入口。写法：button 加 `position:relative`，内部末尾追加：
    ```html
    <span style="position:absolute;top:-3px;right:-3px;width:10px;height:10px;background:#ef4444;border-radius:50%;box-shadow:0 0 0 2px #fff;"></span>
    ```
    新增任何「需求点说明」按钮时必须同步加上此红点。

---

## 三、admin/ 下所有 BMS 模块的 Sidebar 必须完全一致

唯一标准结构，新增或修改任何 admin 相关页面都必须使用这份 sidebar 模板(只改动 `active` 位置)。**菜单层级与项不可随意增删**，本期改造已加入若干「新增 / 调整」标签和点击弹框逻辑。

### 模板

```html
<aside class="ant-sider flex flex-col">
  <div class="logo h-14 flex flex-col items-center justify-center">
    <div class="brand-title"><span style="color:#e6a23c">唯普</span>汽车</div>
    <div class="brand-sub">www.chevip.com</div>
  </div>
  <nav class="flex-1 overflow-y-auto">
    <!-- 业务数据 4 项 · 默认展开 -->
    <div class="menu-item open" onclick="const s=this.nextElementSibling;this.classList.toggle('open');s.style.display=s.style.display==='none'?'':'none'"><i data-lucide="database" class="w-4 h-4"></i><span>业务数据</span><i data-lucide="chevron-right" class="w-3 h-3 chevron"></i></div>
    <div class="submenu">
      <a href="bms-orders.html"      class="sub-item">订单列表<span class="adj-tag">调整</span></a>
      <a href="bms-order-detail.html" class="sub-item">订单详情<span class="adj-tag">调整</span></a>
      <a href="bms-users.html"        class="sub-item">用户列表<span class="adj-tag">调整</span></a>
      <a href="bms-user-detail.html" class="sub-item">用户详情<span class="adj-tag">调整</span></a>
    </div>

    <!-- 销售管理 10 项 · 默认展开(等级设置 display:none 隐藏) -->
    <div class="menu-item open"><i data-lucide="bar-chart-3" class="w-4 h-4"></i><span>销售管理</span><i data-lucide="chevron-right" class="w-3 h-3 chevron"></i></div>
    <div class="submenu">
      <a href="dashboard.html"           class="sub-item">运营仪表盘<span class="new-tag">新增</span></a>
      <a href="bms-level-mgmt.html"      class="sub-item" onclick="event.preventDefault();showRuleAlert('按新规则调整用户等级', this.href)">客户等级管理<span class="adj-tag">调整</span></a>
      <a href="bms-sales-buyers.html"    class="sub-item">买家管理<span class="adj-tag">调整</span></a>
      <a href="bms-sales-buyer-detail.html" class="sub-item">买家详情<span class="adj-tag">调整</span></a>
      <a href="bms-sales-orders.html"    class="sub-item" onclick="event.preventDefault();showRuleAlert('按新规则调整用户等级', this.href)">销售订单<span class="adj-tag">调整</span></a>
      <a style="display:none" href="level-rule.html" class="sub-item">等级设置</a>
      <a href="coin-rule.html"           class="sub-item">积分规则<span class="new-tag">新增</span></a>
      <a href="rewards.html"             class="sub-item">商城商品配置<span class="new-tag">新增</span></a>
      <a href="bms-coin-log.html"        class="sub-item">积分流水<span class="new-tag">新增</span></a>
      <a href="bms-redeem-log.html"      class="sub-item">兑换记录<span class="new-tag">新增</span></a>
      <a href="bms-survey.html"          class="sub-item">调研问卷结果<span class="new-tag">新增</span></a>
    </div>

    <!-- 服务中心 3 项 · 默认展开 -->
    <div class="menu-item open" onclick="const s=this.nextElementSibling;this.classList.toggle('open');s.style.display=s.style.display==='none'?'':'none'"><i data-lucide="headphones" class="w-4 h-4"></i><span>服务中心</span><i data-lucide="chevron-right" class="w-3 h-3 chevron"></i></div>
    <div class="submenu">
      <a href="bms-aftersales.html"              class="sub-item">售后服务</a>
      <a href="bms-aftersales-list.html"         class="sub-item" onclick="event.preventDefault();showRuleAlert('用户等级更新', this.href)">售后列表<span class="adj-tag">调整</span></a>
      <a href="bms-aftersale-approval-list.html" class="sub-item" onclick="event.preventDefault();showRuleToast('无理由权益使用的说明', this.href)">企微审批<span class="adj-tag">调整</span></a>
    </div>

    <!-- 运营部 1 项 · 默认展开 -->
    <div class="menu-item open" onclick="const s=this.nextElementSibling;this.classList.toggle('open');s.style.display=s.style.display==='none'?'':'none'"><i data-lucide="briefcase" class="w-4 h-4"></i><span>运营部</span><i data-lucide="chevron-right" class="w-3 h-3 chevron"></i></div>
    <div class="submenu">
      <a href="bms-coupons.html" class="sub-item">优惠券<span class="adj-tag">调整</span></a>
    </div>
  </nav>
</aside>

<!-- 引入弹框工具(任何 onclick 调 showRuleAlert 的页面都要引) -->
<script src="_sidebar-alert.js"></script>
```

> 上方 `adj-tag` / `new-tag` 实际写法是内联 style:
> - 调整(橙): `<span style="margin-left:6px;font-size:10px;padding:1px 5px;border-radius:3px;background:#f59e0b;color:#fff;font-weight:500;letter-spacing:0">调整</span>`
> - 新增(绿): `<span style="margin-left:6px;font-size:10px;padding:1px 5px;border-radius:3px;background:#10b981;color:#fff;font-weight:500;letter-spacing:0">新增</span>`

### 规则

1. **一级项 4 个，顺序固定**:业务数据 / 销售管理 / 服务中心 / 运营部。**四组默认全部展开**(`menu-item` 都加 `open` 类，`submenu` 不带 `style="display:none"`)，避免评审/开发遗漏 submenu 下的需求点。onclick 保留允许手动折叠。**严禁出现**:检测认证管理、政企大客户、库存管理、查验管理、人力资源、集团门店管理、共享拍、配置管理、报表管理、中控中心 等旧项。
2. **业务数据 submenu 4 项**:订单列表 / 订单详情 / 用户列表 / 用户详情。**全部带「调整」橙色标签**，因为本期均加入了买家等级展示和「需求点说明」入口。
3. **销售管理 submenu 10 项，按此顺序**:运营仪表盘 / 客户等级管理 / 买家管理 / 买家详情 / 销售订单 / 等级设置(隐藏) / 积分规则 / 商城商品配置 / 积分流水 / 兑换记录 / 调研问卷结果。
   - 「客户等级管理」和「销售订单」点击触发 `showRuleAlert('按新规则调整用户等级', this.href)`，先弹框确认再跳转(确定后才跳)
   - 客户等级管理跳 `bms-level-mgmt.html`(占位空页，本期实际功能由「跑数 + 重新定级」承担，详细界面待补)
   - 「等级设置」`<a style="display:none">` 隐藏，文件 `admin/level-rule.html` 保留以备复查
4. **服务中心 submenu 3 项**:售后服务 / 售后列表(带「调整」+ `showRuleAlert('用户等级更新')`) / 企微审批(带「调整」+ `showRuleToast('无理由权益使用的说明')`)。
5. **运营部 submenu 1 项**:优惠券(带「调整」标签)。
6. **当前页 active**:仅在对应 `sub-item` 上加 `active` 类。详情页归属对应列表的 active(如 `bms-order-detail.html` 上是「订单详情」active，不是「订单列表」)。
7. **四组默认全部展开**(见 1.)，无论当前页归属哪个 submenu;`onclick` 保留允许手动折叠。
8. **新增「调整 / 新增」标签**:全部使用上方内联 style 模板，不引外部 CSS class，避免与各页自有样式冲突。
9. **`_sidebar-alert.js`** 提供 `window.showRuleAlert(msg, navHref?)`:页面正中央居中弹框，有遮罩，**只能点「确定」关闭**(点遮罩或 ESC 不关)，关闭后若传了 navHref 则跳转。所有用 `showRuleAlert` 的页面必须在 `</body>` 之前引入此脚本。

### FNC 后台 sidebar(独立模板)

`admin/fnc-*.html` 用一套不同的 sidebar(顶部 `FNC` 标识 + 业务数据(占位)+ 财务管理)，不与 BMS 共享。当前 FNC 仅 1 个可见入口「钱包账单」(带「调整」标签，因售后无理由退车摘要标红是本期改造点)。

---

## 四、快速索引

| 任务 | 入口 |
|---|---|
| 改会员等级 / 权益 / 积分规则 / Q&A / 推荐任务 | `shared/member-config.js` |
| 改调研问卷内容 / 加新问卷 | `shared/survey-config.js`(SURVEYS 数组,active:true 切换发放问卷) |
| 改保留价/历史成交价兑换逻辑 | `shared/reserve-price-logic.js`(同时影响 PC + APP 详情页) |
| 改推荐任务路由/登录拦截 | `shared/recommended-tasks.js` |
| 看调研问卷结果 + 导 CSV | `admin/bms-survey.html`(按 surveyId 切换,自带 mock 填充) |
| 新增 BMS 后台页 | `admin/bms-*.html` + sidebar 模板复用 + `index.html` 导航卡 |
| 新增 FNC 后台页 | `admin/fnc-*.html` + 同 fnc 风格 sidebar + `index.html` 导航卡 |
| 新增 PC 个人中心页 | `pc/*.html` 用「个人中心专属 nav」(参考 member/coins/mall/orders) |
| 新增商户端 APP 页 | `app/` + `index.html` 导航卡 |
| 加居中弹框 | 引入 `admin/_sidebar-alert.js`，调用 `showRuleAlert('文案'， 跳转URL?)` |
