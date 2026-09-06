# longform.works

长作 Longform Works 的站点。Astro 静态站，部署在 Cloudflare Workers（静态资源 + 一个做域名跳转的小 Worker）。设计决策见 [DESIGN.md](DESIGN.md)。

## 本地

```sh
npm install
npm run dev        # 开发服务器
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
```

## 结构

| 位置 | 内容 |
|---|---|
| `src/pages/index.astro` | 首页：共用页眉 + 中英两份正文 + 共用页脚 |
| `src/pages/works.astro` | 作品页 `/works`，列表来自 `works.ts`，为空时只显示一句说明 |
| `src/pages/404.astro` | 404 |
| `src/components/Home.astro` | 首页正文：左边名字与一句话，右边红色方块里溢出边框的「长」 |
| `src/components/SiteHeader.astro` | 页眉：印章、「作品」链接（有作品时）、EN / 中文 开关 |
| `src/components/SiteFooter.astro` | 页脚：署名与 GitHub |
| `src/components/Seal.astro` | 印章「长」 |
| `src/components/WorksList.astro` | 作品列表 |
| `src/components/SkipLink.astro` | 键盘跳转链接 |
| `src/i18n/index.ts` | 全部文案，中英各一份；改文案只改这里 |
| `src/data/works.ts` | 作品清单，目前为空；加一条即出现在 `/works` 与页眉 |
| `src/scripts/lang.ts` | 语言切换与落印重播 |
| `src/layouts/Base.astro` | HTML 外壳、meta、字体预加载、首屏语言判断 |
| `src/styles/global.css` | 颜色 / 字体 / 版心 token，浅深两套；中文排版规则 |
| `src/generated/` | 由脚本生成：字体 CSS、预加载清单、印章字形路径 |
| `scripts/subset-fonts.mjs` | 生成字体子集与字形路径，见下 |
| `scripts/make-images.swift` | 生成 `public/og.png` 与 `public/apple-touch-icon.png` |
| `public/_headers` | Cloudflare 静态资源的缓存头 |
| `worker/index.ts` | `longform.work`、`www.*` 301 到 `longform.works` |
| `wrangler.jsonc` | Worker 名、静态资源目录、四个自定义域名 |

## 字体

品牌名用 Spectral + 思源宋体，正文用 Source Sans 3 + 思源黑体，全部自托管。拉丁字体来自 npm 包 `@fontsource/*`；中文源字体不入库，放在 `.cache/fonts/`：

```sh
mkdir -p .cache/fonts
base=https://github.com/notofonts/noto-cjk/raw/main
curl -L -o .cache/fonts/NotoSerifCJKsc-Regular.otf  $base/Serif/OTF/SimplifiedChinese/NotoSerifCJKsc-Regular.otf
curl -L -o .cache/fonts/NotoSerifCJKsc-SemiBold.otf $base/Serif/OTF/SimplifiedChinese/NotoSerifCJKsc-SemiBold.otf
curl -L -o .cache/fonts/NotoSansCJKsc-Regular.otf   $base/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf
curl -L -o .cache/fonts/NotoSansCJKsc-Medium.otf    $base/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Medium.otf
node scripts/subset-fonts.mjs
```

改了中文文案或作品名之后要重新跑一次，否则新字没有字形。脚本会同时写出 `public/fonts/*.woff2`（带哈希）、`src/generated/fonts.css`、`fonts.json`、`glyphs.json` 与 `public/favicon.svg`。

## 部署

推到 `main` 即由 GitHub Actions 构建并 `wrangler deploy`。需要两个仓库 secret：

- `CLOUDFLARE_API_TOKEN`：Workers Scripts:Edit、Workers Routes:Edit、Zone:Read、DNS:Edit（两个 zone）
- `CLOUDFLARE_ACCOUNT_ID`

本地手动部署：`npm run build && npx wrangler deploy`（需先 `npx wrangler login` 或设置 `CLOUDFLARE_API_TOKEN`）。

## 加一个作品

在 `src/data/works.ts` 里加一条（单字图标、中英文名、两种语言的一句话、平台、年份），跑一次字体脚本。要做子页面就在 `src/pages/` 下新建，例如 `guanyin.astro`，再把 `href` 填上。
