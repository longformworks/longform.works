import type { Locale, Status } from '../i18n';

/** 作品清单。加一条即会出现在首页目录里；href 留空表示尚无子页面。 */
export interface Work {
  /** 单字标识，对应应用图标上的字 */
  glyph: string;
  /** 中文名 */
  name: string;
  /** 拉丁名 */
  latin: string;
  /** 一句话说明，分语言 */
  summary: Record<Locale, string>;
  platform: string;
  year: number;
  status: Status;
  href?: string;
}

export const works: Work[] = [];
