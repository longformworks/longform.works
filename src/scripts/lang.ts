export type Lang = 'en' | 'zh';

const KEY = 'lang';

/** 让语言按钮的 aria-pressed 与当前语言一致 */
export function syncSwitch() {
  const lang = document.documentElement.dataset.lang as Lang;
  document.querySelectorAll<HTMLButtonElement>('[data-switch-to]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.switchTo === lang));
  });
}

/** 印章再落一次：动作回应切换 */
function restamp() {
  document.querySelectorAll<SVGElement>('.seal--stamp').forEach((el) => {
    el.classList.remove('seal--stamp');
    void el.getBoundingClientRect();
    el.classList.add('seal--stamp', 'seal--restamp');
  });
}

export function setLang(lang: Lang, persist = false) {
  if (document.documentElement.dataset.lang === lang) return;
  document.documentElement.dataset.lang = lang;
  restamp();
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  syncSwitch();
  if (persist) {
    try {
      localStorage.setItem(KEY, lang);
    } catch {}
  }
}
