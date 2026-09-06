# 给协作者与 AI 助手的说明

- 这是 Longform Works（长作）的门面站，Astro 静态站，部署在 Cloudflare Workers。设计决策见 `DESIGN.md`，改之前先读。
- 开发：`npm run dev`（或 `astro dev --background`，用 `astro dev stop` 关）；构建 `npm run build`；预览 `npm run preview`。
- 文案只改 `src/i18n/index.ts`；改了中文之后跑 `node scripts/subset-fonts.mjs` 重新生成字体子集（源字体放 `.cache/fonts/`，见 README）。
- 不要改动 `DESIGN.md` 里标为「定稿」的部分（印章方块、落印动画、配色、字体），除非站主明确要求。
- 推到 `main` 即自动部署。
