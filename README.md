# Antigravity 主题美化与深度汉化增强补丁 (v5.1.4+ · 完整适配 Antigravity 2.31.0)

[![Version](https://img.shields.io/badge/version-5.1.4%2B-7A1F1A.svg)](https://github.com/bbwx91697-hash/antigravity-chinese-patch)
[![Antigravity](https://img.shields.io/badge/Antigravity-2.31.0%2B-D97757.svg)](https://github.com/bbwx91697-hash/antigravity-chinese-patch)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0%20(22.13%2B%20Full)-339933.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/bbwx91697-hash/antigravity-chinese-patch)

> **本项目基于船板原作 [`Anarcadia/chuanban-antigravity-theme-patch`](https://github.com/Anarcadia/chuanban-antigravity-theme-patch)（v5.1.4）二开优化。**  
> 在完整保留原版 `core/` 暖纸/官方碳黑昼夜主题、四层字体与实时指标胶囊的基础上，通过 `user/` 无损改装层**补全了新版客户端多处遗漏汉化**，并新增 **Windows/macOS/Linux 一键安装脚本** 与 **GitHub 字体备用方案**。  
> 供 AI Agent 自动部署与二次改装读取的完整技术契约位于仓库根目录 **[`SKILL.md`](SKILL.md)**。

---

## ⚡ 30 秒极速安装（三选一，新手推荐方式 1 或 2）

### 方式 1：复制给你的 AI Agent 一键全自动部署（最省心）
直接把下面这段话发给 Antigravity / Claude Code / Cursor / Codex，它会自动完成**检查环境 → 下载并注册字体 → 安装守护服务 → 实机验证**：

> **💬 复制发给 Agent（一键安装）**：  
> 请帮我克隆 `https://github.com/bbwx91697-hash/antigravity-chinese-patch.git`（或读取我已下载解压的补丁目录），严格按照仓库内的 `SKILL.md` 依次执行 `node install.mjs doctor`（若未安装字体则先下载并安装，Google Drive 限流时自动改用 `SKILL.md` 中的 GitHub 字体备用源，Windows 用 `node install.mjs install-fonts` 注册）、`node install.mjs install` 和 `node install.mjs verify`，帮我一键部署好并验证实机生效。

### 方式 2：双击一键安装脚本（不用敲命令）
前提：已安装 **Node.js `>= 22.0.0`**（推荐 `>= 22.13.0` 以解锁底部实时指标胶囊）。
1. 点击右上角 `Code` → `Download ZIP` 并解压（或 `git clone https://github.com/bbwx91697-hash/antigravity-chinese-patch.git`）。
2. **Windows 用户**直接双击运行根目录的 **[`install.bat`](install.bat)**；**macOS / Linux 用户**在终端运行 `bash install.sh`。
3. 脚本会自动检查环境、安装补丁、注册开机守护进程并校验注入结果。若字体尚未安装，可把字体放到同目录的 `fonts/` 文件夹下再运行一次脚本即可自动注册。

### 方式 3：命令行 2 步安装
```bash
git clone https://github.com/bbwx91697-hash/antigravity-chinese-patch.git
cd antigravity-chinese-patch
# （可选）若已下载字体到 ./fonts，Windows/macOS/Linux 通用：
node install.mjs install-fonts --from ./fonts
# 一键安装并实机验证：
node install.mjs install && node install.mjs verify
```

> **💡 首次开启提示**：第一次运行 `install` 会自动往 `~/.antigravity/argv.json` 写入调试端口 `9222`。如果安装前 Antigravity 已经打开且 `verify` 未连上，**完全退出并重新打开一次 Antigravity** 即可自动生效。

---

## 🆕 本增强版新增汉化与优化清单（基于船板 v5.1.4）

在原版 900 条核心词典之上，已在 `user/i18n.override.json`（73 条静态覆盖）与 `user/custom.js` 中补全以下高频遗漏界面：
1. **首页动态欢迎语全覆盖**：支持 Antigravity 3 组随机轮换问候语（含「带用户名 / 无用户名」全部 6 种形态：`Hey ... what should we build today?`、`Welcome back ... Where should we pick up?`、`Good to see you ... What's next?`）。
2. **左侧边栏对话列表时间标签**：将紧凑相对时间 `now` / `m` / `h` / `d` / `w` / `mo` / `y` 汉化为 `刚刚` / `X分钟前` / `X小时前` / `X天前` / `X周前` / `X个月前` / `X年前`（精准限定于时间标签节点，不误伤正文与代码）。
3. **悬停卡片与会话菜单补全**：补全 `Outside of Project`（未关联项目）、`Archive Conversation`（归档会话）、`Share`（分享）、`Coordinators`（协调者）、`No coordinators`（暂无协调者）、`Open Conversation`（打开会话）、`Rename Conversation`（重命名会话）等。
4. **新版权限审批卡片（`ask_permission`）全量汉化**：覆盖读写路径、命令执行、沙箱外运行、网址与下载、MCP 工具、UAC 提权等 21 种询问/保存规则标题；静态与带域名/规则名变量的 `Yes, allow ...` 选项；第 4 行限定作用域的 `No` → `否` 与输入框提示 `（告诉智能体改做什么）`；`Skip` → `跳过`、`Waiting for user input` → `等待用户输入`、`Exited with code N` → `退出码 N` 等。
5. **开箱体验与稳定性优化**：移除 `user/i18n.override.json` UTF-8 BOM 以确保覆盖词典稳定生效；新增 [`install.bat`](install.bat) / [`install.sh`](install.sh) 一键安装脚本；在 `SKILL.md` 中补充 Google Drive 限流时的 GitHub 开源字体备用获取路径。

---

## 🔗 核心资源链接与字体下载

| 资源名称 | 链接地址 | 说明 |
| :--- | :--- | :--- |
| **1. 本仓库（增强整合版）** | [**bbwx91697-hash/antigravity-chinese-patch**](https://github.com/bbwx91697-hash/antigravity-chinese-patch) | 包含完整 `core/` + 增强版 `user/` + 一键脚本 [`install.bat`](install.bat) / [`install.sh`](install.sh) + [`SKILL.md`](SKILL.md)。 |
| **2. 原作权威仓库（船板）** | [**Anarcadia/chuanban-antigravity-theme-patch**](https://github.com/Anarcadia/chuanban-antigravity-theme-patch) | 主题内核 `core/`、CLI 与原版设计均源自船板大佬。 |
| **3. Google Drive 完整资源包（含字体）** | [**Google Drive 官方共享文件夹**](https://drive.google.com/drive/folders/1NX92SgVUqtSjWg6bt6sIJXy-cn7J_boC) | 内置 **Anthropic 官方字体族**（`Anthropic Sans` / `Anthropic Serif` / `Anthropic Mono`）与 **更纱黑体超集**（`Sarasa-SuperTTC.ttc`）。 |
| **4. 字体备用源（Google Drive 限流时）** | [**anthropic-fonts**](https://github.com/matthieuhuguet/anthropic-fonts) & [**Sarasa-Gothic Releases**](https://github.com/be5invis/Sarasa-Gothic/releases) | 若 Google Drive 提示 `Quota exceeded`，可从这两个 GitHub 开源仓库获取对应字体文件。 |
| **5. Notion 原版引导页** | [**chuanban-antigravity-theme-patch**](https://chuanban.notion.site/chuanban-antigravity-theme-patch-db7c5846f37546be9481cd791aed0554) | 原作者说明与部署引导主页。 |

---

## 🖼️ 实机样式演示

### 1. 三栏工作台：高对比暖纸主题 + 古朴暗红蜡封输入框 + 同行实时指标胶囊 + 书卷衬线工件
![三栏对话与工件阅读视图](assets/preview-workspace-chat-and-artifact.png)

### 2. 新建对话首页：全界面深度汉化 + 聚焦浮现淡雅暗红蜡封外框
![新建对话首页视图](assets/preview-home-new-conversation.png)

---

## ✨ 补丁简介：核心定位与五大亮点（v5.1.4）

### 1. 设计目的
Google Antigravity 原生浅色界面偏冷刺眼、全局仅使用单一无衬线字体，长时间高强度阅读与编码容易视觉疲劳。本补丁以**纯运行时非侵入注入**的方式，将 Antigravity 重塑为兼具 **Anthropic 暖纸学术质感、官方原版高可读深色模式、四层中西文精密排版、全界面母语级汉化与实时模型遥测** 的主力工作台：

- **🌓 昼夜双模式独立解耦（暖纸白天 + 官方碳黑黑夜）**：
  - **白天模式（Light）**：内置 **高对比暖白**（默认，暖燕麦侧栏 `#F7F5F0` + 微暖亮白主区 `#FCFCFB` + 深墨文字 `#0A0A0A`）、**ClaudeDesktop 净白** 与 **复古深色羊皮纸** 三套护眼预设；
  - **黑夜模式（Dark）**：当你点击设置中的「深色 / Dark」按钮（或跟随系统深色）时，**100% 保持四层字体与 UI 形状要素不变**，同时 `0ms` 自动还原 **Antigravity `2.30.0 / 2.31.0` 官方无补丁时的 `onyx` Default Dark 碳黑配色方案**（`#070708` 主背景 / `#111114` 侧栏 / `#15151A` 悬浮输入卡 / `#2F71E3` 官方品牌蓝），并专项提升深色下的文字对比度、卡片边界与指标可读性。
- **🔤 四层字体排版（昼夜完全共用 · 原生适配 `2.31.0` `[data-markdown-root]` 与 Lexical 编辑器）**：UI 控件采用 `Anthropic Sans` + `Sarasa UI SC`，阅读正文采用 `Anthropic Serif` 古典衬线 + `Sarasa Mono Slab SC`，代码与终端采用严格 1:2 等宽，主输入框独立配置 Codex 同款打字机板状粗衬线。
- **🕯️ 输入框三态 `1.5px` 交互结构**：区分「新建对话首页」与「日常聊天会话」自动切换外框呼吸感与聚焦反馈（白天为古朴暗红蜡封，黑夜为官方微亮边与 `#2F71E3` 品牌蓝聚焦光环）。
- **🇨🇳 900 条深度汉化（全覆盖 `2.31.0` Worktree、`/btw` 旁路提问、Browserbase、权限/努力程度动态标签、用量明细与右侧边栏启动面板） + ⚡ `O(1)` 增量实时指标胶囊**：全覆盖隐藏菜单、折叠式工具调用进度条与 15+ 个设置子页（基于 `WeakMap` `O(1)` 隔离保护代码块、Monaco 编辑器、终端与对话正文不误伤），并在输入框底部同行实时展示生成速度（`tok/s`）、首字耗时（`TTFT`）、`256k` 上下文水位及缓存命中率详情面板。

### 2. 五大工程亮点
1. **🤖 Agent 3 秒一键部署，零构建零依赖**：所有 CSS、词典、DOM 引擎与守护进程已预封装在 `core/` 只读内核中，无需任何 npm 依赖或编译构建，交给你的 Agent 即可 3 秒一键安装。
2. **🛠️ 开放 `user/` 独立改装层，2.5 秒热重载**：内置升级永不覆盖的 `user/` 改装层（`config.json` / `custom.css` / `i18n.override.json` / `custom.js`）。想换配色、改字号、微调颜色或增改汉化词条，只需直接跟 Agent 对话，保存后 2.5 秒内自动热生效。
3. **🛡️ 纯运行时 CDP 注入，绝不改动客户端本体**：仅通过本地 `127.0.0.1` Chrome DevTools Protocol 在渲染层动态注入，不拆包 `.asar`、不破坏系统签名，且自动拦截修复官方设置弹窗路由死锁问题。
4. **🔄 客户端日常小版本更新后自动延续**：配合系统常驻守护服务（macOS `LaunchAgent` / Windows 计划任务自启 / Linux `systemd`）自动探测窗口与重连注入，单守护进程同时兼容 **Stable 正式版** 与 **Insiders 预览版**。
5. **💻 macOS 与 Windows 双平台原生统一体验**：内置 Windows 字体一键注册表写入命令 `install-fonts`、ClearType 抗锯齿自动适配、SQLite `O(1)` 增量只读游标缓存与 `Cmd/Ctrl + -/=/0` 缩放快捷键修复（兼容 `2.31.0` `resetZoom`）。

---

## 🚀 升级、定制与排障指南

### 一、老版本用户无缝升级至本增强版
`node install.mjs install` 会自动备份旧内核、接管旧版常驻服务，并无损保留你已有改装配置（如从原版升级且未改过 `user/`，可直接用本仓库的 `user/` 覆盖获取增强汉化）：

> **💬 复制发给 Agent（无缝升级）**：  
> 请帮我拉取最新的 `https://github.com/bbwx91697-hash/antigravity-chinese-patch.git`，阅读其中的 `SKILL.md`，运行 `node install.mjs install` 和 `node install.mjs verify` 完成升级；若我本地 `user/` 中此前做过自定义配置，请与新版 `user/custom.js`、`user/i18n.override.json` 合并保留。

### 二、后续与 Agent 对话定制风格或排障
- **🎨 切换白天预设、调整字号或微调外观**：
  > 请参考 `~/.gemini/antigravity/theme-patch/SKILL.md` 的 `user/` 改装规范，只修改 `user/` 目录下的配置文件：帮我把白天配色预设切换为「ClaudeDesktop 净白」（或「复古深色」） / 把对话正文字号调为 `16.5px` / 在 `user/custom.css` 里微调某处样式。
- **🇨🇳 自定义修改或新增某条汉化词条**：
  > 请在 `~/.gemini/antigravity/theme-patch/user/i18n.override.json` 中添加或修改词条，把界面上的 `"某英文原词"` 改成 `"我想要的中文"`，确认 2.5 秒内页面实时热更新生效。
- **🔍 自我 Debug 或一键回滚**：
  > 当前 Antigravity 界面有点异常，请按照 `~/.gemini/antigravity/theme-patch/SKILL.md` 先运行 `node install.mjs doctor`，再用 `node install.mjs verify --safe-mode` 排查是否是 `user/` 自定义层冲突；如需恢复上一版本请执行 `node install.mjs rollback`。

---

## 🕒 版本演进简史

- **2026-11-11（v5.1.4 现行版 · 实时指标胶囊运行态同行稳定化与 `flex-col` 越界根治）**：
  修复 `2.31.0` `.surface-composer-card`（`flex-direction: column`）下折行胶囊 `flex-basis: 100%` 纵向撑高溢出输入框底边的 CSS 缺陷；回调常规窗口恒定同行阈值（`< 165px` 窄栏进入、`>= 180px` 滞回恢复），并为 `ResizeObserver` 补齐左右按钮组宽度签名监听与会话路由切换强制重算，彻底消除会话运转时指标行掉出框外及跨会话状态串染。
- **2026-11-11（v5.1.3 · Antigravity `2.31.0` 双端全量合并与性能/安全深度加固）**：
  1. **`2.31.0` 新架构全量对齐与 900 条汉化词典**：适配 `[data-markdown-root]` 流式渲染容器、Lexical 输入框与占位符等距 Slab 排版、生成中止按钮（`input-cancel-button`）昼夜双态样式、Base UI `[role="listbox"]` 弹层排版、`electronNative.resetZoom` 重置缩放 API 与内置浏览器透明打孔（`data-has-browser-hole`）；词典扩充至 **900 条零重复词条**，并补齐模型努力程度（`Low/Medium/High/Max`）、权限模式、对话轮次与相对时间的动态翻译及权限编辑器 `aria-label="Cancel"` 安全豁免；
  2. **`O(1)` 性能跃迁与全生命周期无逃逸治理**：`core/daemon.mjs` SQLite 遥测引擎升级为双游标独立坐标系 `O(1)` 增量读取（支持 `Undo` 回退自愈与 `200ms` 锁超时），消除超长会话全表扫描开销；`core/runtime.js` 引入 `WeakMap` 不可变容器 `O(1)` 缓存短路、早期 `<head>` 注入 `DOMContentLoaded` 自愈挂载、胶囊实测宽度滞回防抖与 `ctx.onCleanup(fn)` 生命周期钩子；`install.mjs` 升级为 JSONC 注释安全 `argv.json` 解析、Windows 单一权威 `schtasks` 自启与无竞态卸载还原。
- **2026-11-11（v5.1.2 · `2.31.0` 内置浏览器透明打孔、用量/右侧边栏汉化与 Opus 对抗审查加固）**：
  修复内置浏览器 `data-has-browser-hole="true"` 透明打孔兼容、`html[style]` 昼夜切换竞争、`<input>` 占位符翻译引擎、`applyThemeVars` 样式表优先级顺序及 macOS `LaunchAgent` 孤立进程 `PATH` 注入。
- **2026-11-10（v5.1.1 · Windows DirectWrite 双轴可变字体与计划任务常驻修复）**：
  兼容 OpenType `STAT` 表 `opsz` 轴生成的 `'Anthropic Serif/Sans Web Display Light'` 家族名及 macOS `CoreText` PostScript 名称，接入 Windows `schtasks` 计划任务常驻与 `.gitattributes` `CRLF -> LF` 自动自愈。
- **2026-11-10（v5.1.0 · 昼夜双模式独立解耦 & 全栈去冗余精简）**：
  白天模式保留三套暖纸预设与古朴暗红蜡封，黑夜模式还原官方 `onyx` Default Dark 碳黑配色（`#070708` / `#111114` / `#15151A` / `#2F71E3`），并通过 CSS 变量化重构精简 47% 样式体积。
- **2026-11-04 ~ 2026-11-10（v5.0.0 ~ v5.0.1）**：
  升级为「`core/` 只读黄金内核 + `user/` 2.5 秒可逆热重载改装层 + `install.mjs` 生命周期 CLI」架构，完整对齐 `2.30.0` `Knowledge Work` 模式。
