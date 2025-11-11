import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const isPublicPath = (pathname: string) => {
    if (
        pathname === '/sign-in' || //login
        pathname.startsWith('/authentication') ||
        pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up') ||
        pathname.startsWith('/authentication/forgot-password') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/sitemap.xml') ||
        pathname.startsWith('/svelte-kit') ||
        pathname.startsWith('/favicon')
    ) {
        return true;
    }
    // static assets
    if (/\.(css|js|mjs|map|png|jpg|jpeg|gif|svg|ico|webp|woff2?)$/i.test(pathname)) return true;
    return false;
};

export const handle: Handle = async ({ event, resolve }) => {
    const { url, cookies } = event;
    const session = cookies.get('session');

    // If not logged in and trying to access a non-public page, redirect to /login
    if (!session && !isPublicPath(url.pathname)) {
        throw redirect(303, '/authentication/sign-in');
    }

    // If logged in and trying to access /login, send to dashboard
    if (session && url.pathname === '/authentication/sign-in') {
        throw redirect(303, '/');
    }

    return resolve(event);
};


