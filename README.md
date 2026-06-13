# StrikeAgent Web

StrikeAgent 产品展示站点 —— 面向攻防的智能体平台介绍页（纯前端，无后端 API）。

**作者：** [Bouquets-ai](https://github.com/Bouquets-ai)

---

## 项目说明

单页营销/介绍站点，展示 StrikeAgent 的运行时联动架构、Attack Brain 与 StrikeAgent-Coder 等核心能力。支持中英文切换、明暗主题，并带有 Canvas 准星背景与 SVG 流程动画。

| 板块 | 说明 |
|------|------|
| Hero | 品牌主视觉与入口 |
| Runtime Linkage | 端到端联动流程图（CLI → Attack Brain → 四域产品 → 结果回环） |
| Core | Attack Brain 决策环 + StrikeAgent-Coder 代码审计演示 |
| Footer | 版本信息与作者链接 |

---

## 技术栈

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [anime.js 4](https://animejs.com/) — 滚动入场、SVG 路径动画

---

## 快速开始

### 环境要求

- Node.js 18+
- npm（或兼容的包管理器）

### 安装与运行

```bash
npm install
npm run dev
```

开发服务器默认监听 **http://localhost:2233**（见 `vite.config.ts`，`strictPort: true`）。

### 其它脚本

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器（HMR） |
| `npm run build` | TypeScript 编译 + 生产构建，输出到 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run deploy` | 将 `dist/` 部署到 GitHub Pages（需配置 `gh-pages`） |

---

## 测试与数据

### 测试

**当前仓库没有自动化测试。**

- `package.json` 中无 `test` / `lint` 脚本
- 无 `*.test.*` / `*.spec.*` 文件
- 未集成 Vitest、Jest、Playwright 等测试框架

验证方式目前为：本地 `npm run dev` 目视检查，以及 `npm run build` 确认 TypeScript 与 Vite 构建通过。

### 数据（非测试用例，均为前端静态展示数据）

| 位置 | 内容 |
|------|------|
| `src/data/products.ts` | 产品矩阵：能力模块、四域 Agent、Attack Brain 等结构化文案（中英双语） |
| `src/i18n.ts` | 页面 UI 文案字典（导航、Hero、Linkage、Core、Footer 等） |
| `src/components/ReconBackground.tsx` | 背景准星锁定时的 Top 20 CVE 编号列表（展示用，随机弹出） |
| `src/components/Core.tsx` | CodeScan 组件内的示例代码片段（动画演示，非真实项目代码） |

没有独立的 `fixtures/`、`mocks/`、`testdata/` 目录，也不依赖外部 JSON/API 拉取数据。

---

## 目录结构

```
WEB端/
├── public/              # 静态资源（favicon 等）
├── src/
│   ├── App.tsx          # 页面编排
│   ├── main.tsx         # 入口
│   ├── index.css        # 全局样式与主题变量
│   ├── i18n.ts          # 文案字典
│   ├── components/      # UI 组件
│   │   ├── Hero.tsx
│   │   ├── AgentLinkage.tsx
│   │   ├── Core.tsx
│   │   ├── ReconBackground.tsx
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   ├── context/
│   │   └── AppContext.tsx   # 主题 / 语言 Context
│   ├── data/
│   │   └── products.ts      # 产品与领域静态数据
│   └── hooks/
│       └── useReveal.ts     # 滚动入场 IntersectionObserver
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 配置说明

- **端口：** `vite.config.ts` → `server.port: 2233`
- **构建 base：** `./`（相对路径，便于 GitHub Pages 子路径部署）
- **主题 / 语言：** 由 `AppContext` 持久化到 `localStorage`

---

## 构建与部署

```bash
npm run build
npm run preview   # 可选：本地验证 dist
```

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages：

**https://bouquets-ai.github.io/StrikeAgent-Web/**

也可本地手动部署（需已配置 `gh-pages` 与 GitHub 凭据）：

```bash
npm run deploy
```

---

## 作者

**Bouquets-ai**

- GitHub：https://github.com/Bouquets-ai

---

## 许可

未在仓库中单独声明 License 文件；如需开源发布，请补充 `LICENSE`。
