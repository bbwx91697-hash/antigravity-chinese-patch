/**
 * user/custom.js — 用户前端扩展钩子
 * 增强汉化：穿透保护区，针对交互选项、审批卡片与按钮进行精准中文替换
 */
(function () {
  const dict = Object.assign(
    {
      "Allow": "允许",
      "Allow once": "仅允许本次",
      "Always allow": "始终允许",
      "Always Allow": "始终允许",
      "Always allow for this session": "本次会话始终允许",
      "Always allow this command": "始终允许此命令",
      "Allow command outside sandbox": "允许在沙箱外执行命令",
      "Always allow command outside sandbox": "始终允许在沙箱外执行命令",
      "This command requires sandbox bypass": "此命令需要在沙箱外运行",
      "Deny": "拒绝",
      "Reject": "拒绝",
      "Proceed": "确认执行",
      "Always Proceed": "始终执行",
      "Cancel": "取消",
      "Run": "运行",
      "Run command": "执行命令",
      "Review": "查看",
      "Review changes": "查看变更",
      "Accept": "接受",
      "Dismiss": "关闭",
      "Confirm": "确认",
      "Ignore": "忽略",
      "Retry": "重试",
      "Select an option": "请选择一个选项",
      "Submit": "提交",
      "Options": "选项"
    },
    (ctx && ctx.dict) || {}
  );

  function translateButton(btn) {
    if (!btn || btn.nodeType !== 1) return;
    if (btn.closest('code, pre, .monaco-editor, [contenteditable="true"]')) return;

    const textNodes = [];
    const walk = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = walk.nextNode())) {
      textNodes.push(n);
    }

    for (const tn of textNodes) {
      const raw = tn.nodeValue;
      const trimmed = raw ? raw.trim() : '';
      if (!trimmed) continue;
      if (dict[trimmed]) {
        tn.nodeValue = raw.replace(trimmed, dict[trimmed]);
      }
    }

    for (const attr of ['title', 'aria-label']) {
      const val = btn.getAttribute(attr);
      if (val && dict[val.trim()]) {
        btn.setAttribute(attr, dict[val.trim()]);
      }
    }
  }

  function scanButtons(root) {
    if (!root) return;
    const target = root.nodeType === 1 ? root : document;
    const selector = 'button, [role="button"], [role="option"], [data-testid*="button"], [data-testid*="action"], [data-testid*="option"]';
    if (target.matches && target.matches(selector)) {
      translateButton(target);
    }
    const buttons = target.querySelectorAll ? target.querySelectorAll(selector) : [];
    for (let i = 0; i < buttons.length; i++) {
      translateButton(buttons[i]);
    }
  }

  // 初始全量扫描
  scanButtons(document.body);

  // 监听动态弹出的卡片和选项按钮
  const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      if (m.type === 'childList') {
        for (let j = 0; j < m.addedNodes.length; j++) {
          const node = m.addedNodes[j];
          if (node.nodeType === 1) {
            scanButtons(node);
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  if (ctx && typeof ctx.onCleanup === 'function') {
    ctx.onCleanup(() => {
      observer.disconnect();
    });
  }
})();


/**
 * 追加扩展：动态文本汉化（首页欢迎语 + 侧边栏紧凑时间 + 权限审批卡片动态句 + 退出码）
 *   1. 首页欢迎语（含用户名动态句）
 *   2. 侧边栏对话列表右侧时间标签（仅限定在 [data-screenshot-volatile].tabular-nums）
 *   3. 新版权限/询问卡片动态文案（含域名/规则名变量选项、限定于 __write_in__ 的 No 标签、提示与退出码）
 * 通过 ctx.onCleanup 在热重载/卸载时自动还原英文原文。
 */
(function () {
  // 首页问候语共 3 种轮换（源自应用 main.js 的 R6 数组），每种分「有名字 / 无名字」两版；
  // 无名字版必须排在前面，避免 "Hey there" 被当作名字 "there" 误匹配。
  const DYNAMIC_HINT = /Welcome back|Hey |Good to see you|Yes, |Requires manual confirmation|Conflicts with your configured Ask permission|Exited with code/;
  const DYNAMIC_RULES = [
    { re: /^Hey there, what should we build today\?$/, to: () => '嗨，今天想做点什么？' },
    { re: /^Welcome back\.\s*Where should we pick up\?$/, to: () => '欢迎回来。我们从哪里继续？' },
    { re: /^Good to see you\.\s*What's next\?$/, to: () => '很高兴见到你。接下来做什么？' },
    { re: /^Hey (.+?), what should we build today\?$/, to: (m) => '嗨，' + m[1] + '，今天想做点什么？' },
    { re: /^Welcome back,\s*(.+?)\.\s*Where should we pick up\?$/, to: (m) => '欢迎回来，' + m[1] + '。我们从哪里继续？' },
    { re: /^Good to see you,\s*(.+?)\.\s*What's next\?$/, to: (m) => '很高兴见到你，' + m[1] + '。接下来做什么？' },
    // 新版权限卡片带变量选项（源自 main.js ask_permission 组件）
    { re: /^Yes, allow downloads from (.+?) for this run$/, to: (m) => '是，本次运行允许从 ' + m[1] + ' 下载' },
    { re: /^Yes, allow downloads from (.+?) in this conversation$/, to: (m) => '是，本次会话允许从 ' + m[1] + ' 下载' },
    { re: /^Yes, always allow downloads from (.+)$/, to: (m) => '是，始终允许从 ' + m[1] + ' 下载' },
    { re: /^Yes, allow (.+?) in this conversation$/, to: (m) => '是，本次会话允许 ' + m[1] },
    { re: /^Yes, always allow (.+)$/, to: (m) => '是，始终允许 ' + m[1] },
    { re: /^Yes, save rule for '(.+?)' in this conversation$/, to: (m) => '是，在本次会话中保存规则“' + m[1] + '”' },
    { re: /^Yes, save rule for '(.+?)' globally$/, to: (m) => '是，全局保存规则“' + m[1] + '”' },
    { re: /^Yes, and always allow '(.+?)' in this conversation$/, to: (m) => '是，且本次会话始终允许“' + m[1] + '”' },
    { re: /^Yes, and always allow '(.+?)'$/, to: (m) => '是，且始终允许“' + m[1] + '”' },
    { re: /^Requires manual confirmation:\s*(.+)$/, to: (m) => '需要手动确认：' + m[1] },
    { re: /^Conflicts with your configured Ask permission:\s*(.+)$/, to: (m) => '与您配置的询问权限冲突：' + m[1] },
    { re: /^Exited with code (\d+)\.?$/, to: (m) => '退出码 ' + m[1] }
  ];
  const TIME_UNIT = { s: '秒前', m: '分钟前', h: '小时前', d: '天前', w: '周前', mo: '个月前', y: '年前' };
  const RE_COMPACT_TIME = /^(\d+)(mo|[smhdwy])$/;
  const originals = new WeakMap(); // 文本节点 -> 原始英文文本，用于还原
  const SKIP = 'code, pre, .monaco-editor, [contenteditable="true"], textarea, input';

  function saveAndSet(tn, raw, nextVal) {
    if (!originals.has(tn)) originals.set(tn, raw);
    if (tn.nodeValue !== nextVal) tn.nodeValue = nextVal;
  }

  function translateTextNode(tn) {
    const raw = tn.nodeValue;
    if (!raw) return;
    const parent = tn.parentElement;
    if (parent && parent.closest(SKIP)) return;
    const trimmed = raw.trim();
    if (!trimmed) return;

    // 仅针对侧边栏会话时间标签（[data-screenshot-volatile].tabular-nums），防止误伤其他区域短词
    if (parent && parent.matches('span[data-screenshot-volatile].tabular-nums')) {
      if (trimmed === 'now') return saveAndSet(tn, raw, raw.replace(trimmed, '刚刚'));
      const tm = RE_COMPACT_TIME.exec(trimmed);
      if (tm) return saveAndSet(tn, raw, raw.replace(trimmed, tm[1] + TIME_UNIT[tm[2]]));
      return;
    }

    // 仅将问询/权限卡片内自定义拒绝行（label[for$="-__write_in__"]）前的 "No" 译为 "否"
    if (trimmed === 'No' && parent && parent.closest('label[for$="-__write_in__"]')) {
      return saveAndSet(tn, raw, raw.replace(trimmed, '否'));
    }

    if (!DYNAMIC_HINT.test(raw)) return;
    for (const rule of DYNAMIC_RULES) {
      const m = rule.re.exec(trimmed);
      if (m) {
        saveAndSet(tn, raw, raw.replace(trimmed, () => rule.to(m)));
        return;
      }
    }
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === 3) return translateTextNode(root);
    if (root.nodeType !== 1) return;
    const txt = root.textContent;
    if (!txt) return;
    const hasScopedNodes = root.matches('span[data-screenshot-volatile].tabular-nums, label[for$="-__write_in__"]') ||
      (root.querySelector && root.querySelector('span[data-screenshot-volatile].tabular-nums, label[for$="-__write_in__"]'));
    if (!DYNAMIC_HINT.test(txt) && !hasScopedNodes) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const list = [];
    let n;
    while ((n = walker.nextNode())) list.push(n);
    for (const tn of list) translateTextNode(tn);
  }

  scan(document.body);

  let pending = false;
  const pendingRoots = new Set();
  const flush = () => {
    pending = false;
    const roots = Array.from(pendingRoots);
    pendingRoots.clear();
    for (const r of roots) scan(r);
  };
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'characterData') {
        pendingRoots.add(m.target);
      } else if (m.type === 'childList') {
        for (const node of m.addedNodes) pendingRoots.add(node);
      }
    }
    if (!pending && pendingRoots.size) {
      pending = true;
      requestAnimationFrame(flush);
    }
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });

  if (ctx && typeof ctx.onCleanup === 'function') {
    ctx.onCleanup(() => {
      observer.disconnect();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let n;
      while ((n = walker.nextNode())) {
        if (originals.has(n)) n.nodeValue = originals.get(n);
      }
    });
  }
})();
