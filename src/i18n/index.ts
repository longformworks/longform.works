/** 页面文案，两种语言。改文案只改这里。 */
export type Locale = 'en' | 'zh';
export type Status = 'in development' | 'released';

export const locales: { code: Locale; lang: string; label: string; name: string }[] = [
  { code: 'en', lang: 'en', label: 'EN', name: 'English' },
  { code: 'zh', lang: 'zh-Hans', label: '中文', name: '中文' },
];

/** 品牌名两种语言相同：大字「长作」，小字 Longform Works */
export const brand = { zh: '长作', latin: 'Longform Works' };

export const copy = {
  en: {
    method: 'Long-term projects, worked on a little at a time.',
    works: 'Works',
    meta: (platform: string) => `For ${platform}`,
    nav: { works: 'Works' },
    worksEmpty: 'Nothing published yet.',
    notFound: 'There is no page here. ',
    notFoundLink: 'Back to the front page',
    notFoundAfter: '.',
    madeBefore: 'Made by ',
    madeName: 'Alvie Zhang',
    madeAfter: '.',
    code: 'GitHub',
    skip: 'Skip to content',
  },
  zh: {
    method: '长作，常做。',
    works: '作品',
    meta: (platform: string) => `适用于 ${platform}`,
    nav: { works: '作品' },
    worksEmpty: '还没有发布的作品。',
    notFound: '这里没有页面。',
    notFoundLink: '回到首页',
    notFoundAfter: '。',
    madeBefore: '由 ',
    madeName: 'Alvie Zhang',
    madeAfter: ' 制作。',
    code: 'GitHub',
    skip: '跳到正文',
  },
} satisfies Record<Locale, unknown>;
