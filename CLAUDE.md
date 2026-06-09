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
- **数据查询类商品对外统一称「数据查询服务次卡」**:禁用旧称「数据查询优惠券」(对接渠道仅支持次卡,旧优惠券已隐藏下线,详见业务规则章节)。代码中的 `SERVICE_CARD` / `SVCCARD_*` / `r_svc_*` 等英文标识保留不动,只规范中文显示。

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
├─ level-flow.html             # 会员等级定级逻辑(状态机流程图 + 交互验证器,复用 getLevelProgress)
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
│   ├─ account.html           # 专用账号(三联卡:可用余额/可用保证金/绑定银行卡)+ 流水/冻结明细 + 需求点说明
│   ├─ withdraw-balance.html  # 可用余额提现弹框 demo 独立预览页(关后自动重开)
│   ├─ withdraw-deposit.html  # 保证金提取弹框 demo 独立预览页
│   ├─ _withdraw-modals.js    # 提现 + 保证金提取弹框共享组件(WithdrawBalanceModal / WithdrawDepositModal)
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
- **`pc/_withdraw-modals.js`**(物理位置在 pc/ 下,但被 account.html + 两个独立 demo 页共用):导出两个 Vue 组件 `WithdrawBalanceModal`(提现) / `WithdrawDepositModal`(保证金提取),内置「演示面板 + 等级失效二次确认 + toast」。`needLevelWarning()` 关键差异:**提现**按 `accountTotal - 提现金额 < 2000` 触发;**保证金提取**只看勾选项中的**微信渠道**合计金额(`accountTotal - wechatOut < 2000`),提取至可用余额是站内转账不触发。Demo 面板/需求点卡 `z-index` 必须 ≥ 9050(mask 是 9000,否则点击被 mask 拦截直接关弹框);弹框 `visible` 翻 true 时要重置 deposit dataset,避免上次关闭后所有项都未勾选导致 demo 失效。
- **配色**(按 V 编号位置固定，与等级名解耦): V0 灰 `#94a3b8` / V1 蓝 `#0ea5e9` / V2 紫 `#8b5cf6` / V3 金 `#f59e0b`
- **积分**: 1 积分 = 0.1 元;有效期 12 个自然月，按 `获得月 + 12 月` 滚动到期
- **等级门槛**(V0 为"或",V1-V3 为"且"): V0 帐户 < 2000 **或**近 3 月无成交 / V1 ≥ 2000 且 1-3 台 / V2 ≥ 2000 且 4-14 台 / V3 ≥ 2000 且 ≥ 15 台。V0 用"或"因 V1-V3 都要求"≥2000 且有成交",其补集即"<2000 或无成交"(德摩根),否则"账户<2000 但有成交"会无归属。

#### 业务规则
- **「无理由退车」权益**: V3 钻石专享，**车辆中标后 24 小时内可申请**(BMS 后台代发起不受 24h 限制,仅看权益本身有效期)。所有相关页面(BMS 申请售后、APP/PC 售后申请)都需要在 UI 显示这个有效期，且支持「未超期 / 超 24h」演示切换。
- **无理由退车资金分配**(原 2000 元全归一方调整为 1200+800 拆分,与汇和及业务负责人确认 + 唯普财务回复):
  - 广物汽贸 + 垫款主体 = 汇和/门店账号 → 1200 元归汇和/门店账号,800 元归唯普新收益
  - 广物汽贸 + 其他垫款主体 → 1200 元归唯普云,800 元归唯普新收益
  - 非广物汽贸 → 800 元归唯普汽车,1200 元归门店
  - BMS 代发起时若操作员人工分配款项,以人工为准;否则按以上规则。
  - 原图(企微聊天截图)归档:`docs/images/aftersale-rule-{new,old,qa}.png`,引用见 `index.html` 需求说明章节 4.4。
- **提现/提取等级失效弹框**(`pc/_withdraw-modals.js` 共享 + `app/withdraw-balance.html`/`app/withdraw-deposit.html` 独立实现):
  - **可用余额提现**:`accountTotal - 提现金额 < 2000` 且用户 V1-V3 → 弹「确认提现」二次确认;V0 直接提交。
  - **保证金提取至微信**:钱真出账,影响 accountTotal;扣除微信合计后 < 2000 且 V1-V3 → 弹「确认提取」。
  - **保证金提取至可用余额**:站内转账(保证金→可用余额),不影响 accountTotal,**不弹框**,直接提交。
  - PC 共享组件的 demo 面板默认展示;**保证金提取**弹框中,若用户只勾「可用余额」项(纯站内转账场景),demo 演示面板自动隐藏(`balanceOnlyChecked` computed)。移动端 `app/withdraw-deposit.html` 同步。
