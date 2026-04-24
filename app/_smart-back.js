// 智能返回:
// 1) 如果是新开 tab / 直达页面(history.length <= 1) → 用 fallback 指定页面
// 2) 否则调用 history.back();若 300ms 后仍停留在当前 URL,说明 back 无效,再用 fallback
// 不依赖 document.referrer:某些环境(preview 面板 / 隐私模式 / Referrer-Policy)referrer 为空,
// 旧逻辑会误判为"无来源"从而错跳 fallback;这是 profile→landing→back 错跳 home 的根因。
function smartBack(fallback) {
  if (window.history.length <= 1) {
    location.href = fallback;
    return;
  }
  var start = location.href;
  try {
    history.back();
  } catch (e) {
    location.href = fallback;
    return;
  }
  setTimeout(function () {
    if (location.href === start) location.href = fallback;
  }, 300);
}
