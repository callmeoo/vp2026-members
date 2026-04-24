// 有保留价车辆数据 · 全站统一
window.RESERVE_CARS = [
  {
    id: 'r1',
    city: '深圳', plate: '闽R',
    brand: '福特', model: 'E全顺',
    spec: '2023款 全顺EV 高顶客车10-15座 85.9kwh',
    date: '2024-03', mileage: '5万公里', transferTimes: '1次',
    emission: '国VI号标准', usage: '非营运',
    carNo: '0514 4487',
    basePrice: 5000, currentPrice: 5200, reservePrice: 7800,
    fee: 200, platformFee: 300,
    endTime: '04-30 18:00',
    countdown: { d: 6, h: 23, m: 57, s: 15 },
    listPrice: '0.5',
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop&auto=format&q=80',
    bidHistory: [
      { user: 'W325823', time: '2026-04-20 17:57:15', price: 5200 }
    ]
  },
  {
    id: 'r2',
    city: '广州', plate: '粤A',
    brand: '宝马', model: '5系',
    spec: '2018款 530Li 领先型 M运动套装',
    date: '2019-05', mileage: '8.5万公里', transferTimes: '2次',
    emission: '国VI号标准', usage: '非营运',
    carNo: '0514 1023',
    basePrice: 85000, currentPrice: 88000, reservePrice: 95000,
    fee: 500, platformFee: 800,
    endTime: '04-30 16:00',
    countdown: { d: 6, h: 21, m: 12, s: 0 },
    listPrice: '8.5',
    img: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=500&fit=crop&auto=format&q=80',
    bidHistory: [
      { user: 'W118822', time: '2026-04-21 09:32:11', price: 88000 },
      { user: 'W325823', time: '2026-04-20 17:50:00', price: 86000 }
    ]
  },
  {
    id: 'r3',
    city: '上海', plate: '沪A',
    brand: '奥迪', model: 'A6L',
    spec: '2020款 45 TFSI 豪华动感型',
    date: '2020-08', mileage: '6.2万公里', transferTimes: '1次',
    emission: '国VI号标准', usage: '非营运',
    carNo: '0514 8866',
    basePrice: 160000, currentPrice: 172000, reservePrice: 185000,
    fee: 500, platformFee: 800,
    endTime: '04-30 20:00',
    countdown: { d: 6, h: 19, m: 8, s: 30 },
    listPrice: '16',
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop&auto=format&q=80',
    bidHistory: [
      { user: 'W447128', time: '2026-04-22 14:20:00', price: 172000 },
      { user: 'W325823', time: '2026-04-21 18:00:00', price: 168000 }
    ]
  }
];

window.formatYuan = function(n) { return n.toLocaleString('en-US'); };

// 登录态 + 会员等级 · localStorage,demo 简化实现
window.VPUser = {
  KEY: 'vp_user',
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || null; } catch (e) { return null; }
  },
  set(level) {
    localStorage.setItem(this.KEY, JSON.stringify({ level: level || 'V0', loginAt: Date.now() }));
  },
  clear() { localStorage.removeItem(this.KEY); },
  // V2 / V3 才能看保留价
  canSeeReserve() {
    var u = this.get();
    return !!u && (u.level === 'V2' || u.level === 'V3');
  }
};
