/**
 * 保留价查看逻辑 · PC 端与 App 端共享
 * 
 * 使用方式:
 *   <script src="../shared/reserve-price-logic.js"></script>
 *   const { canViewReserve, confirmExchange, ... } = window.ReservePriceLogic.init(carId);
 * 
 * 共享 localStorage key,PC 与 App 数据互通。
 */
window.ReservePriceLogic = {
  COST: 50, // 兑换所需积分
  SK: {
    coins:    'chevip_user_coins',
    unlocked: 'chevip_unlocked_reserve_ids',
    records:  'chevip_redeemed_records',
  },

  readStore(k, def) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  },

  writeStore(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  },

  /**
   * 判断是否可查看保留价
   * @param {string} levelCode - 'V0'|'V1'|'V2'|'V3'
   * @param {string} carId - 当前车辆 ID
   * @returns {boolean}
   */
  canView(levelCode, carId) {
    if (levelCode === 'V2' || levelCode === 'V3') return true;
    const unlocked = this.readStore(this.SK.unlocked, []);
    return unlocked.includes(carId);
  },

  /**
   * 获取当前积分
   * @returns {number}
   */
  getCoins() {
    return this.readStore(this.SK.coins, 356);
  },

  /**
   * 执行兑换
   * @param {string} carId
   * @param {string} carTitle - 用于记录
   * @returns {{ success: boolean, newCoins: number, message: string }}
   */
  exchange(carId, carTitle) {
    let coins = this.getCoins();
    if (coins < this.COST) {
      return { success: false, newCoins: coins, message: '积分不足' };
    }
    coins -= this.COST;
    this.writeStore(this.SK.coins, coins);

    const unlocked = this.readStore(this.SK.unlocked, []);
    if (!unlocked.includes(carId)) {
      unlocked.push(carId);
      this.writeStore(this.SK.unlocked, unlocked);
    }

    const records = this.readStore(this.SK.records, []);
    records.unshift({
      id: 'rd_' + Date.now(),
      type: 'reserve_price',
      typeName: '保留价查询',
      carId: carId,
      carTitle: carTitle || '',
      coin: this.COST,
      at: new Date().toISOString(),
    });
    this.writeStore(this.SK.records, records);

    return { success: true, newCoins: coins, message: '兑换成功' };
  },

  /**
   * 获取已解锁的车辆 ID 列表
   * @returns {string[]}
   */
  getUnlockedIds() {
    return this.readStore(this.SK.unlocked, []);
  }
};
