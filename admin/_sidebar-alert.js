// Sidebar 通用居中弹框，替代 window.alert()
// msg     : 弹框正文
// navHref : 可选，确定后跳转的目标 URL;不传则仅关闭
window.showRuleAlert = function (msg, navHref) {
  // 已有同款弹框时不重复创建
  if (document.getElementById('__sb_alert_mask')) return;

  var mask = document.createElement('div');
  mask.id = '__sb_alert_mask';
  mask.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)';
  var box = document.createElement('div');
  box.style.cssText = 'background:#fff;border-radius:8px;min-width:340px;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden';
  box.innerHTML = '' +
    '<div style="padding:20px 24px 4px;display:flex;align-items:center;gap:8px">' +
      '<span style="display:inline-flex;width:22px;height:22px;border-radius:50%;background:#fff7e6;color:#e6a23c;align-items:center;justify-content:center;font-weight:700">!</span>' +
      '<span style="font-size:15px;font-weight:600;color:#303133">提示</span>' +
    '</div>' +
    '<div style="padding:14px 24px 20px;font-size:14px;color:#606266;line-height:1.6">' + msg + '</div>' +
    '<div style="padding:12px 20px;border-top:1px solid #ebeef5;background:#fafafa;text-align:right">' +
      '<button data-act="ok" style="height:32px;padding:0 22px;background:#1677ff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px">确定</button>' +
    '</div>';
  mask.appendChild(box);
  document.body.appendChild(mask);

  function close() {
    if (mask.parentNode) mask.parentNode.removeChild(mask);
  }
  // 仅「确定」按钮可关闭(点击遮罩 / 按 ESC 不关闭，避免误触)
  box.querySelector('[data-act="ok"]').onclick = function () {
    close();
    if (navHref) {
      // 锚链接 # 不跳转
      if (navHref.charAt(0) === '#') return;
      location.href = navHref;
    }
  };
};

// 顶部居中 toast 提示，默认 3 秒后消失;可选 navHref 在 toast 消失后跳转
window.showRuleToast = function (msg, navHref, durationMs) {
  var dur = typeof durationMs === 'number' ? durationMs : 3000;
  if (document.getElementById('__sb_toast')) return;
  var t = document.createElement('div');
  t.id = '__sb_toast';
  t.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-12px);background:rgba(15,23,42,.92);color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25);opacity:0;transition:opacity .25s ease,transform .25s ease;display:inline-flex;align-items:center;gap:8px;max-width:80vw';
  t.innerHTML = '<span style="display:inline-flex;width:18px;height:18px;border-radius:50%;background:#1677ff;color:#fff;align-items:center;justify-content:center;font-size:12px;font-weight:700">i</span><span>' + msg + '</span>';
  document.body.appendChild(t);
  requestAnimationFrame(function () { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(function () {
    t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(-12px)';
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
      if (navHref && navHref.charAt(0) !== '#') location.href = navHref;
    }, 260);
  }, dur);
};
