// PC 端公共数据 / 工具函数 · 各页面通过 <script> 引入，共享 header / footer / mock 数据

window.PC_COMMON = {
  // 顶栏 / 主导航数据
  topbarLeft: '专业汽车服务平台!您好，欢迎来到唯普汽车!',
  topbarLeftLinks: [
    { text: '登录', href: '#' },
    { text: '免费注册', href: '#' },
    { text: '门店登录', href: '#' },
  ],
  topbarRight: [
    { text: 'English', href: '#' },
    { text: '移动唯普', href: '#' },
    { text: '商家合作', href: '#' },
    { text: '网站公告', href: '#' },
    { text: '联系客服', href: '#', icon: 'headphones', danger: true },
  ],
  navItems: [
    { key: 'home',     label: '首页',     href: 'home.html' },
    { key: 'sources',  label: '全部车源', href: 'sources.html' },
    { key: 'auction',  label: '竞价大厅', href: 'auction.html' },
    { key: 'reserved', label: '有保留价', href: 'reserved.html' },
    { key: 'special',  label: '专场车源', href: 'special.html' },
  ],

  // 公共筛选选项
  brandHot: ['大众','本田','丰田','日产','福特','奥迪','哈弗','五菱','别克','比亚迪','宝马','马自达','奔驰','宝骏'],
  brandLetters: 'ABCDEFGHIJKLMQRSTWXYZ'.split(''),
  priceRanges: ['3万以下','3-5万','5-8万','8-15万','15-20万','20万以上'],
  regions: ['广东','广西','湖北','贵州','江西','海南','湖南','福建'],
  moreFilters: [
    { key: 'mileage',  label: '里程' },
    { key: 'emission', label: '排放标准' },
    { key: 'license',  label: '车牌归属地' },
    { key: 'condition',label: '车况级别' },
    { key: 'age',      label: '车龄' },
    { key: 'energy',   label: '能源类型' },
    { key: 'isNew',    label: '是否新能源' },
    { key: 'reserved', label: '是否有保留价' },
  ],

  // mock 车辆库 —— 字段对齐截图;img 用 Unsplash CDN 真实车辆图，与 app 端一致
  cars: (function () {
    const u = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&auto=format&q=80`;
    return [
      { id: 'c1',  img: u('1552519507-da3b142c6e3d'), pro: true,  status: '竞价中', score: '90C', title: '广州市|奔驰 唯雅诺 2011款 2.5L 尊贵版',                     plate: '粤A', date: '2012-10', km: '10.48万公里', pass: '0次过户', tags: ['竞价大厅'],          price: '1.9',  endIn: '0小时00分51秒' },
      { id: 'c2',  img: u('1617788138017-80ad40651399'), pro: true,  status: '竞价中', score: '90C', title: '惠州市|五菱 宏光 2014款 五菱S 1.5L 手动豪华型',           plate: '粤L', date: '2014-06', km: '6.75万公里',  pass: '0次过户', tags: ['竞价大厅','上新'], price: '0.5',  endIn: '0小时01分06秒' },
      { id: 'c3',  img: u('1494976388531-d1058494cdd8'), pro: true,  status: '竞价中', score: '80B', title: '广州市|大众 朗境 2014款 1.4T DSG双离合',                    plate: '粤A', date: '2015-02', km: '10.54万公里', pass: '0次过户', tags: ['竞价大厅','上新'], price: '1.8',  endIn: '0小时01分17秒' },
      { id: 'c4',  img: u('1550355291-bbee04a92027'), pro: true,  status: '竞价中', score: '80B', title: '广州市|奥迪 A6L 2018款 1.8TFSI 双离合 30周年年型 进取型', plate: '桂N', date: '2018-07', km: '11.71万公里', pass: '0次过户', tags: ['竞价大厅','上新'], price: '9.6',  endIn: '0小时01分19秒' },
      { id: 'c5',  img: u('1553440569-bcc63803a83d'), pro: false, status: '竞价中', score: '——',  title: '广州市|雷诺 Koleos 2010款 Koleos 2.5 无级 两驱',           plate: '粤L', date: '2011-03', km: '16.49万公里', pass: '',         tags: ['报废车专场'],     price: '0.45', endIn: '4月29日 14:2结束', scrap: true },
      { id: 'c6',  img: u('1542362567-b07e54358753'), pro: true,  status: '竞价中', score: '80C', title: '广州市|埃安 Aion S 2020款 魅 580 出行标准版',              plate: '粤A', date: '2022-05', km: '17.08万公里', pass: '0次过户', tags: ['竞价大厅','上新','新能源'], price: '3.3',  endIn: '0小时00分16秒', energy: true },
      { id: 'c7',  img: u('1544636331-e26879cd4d9b'), pro: true,  status: '竞价中', score: '85B', title: '广州市|雪佛兰 科鲁泽 2019款 RS 330T自动畅快版',            plate: '湘M', date: '2019-12', km: '10.49万公里', pass: '0次过户', tags: ['竞价大厅','上新'], price: '1.8',  endIn: '0小时00分31秒' },
      { id: 'c8',  img: u('1590362891991-f776e747a588'), pro: true,  status: '竞价中', score: '85B', title: '东莞市|领克 领克01 2017款 2.0T 手自一体 型Pro',            plate: '粤B', date: '2019-01', km: '6.13万公里',  pass: '0次过户', tags: ['有保留价','降价'], price: '3.8',  endIn: '0小时01分06秒', reserved: true },
      { id: 'c9',  img: u('1549317661-bd32c8ce0db2'), pro: false, status: '竞价中', score: '——',  title: '惠州市|本田 雅阁 2004款 2.0L 自动 标准型',                  plate: '粤L', date: '2004-10', km: '仪表盘已损坏', pass: '',         tags: ['报废车专场','降价'], price: '0.48', endIn: '0小时01分09秒', scrap: true },
      { id: 'c10', img: u('1542362567-b07e54358753'), pro: false, status: '竞价中', score: '65D', title: '深圳市|比亚迪 e2 2019款 标准续航版 智.舒适型',              plate: '粤B', date: '2020-07', km: '21.74万公里', pass: '0次过户', tags: ['竞价大厅','上新','新能源'], price: '0.8',  endIn: '0小时01分16秒', energy: true },
      { id: 'c11', img: u('1494976388531-d1058494cdd8'), pro: false, status: '竞价中', score: '85C', title: '惠州市|铃木 锋驭 2014款 锋驭 1.6 无级 尊型',                 plate: '粤L', date: '2014-09', km: '28.18万公里', pass: '',         tags: ['竞价大厅'],         price: '0.6',  endIn: '0小时01分20秒' },
      { id: 'c12', img: u('1550355291-bbee04a92027'), pro: false, status: '竞价中', score: '——',  title: '南昌市|别克 君威 2015款 2.0L 精英时尚型',                  plate: '赣A', date: '2017-05', km: '4.37万公里',  pass: '',         tags: ['有保留价','上新'], price: '3',    endIn: '4月30日 15:30结束', reserved: true },
      { id: 'c13', img: u('1553440569-bcc63803a83d'), pro: false, status: '竞价中', score: '——',  title: '南昌市|江铃 X7 2015款 2.0T 全景旗舰版',                    plate: '赣A', date: '2016-01', km: '6.04万公里',  pass: '',         tags: ['有保留价'],         price: '1.8',  endIn: '4月30日 15:30结束', reserved: true },
      { id: 'c14', img: u('1552519507-da3b142c6e3d'), pro: false, status: '竞价中', score: '——',  title: '南昌市|腾势 D9 2022款 DM-i 970 四驱尊荣型',                plate: '赣A', date: '2023-04', km: '9.18万公里',  pass: '',         tags: ['有保留价','新能源'], price: '19',   endIn: '4月30日 15:30结束', reserved: true, energy: true },
      { id: 'c15', img: u('1549317661-bd32c8ce0db2'), pro: false, status: '竞价中', score: '——',  title: '南昌市|红旗 H5 2024款 2.0T 自动智联旗畅版',                plate: '赣A', date: '2024-08', km: '2.15万公里',  pass: '',         tags: ['有保留价'],         price: '10',   endIn: '4月30日 15:30结束', reserved: true },
      { id: 'c16', img: u('1617788138017-80ad40651399'), pro: false, status: '竞价中', score: '——',  title: '南昌市|红旗 H5 2024款 2.0T 自动智联畅快版',                plate: '赣A', date: '2024-07', km: '2.73万公里',  pass: '',         tags: ['有保留价'],         price: '10',   endIn: '4月30日 15:30结束', reserved: true },
    ];
  })(),

  // 专场数据
  specials: [
    { id: 's1', title: '4月报废车专场',     scene: '本月',   date: '4月29日 14:00 开始', total: 128, joined: 76 },
    { id: 's2', title: '广州中升专场',       scene: '今日',   date: '4月29日 16:30 开始', total: 56,  joined: 23 },
    { id: 's3', title: '南昌红旗整备专场',   scene: '明日',   date: '4月30日 15:30 开始', total: 32,  joined: 12 },
    { id: 's4', title: '深圳新能源专场',     scene: '明日',   date: '4月30日 17:00 开始', total: 88,  joined: 41 },
    { id: 's5', title: '5.1 周五奔驰宝马专场', scene: '5.1',   date: '5月1日 14:00 开始',  total: 42,  joined: 0 },
    { id: 's6', title: '惠州小型车定制专场', scene: '5.2',   date: '5月2日 14:30 开始',  total: 64,  joined: 0 },
  ],
};

window.PC_COMMON.renderHeader = function (active) {
  const c = window.PC_COMMON;
  const links = c.topbarLeftLinks.map(l => `[<a href="${l.href}">${l.text}</a>]`).join('');
  const right = c.topbarRight.map(r => `<a href="${r.href}" class="${r.danger ? 'danger' : ''}">${r.icon ? `<i data-lucide="${r.icon}" class="w-3.5 h-3.5 inline mr-0.5"></i>` : ''}${r.text}</a>`).join('<span class="sep">|</span>');
  const navHtml = c.navItems.map(n => `<a href="${n.href}" class="nav-item ${n.key === active ? 'active' : ''}">${n.label}</a>`).join('');

  return `
<div class="pc-topbar">
  <div class="topbar-inner">
    <div>${c.topbarLeft} ${links}</div>
    <div>${right}</div>
  </div>
</div>
<div class="pc-nav">
  <div class="pc-nav-inner">
    <a href="home.html" class="brand">
      <div class="brand-zh">唯普汽车</div>
      <div class="brand-en">www.chevip.com</div>
    </a>
    <div class="nav-list">${navHtml}</div>
    <div class="search-wrap">
      <input class="search-input" placeholder="车辆编号\\品牌\\车系\\车型" />
      <button class="search-btn">搜索</button>
    </div>
  </div>
</div>`;
};

window.PC_COMMON.renderFooter = function () {
  return `
<footer class="pc-footer">
  <div class="pc-footer-inner">
    <div class="col">
      <h4>关于唯普</h4>
      <a>公司介绍</a><br><a>加入我们</a><br><a>媒体报道</a>
    </div>
    <div class="col">
      <h4>商家服务</h4>
      <a>商家合作</a><br><a>商家入驻</a><br><a>服务中心</a>
    </div>
    <div class="col">
      <h4>帮助中心</h4>
      <a>新手指南</a><br><a>竞价规则</a><br><a>常见问题</a>
    </div>
    <div class="col">
      <h4>联系我们</h4>
      <a>客服热线 400-000-0000</a><br><a>9:00 - 21:00</a>
    </div>
  </div>
  <div class="copyright">© 2026 唯普汽车 chevip.com · 演示 Demo · 数据均为模拟</div>
</footer>`;
};
