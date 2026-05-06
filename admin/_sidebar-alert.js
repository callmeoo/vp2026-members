// Sidebar 通用居中弹框,替代 window.alert()
window.showRuleAlert = function (msg) {
  var mask = document.createElement('div');
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
  function close() { if (mask.parentNode) mask.parentNode.removeChild(mask); }
  box.querySelector('[data-act="ok"]').onclick = close;
  mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
};
