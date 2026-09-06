// 字体产物生成：
// 1. 从思源宋体 / 思源黑体（Noto CJK SC）里抽出页面实际用到的汉字与标点，生成小体积 woff2
// 2. 把 Spectral / Source Sans 3 的拉丁 woff2 从 npm 包复制出来
// 3. 文件名带内容哈希，写出 src/generated/fonts.css（@font-face）与 fonts.json（预加载清单），
//    这样 /fonts/* 可以设成一年不过期的缓存
// 4. 把印章用字转成 SVG 路径，避免依赖访客机器上的字体
// 用法：node scripts/subset-fonts.mjs
// 源字体放在 .cache/fonts/（不入库）：
//   https://github.com/notofonts/noto-cjk/raw/main/Serif/OTF/SimplifiedChinese/NotoSerifCJKsc-{Regular,SemiBold}.otf
//   https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-{Regular,Medium}.otf
import subsetFont from 'subset-font';
import opentype from 'opentype.js';
import { readFileSync, writeFileSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

// 只收文案与作品数据里字符串字面量用到的字，加少量标点（宋体与黑体共用同一字集）
const CJK = /[　-〿㐀-䶿一-鿿豈-﫿＀-￯—…“”‘’·]/g;
const ALWAYS = '，。、：；（）「」·';

const chars = new Set(ALWAYS);
for (const f of ['src/i18n/index.ts', 'src/data/works.ts']) {
  // 只看字符串字面量，不收注释里的字
  const src = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  for (const m of src.matchAll(/'([^'\\]*)'|`([^`]*)`/g)) {
    for (const c of (m[1] ?? m[2]).matchAll(CJK)) chars.add(c[0]);
  }
}
const text = [...chars].sort().join('');
console.log(`${chars.size} characters`);

const OUT = 'public/fonts';
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith('.woff2')) unlinkSync(join(OUT, f));

/** 写入带哈希的文件名，返回 URL */
function emit(name, buf) {
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 8);
  const file = `${name}.${hash}.woff2`;
  writeFileSync(join(OUT, file), buf);
  console.log(`${file}  ${(buf.length / 1024).toFixed(1)} KB`);
  return `/fonts/${file}`;
}

const faces = [
  { family: 'Noto Serif SC', weight: 400, name: 'noto-serif-sc-400', src: 'NotoSerifCJKsc-Regular.otf', preload: true },
  { family: 'Noto Serif SC', weight: 600, name: 'noto-serif-sc-600', src: 'NotoSerifCJKsc-SemiBold.otf' },
  { family: 'Noto Sans SC', weight: 400, name: 'noto-sans-sc-400', src: 'NotoSansCJKsc-Regular.otf' },
  { family: 'Noto Sans SC', weight: 500, name: 'noto-sans-sc-500', src: 'NotoSansCJKsc-Medium.otf' },
  { family: 'Spectral', weight: 400, name: 'spectral-400', copy: 'node_modules/@fontsource/spectral/files/spectral-latin-400-normal.woff2', preload: true },
  { family: 'Source Sans 3', weight: 400, name: 'source-sans-3-400', copy: 'node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2', preload: true },
  { family: 'Source Sans 3', weight: 500, name: 'source-sans-3-500', copy: 'node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-500-normal.woff2' },
];

const css = [];
const preload = [];
for (const f of faces) {
  const buf = f.copy
    ? readFileSync(f.copy)
    : await subsetFont(readFileSync(join('.cache/fonts', f.src)), text, { targetFormat: 'woff2' });
  const url = emit(f.name, buf);
  css.push(`@font-face {
  font-family: '${f.family}';
  font-style: normal;
  font-weight: ${f.weight};
  font-display: swap;
  src: url('${url}') format('woff2');
}`);
  if (f.preload) preload.push(url);
}
mkdirSync('src/generated', { recursive: true });
writeFileSync('src/generated/fonts.css', `/* 由 scripts/subset-fonts.mjs 生成，勿手改 */\n${css.join('\n')}\n`);
writeFileSync('src/generated/fonts.json', JSON.stringify({ preload }, null, 2) + '\n');

// 印章用字 → 路径（1000 upem，y 向下，已翻转到 SVG 坐标）
const font = opentype.parse(readFileSync('.cache/fonts/NotoSerifCJKsc-SemiBold.otf').buffer);
const glyphs = {};
for (const ch of ['长']) {
  const g = font.charToGlyph(ch);
  const path = g.getPath(0, 0, 1000);
  const bb = path.getBoundingBox();
  glyphs[ch] = { d: path.toPathData(1), x1: bb.x1, y1: bb.y1, x2: bb.x2, y2: bb.y2, advance: g.advanceWidth };
}
writeFileSync('src/generated/glyphs.json', JSON.stringify(glyphs));
console.log('glyph paths written');

// favicon：同一枚印章，路径版，不依赖字体
{
  const g = glyphs['长'];
  const cx = (g.x1 + g.x2) / 2, cy = (g.y1 + g.y2) / 2, k = 0.062;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M6 4 H93 Q96 4 96 7 V94 Q96 96 93 96 H8 Q4 96 4 92 V7 Q4 4 6 4 Z" fill="#a31f34"/>
  <path d="${g.d}" fill="#eef1f5" transform="translate(50 50) scale(${k}) translate(${-cx} ${-cy})"/>
</svg>
`;
  writeFileSync('public/favicon.svg', svg);
  console.log('favicon written');
}
