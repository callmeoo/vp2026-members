/**
 * 保留价 / 历史成交价 查看逻辑 · PC 与 App 共享
 *
 * 两个对象同形:ReservePriceLogic / HistoryPriceLogic
 *   - ReservePriceLogic: 50 积分,V2/V3 免费
 *   - HistoryPriceLogic: 100 积分,V1/V2/V3 免费
 *
 * 共享 localStorage,PC 与 App 数据互通:
 *   chevip_user_coins              余额
 *   chevip_unlocked_reserve_ids    保留价已解锁车辆 id 列表
 *   chevip_unlocked_history_ids    历史成交价已解锁车辆 id 列表
 *   chevip_redeemed_records        兑换流水(两类共用,按 type 区分)
 */
(function () {
  function readStore(k, def) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  }
  function writeStore(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  const SK_COINS = 'chevip_user_coins';
  const SK_RECORDS = 'chevip_redeemed_records';
  const DEFAULT_COINS = 356;

  function buildLogic(cfg) {
    return {
      COST: cfg.cost,
      SK: { coins: SK_COINS, unlocked: cfg.unlockedKey, records: SK_RECORDS },
      readStore: readStore,
      writeStore: writeStore,
      canView(levelCode, carId) {
        if (cfg.freeLevels.indexOf(levelCode) !== -1) return true;
        return readStore(cfg.unlockedKey, []).indexOf(carId) !== -1;
      },
      getCoins() { return readStore(SK_COINS, DEFAULT_COINS); },
      getUnlockedIds() { return readStore(cfg.unlockedKey, []); },
      exchange(carId, carTitle) {
        let coins = readStore(SK_COINS, DEFAULT_COINS);
        if (coins < cfg.cost) return { success: false, newCoins: coins, message: '积分不足' };
        coins -= cfg.cost;
        writeStore(SK_COINS, coins);
        const unlocked = readStore(cfg.unlockedKey, []);
        if (unlocked.indexOf(carId) === -1) {
          unlocked.push(carId);
          writeStore(cfg.unlockedKey, unlocked);
        }
        const records = readStore(SK_RECORDS, []);
        records.unshift({
          id: 'rd_' + Date.now(),
          type: cfg.recordType,
          typeName: cfg.typeName,
          carId: carId,
          carTitle: carTitle || '',
          coin: cfg.cost,
          at: new Date().toISOString(),
        });
        writeStore(SK_RECORDS, records);
        return { success: true, newCoins: coins, message: '兑换成功' };
      },
    };
  }

  window.ReservePriceLogic = buildLogic({
    cost: 50,
    unlockedKey: 'chevip_unlocked_reserve_ids',
    freeLevels: ['V2', 'V3'],
    recordType: 'reserve_price',
    typeName: '保留价查询',
  });

  window.HistoryPriceLogic = buildLogic({
    cost: 100,
    unlockedKey: 'chevip_unlocked_history_ids',
    freeLevels: ['V1', 'V2', 'V3'],
    recordType: 'history_price',
    typeName: '历史成交行情',
  });
})();
