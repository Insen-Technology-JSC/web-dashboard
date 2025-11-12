import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { CookieStore } from '$lib/server/CookieStore';

export const GET: RequestHandler = async ({ cookies }) => {
    const store = new CookieStore(cookies);
    store.set('session', ``, { maxAge: 60 * 60 * 24 });
    throw redirect(303, '/sign-in');
};


