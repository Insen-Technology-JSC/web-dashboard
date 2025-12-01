
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { CookieStore } from '$lib/server/CookieStore';
import fetch from 'node-fetch';
import type { HomePosition, HomeInfoRes } from '$lib/types/home';
const TAG = '[home_map]';


// 🧩 Hàm 1: Lấy danh sách home
async function getHomesList(USER_ID: string, TOKEN: string) {
    const BASE_API_URL = env.BASE_API_URL ?? '';
    const GET_HOMES_URL = `${BASE_API_URL.replace(/\/$/, '')}/things/v1/user/${USER_ID}/homes`;

    console.log(`${TAG} GET_HOMES_URL = ${GET_HOMES_URL}`);

    const res = await fetch(GET_HOMES_URL, {
        method: 'GET',
        headers: {
            'Authorization': TOKEN,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error(`${TAG} get homes API returned ${res.status}`);
    }

    return await res.json();
}


// 🧩 Hàm load chính cho SvelteKit
export const load: PageServerLoad = async ({ cookies }) => {
    const store = new CookieStore(cookies);
    const sessionText = store.getSessionBody();

    let id = '';
    let token = '';

    if (sessionText) {
        try {
            const data = JSON.parse(sessionText);
            id = data?.session?.identity?.id ?? '';
            token = data?.session_token ?? '';
        } catch {
            console.warn(`${TAG} Failed to get user from session`);
        }
    }

    if (!id || !token) {
        console.error(`${TAG} Missing user session`);
        return { listHome: [] };
    }

    const USER_ID = id;
    const TOKEN = 'Bearer ' + token;
    try {
        const listHome = await getHomesList(USER_ID, TOKEN);
        const homePositions: HomePosition[] = (listHome as HomeInfoRes[])
            .filter(h => h.location && typeof h.location.lat === 'number' && typeof h.location.long === 'number')
            .map((h) => ({
                id: h.hub_id,
                name: h.name,
                lat: h.location!.lat!,
                long: h.location!.long!,
                status: h.connected,     // true/false
                address: h.address
            }));

        return {
            listHome,
            homePositions
        };
    } catch (error) {
        console.log(`${TAG} get homes error = ${error}`);
        return { listHome: [], homePositions: [] };
    }
};
