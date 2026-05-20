/**
 * 唯普二手车拍卖平台 · 调研问卷配置(全站唯一数据源)
 * --------------------------------------------------
 * 当前(第一期):问卷内容硬编码,通过本文件统一维护。
 * 后续(第二期):问卷迁移到 BMS 后台「调研问卷」管理页配置后,改成接口拉取。
 *
 * 谁在读它:
 *   - app/survey.html     用户端移动问卷(登录后从「推荐任务」→「参与平台投票/问卷/调研」进入)
 *   - pc/survey.html      用户端 PC 问卷
 *   - admin/bms-survey.html  BMS 后台「调研结果」页(读 config 渲染统计维度)
 *
 * 引入:<script src="../shared/survey-config.js"></script>
 * 读取:window.SURVEY_CONFIG
 *
 * --------------------------------------------------
 *  如何修改问卷(快速换内容场景)
 * --------------------------------------------------
 * 1) 改标题 / 副标题 / 开场语   → 修改 title / meta / intro
 * 2) 改"全生命周期"标签条        → 修改 lifecycleStages 数组
 * 3) 改题目                       → 编辑 questions 数组(题型仅支持下面 3 种)
 *    - single:单选,options 数组,每项一行字符串
 *    - multi: 多选,options 数组,每项一行字符串
 *    - text:  自由填写,placeholder 为输入框占位
 *           · 默认渲染为单个 textarea(answers[qi] 是字符串)
 *           · 若提供 fields 数组(多字段填空,如「商户信息」题),则渲染为多个
 *             input,answers[qi] 是 { [field.key]: value } 对象。每个 field
 *             形如 { key:'city', label:'您所在的城市', placeholder:'例:上海', maxLength:30 }
 * 4) 给某道题加「选完展开补充」  → 在该题加 followUp 字段
 *    {
 *      tagsByOption: { '选项A': ['标签1','标签2'], '选项B': [...] }  // single 用
 *      tags: ['标签1','标签2']  // multi 用,统一一组标签
 *      triggerOptions: ['其他']  // multi 用,仅当勾选这里列出的选项时才展开;
 *                               // 不填则默认"勾任意选项就展开"
 *      textPlaceholder: '请补充说明'  // 自由填写框的占位
 *      required: true | false   // 是否必填(默认 false:可不填补充)
 *    }
 *    其他可选字段(题级):
 *    - hideTypeTag: true     不在题卡右上角显示「单选/多选/简述」标签
 *    - hint: '...'           在题目下方展示一段引导/说明文案
 * 5) 调整提示文案                 → 修改 footer
 *
 * 问题数量建议:6~10 题。前几题画像,中段挖掘需求,末尾自由填写。
 */
(function (global) {
  'use strict';

  // 调研问卷库:active 标记当前对外发放的问卷。后续新增问卷直接在数组里追加,
  // BMS 后台「调研问卷」页可在顶部切换查看不同问卷的提交数据。
  // 注意:不要随便修改已上线问卷的 id / version,提交记录靠 surveyId 关联问卷定义。
  var SURVEYS = [
    {
      id: 'biz_2026_05',
      version: '2026.05',
      updatedAt: '2026-05-20',
      active: true,    // 同一时间只允许 1 份 active
      status: '上线中', // 上线中 / 已下线 / 草稿

      title:  '唯普汽车商户问卷调查',
      meta:   '面向商户 · 业务方向 / 关键环节 / 通知偏好 / 商户画像 · 匿名提交',
    intro:  '感谢您选择唯普汽车。问卷预计 2 分钟完成，提交后将赠送积分作为感谢，所有回答仅用于产品改进。',

    // 顶部"全生命周期覆盖"标签条
    lifecycleStages: ['竞拍出价', '成交支付', '车辆交付', '过户登记', '售后保障'],

    // 题目列表;题型 single / multi / text
    questions: [
      {
        type: 'single',
        text: '您在唯普平台的主要业务方向是？',
        options: ['二手车采购（采入）', '二手车销售（车源方）', '采购+销售 双向业务', '其他'],
      },
      {
        type: 'multi',
        text: '在二手车拍卖到交付的交易过程中，您最看重以下哪些环节？（可多选）',
        options: [
          '车源信息真实性', '检测报告专业度', '竞拍/出价体验', '价格竞争力',
          '交付与跨城物流', '过户便捷度', '售后保障（无理由退车/质保）',
          '客服响应速度', '其他',
        ],
        // 多选「其他」统一交互:勾选「其他」时展开补充输入框
        followUp: {
          triggerOptions: ['其他'],
          textPlaceholder: '请您补充',
          required: false,
        },
      },
      {
        type: 'multi',
        text: '在交易过程中，您最倾向的通知方式是哪种？（可多选）',
        options: ['APP 站内消息通知', '短信', '公众号', '企业微信', '其他'],
        // 仅当用户勾选了 triggerOptions 中的任一选项时,才展开「补充说明」输入框
        // (相比默认"勾任意选项就展开"更精准,用于「其他」需要补充内容的场景)
        followUp: {
          triggerOptions: ['其他'],
          textPlaceholder: '请您补充',
          required: false,
        },
      },
      {
        // 商户信息:多字段填空,渲染为多个 input(渲染端按 q.fields 判断)
        // hideTypeTag:不显示右上「简述」标签,这题对用户更像表单而非问答
        // hint:在题目下方加一段引导文案,缓和"干巴巴只问数据"的体验
        type: 'text',
        text: '商户信息',
        hideTypeTag: true,
        hint: '帮助我们了解您的业务背景，以便为您匹配更合适的车源与服务（信息不会对外公开）。',
        fields: [
          { key: 'city',    label: '您所在城市',                     placeholder: '例：上海', maxLength: 30 },
          { key: 'years',   label: '从事二手车收车年限（年）', placeholder: '例：5',    maxLength: 10 },
          { key: 'monthly', label: '月均收车量（台）',         placeholder: '例：30',   maxLength: 10 },
        ],
      },
      {
        type: 'text',
        text: '您还有哪些改进建议或希望我们关注的问题？',
        placeholder: '请简要描述您在使用过程中遇到的问题或对平台的期待，字数不超过 500 字。',
        maxLength: 500,
      },
    ],

      // 底部说明文案
      footer: '第一期调研问卷内容写死在 shared/survey-config.js,下一期上线问卷配置后将迁移至 BMS 接口管理。',
    },
    // 示例:下一份问卷可在此追加,新增 active:true 并把旧问卷 active 改为 false 即可
    // { id: 'aftersale_2026_07', version: '2026.07', active: false, status: '草稿', title: '...', questions: [...] },
  ];

  // 全部问卷列表(供 BMS 后台切换查看)
  global.SURVEY_CONFIGS = SURVEYS;
  // 当前对外发放的活跃问卷(供 app/survey.html 与 pc/survey.html 渲染)
  global.SURVEY_CONFIG = SURVEYS.find(function (s) { return s.active; }) || SURVEYS[0];
})(typeof window !== 'undefined' ? window : this);