- **保留价查询权益**:V1/V2/V3 直接查看;仅 V0 消耗 50 积分对单车兑换,有效期内反复查看。pc/car-detail.html + app/car-detail-reserve.html 入口。
- **历史成交行情权益**:V1/V2/V3 直接查看;V0 消耗 100 积分对单车兑换,有效期内反复查看。**仅车辆详情页有入口,出价页 (car-bid) 不展示**。
- **数据查询服务次卡**(积分商城商品): 5 种数据报告——出险报告(车信盟)280 / 维保报告(唯车转)200 / 电池报告(唯车转)300 / 里程报告(唯车转)180 / 综合报告(柠檬查)380 积分。**按次核销,不同类型报告可叠加使用**(同类不叠加)。因对接渠道仅支持次卡、不支持通用优惠券,原「数据查询优惠券」已在 `admin/rewards.html` 隐藏(类型加 `hidden:true`,数据保留不删除),全站对外统一展示为「数据查询服务次卡」。数据源:`shared/member-config.js → redeemableRewards`(驱动商城 mall / 积分流水 coins / 兑换记录 bms-redeem-log 按 reward id 联动) + `admin/rewards.html` products(BMS 配置,含隐藏的数据查询优惠券)。
- **登录拦截**:`查看保留价` / `历史成交价` / `调研问卷` 均需登录后才可使用。未登录点击 → 跳 `login.html?from=<page>.html`;登录回跳后需**再次点击**入口才打开,不自动展开。
- **售后使用无理由退车的钱包账单**: FNC 钱包账单流水摘要追加 `(无理由退车)` 后缀，**整行标红**(`color:#f56c6c`)，格式 `订单售后款项(无理由退车):{车牌号}` / `扣减订单售后款项(无理由退车):{车牌号}`。
- **等级定级时机(月度统一定级 · 重要)**: 会员等级**每月 1 日统一定级**。**定级口径**:取**前 3 个完整自然月(不含当月)**累计成交台数 + 当前账户(需 ≥ 2000)评定,如 6/1 定级看 3-5 月、7/1 看 4-6 月,**当月内锁定不变**。**展示口径**:给用户/运营看的进度用「含当月的近 3 月滚动累计」——恰为下次定级的 3 月窗口(6 月内展示 4-6 月,6 月实时累加),随成交 +1、月底快照即为下月 1 日定级依据,故**进度条实时动、升降级次月 1 日生效**(两口径是同一窗口的不同时点,自洽;月中成交/账户变化一律下月 1 日生效,不实时升降;原 Q&A "实时升级"口径已废弃)。`shared/member-config.js → getLevelProgress(lockedShort, deals, accountOk)` 是 app/pc 两端共用状态机,返回 **6 态**:`growing`(还差 X 台升 V×) / `pending`(已达更高门槛待生效,「已满足 V× 条件 · 下月 1 日自动升级」) / `demote-warn`(成交下滑、应得低于已生效等级,正向「再成交 X 台保级 V×」**不写降级威胁**) / `deposit-low`(账户<2000 压在 V0,「充至 2000 参与定级」,台数已够补「达标后可升 V×」) / `downgrade-warn`(账户跌破 2000,V1-V3 预警下月下调) / `max`(V3 已最高)。关键:**已生效等级与实时台数解耦**——hero 大字 = 上月定级结果(`lockedShort`),不随当月台数实时变;`deposit-low`/`downgrade-warn` 进度条置灰,其余金色。
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
- **弹框上方浮层 z-index 陷阱**(踩过多次): 公共弹框 mask 普遍用 `z-index:9000`,Tailwind 的 `z-50` 实际值才 50,所以 demo 面板/需求点卡用 `z-50` 时**视觉上能看见(mask 半透明)但点击会被 mask 拦截**,触发 `@click.self="close"` 关弹框。规范:浮在 mask 上的演示/说明面板一律 `style="z-index:9050"`(高于 mask 9000,低于二次确认弹框 9100)。`pc/_withdraw-modals.js` + `pc/withdraw-balance.html` + `pc/withdraw-deposit.html` 已遵循。
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
| 改等级进度文案 / 定级状态机(月度统一定级) | `shared/member-config.js → getLevelProgress`(6 态:growing/pending/demote-warn/deposit-low/downgrade-warn/max) + `app/member.html` / `pc/member.html` 进度区 |
| 看等级定级逻辑 / 给研发讲状态机 | `level-flow.html`(mermaid 流程图 + 交互验证器 + 测试用例,从 demo 首页 app/pc 会员中心旁进) |
| 改商城商品 / 数据查询服务次卡 | `shared/member-config.js → redeemableRewards`(联动商城/coins/bms-redeem-log) + `admin/rewards.html`(BMS 商品配置) |
| 改调研问卷内容 / 加新问卷 | `shared/survey-config.js`(SURVEYS 数组,active:true 切换发放问卷) |
| 改保留价/历史成交价兑换逻辑 | `shared/reserve-price-logic.js`(同时影响 PC + APP 详情页) |
| 改推荐任务路由/登录拦截 | `shared/recommended-tasks.js` |
| 改提现/保证金提取弹框 PC 共享逻辑 | `pc/_withdraw-modals.js`(同时影响 account.html + 两个 demo 页) |
| 改提现/保证金提取移动端 | `app/withdraw-balance.html` / `app/withdraw-deposit.html`(独立实现,等级失效逻辑要与 PC 共享组件保持一致) |
| 改无理由退车资金分配规则 | 文档:`index.html` 需求说明章节 4(`prdActive==='cAfs'`);UI:`admin/bms-order-detail.html` 申请售后表单 |
| 看调研问卷结果 + 导 CSV | `admin/bms-survey.html`(按 surveyId 切换,自带 mock 填充) |
| 新增 BMS 后台页 | `admin/bms-*.html` + sidebar 模板复用 + `index.html` 导航卡 |
| 新增 FNC 后台页 | `admin/fnc-*.html` + 同 fnc 风格 sidebar + `index.html` 导航卡 |
| 新增 PC 个人中心页 | `pc/*.html` 用「个人中心专属 nav」(参考 member/coins/mall/orders) |
| 新增商户端 APP 页 | `app/` + `index.html` 导航卡 |
| 加居中弹框 | 引入 `admin/_sidebar-alert.js`，调用 `showRuleAlert('文案'， 跳转URL?)` |
