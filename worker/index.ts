/**
 * Cloudflare Worker：静态资源之前的一层。
 * 1. longform.work 与 www.* 一律 301 到 https://longform.works
 * 2. 其余请求交给静态资源（Astro 构建产物）
 */
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const CANONICAL_HOST = 'longform.works';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname !== CANONICAL_HOST && !url.hostname.endsWith('.workers.dev')) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
