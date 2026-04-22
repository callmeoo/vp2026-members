// 智能返回:优先 history.back;若无来源 / 来自 Demo 导航 / 历史栈空,则跳 fallback
function smartBack(fallback) {
  var r = document.referrer;
  var host = location.host;

  // 无 referrer → 用 fallback
  if (!r) { location.href = fallback; return; }

  // 跨域 → 用 fallback(file:// 场景下 host 为空,跳过此判断)
  if (host && !r.includes(host)) { location.href = fallback; return; }

  // 来自 Demo 导航(根目录 / index.html)→ 用 fallback
  var path = r.split('?')[0].split('#')[0];
  if (/\/index\.html$/.test(path) || /\/$/.test(path)) {
    location.href = fallback;
    return;
  }

  // 历史栈只有 1 条(如 iframe 首次载入)→ 用 fallback
  if (window.history.length <= 1) {
    location.href = fallback;
    return;
  }

  history.back();
}
