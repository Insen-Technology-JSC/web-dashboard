import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { CookieStore } from '$lib/server/CookieStore';
const json = (r: Response) => r.json();
// export const prerender = true;

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
  try {
    const posts = await fetch('/api/posts').then(json);
    const ANALYTICS_ID = env.ANALYTICS_ID;
    const store = new CookieStore(cookies);
    const sessionText = store.getSessionBody();
    let user: { name?: string; email?: string; avatar?: string } | undefined;
    if (sessionText) {
      try {
        const data = JSON.parse(sessionText);
        const traits = data?.session?.identity?.traits ?? {};
        const first = traits?.name?.first ?? '';
        const last = traits?.name?.last ?? '';
        user = {
          name: `${first} ${last}`.trim() || traits?.email || traits?.phone,
          email: traits?.email,
          avatar: traits?.avatar_url
        };
        // console.log('[LayoutServerLoad]Loaded user from session:', user);
      } catch {
        // ignore parse errors
      }
    }
    return { ANALYTICS_ID, posts, user };
  } catch (error) {
    console.error(`Error in load function for /: ${error}`);
  }
};
