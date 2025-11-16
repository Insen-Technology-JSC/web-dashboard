
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { CookieStore } from '$lib/server/CookieStore';
import fetch from 'node-fetch';

import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: true });


const TAG = '[home_api]';



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

// 🧩 Hàm 2: Lấy thông tin network cho từng home
async function getNetworkInfoForHome(HUD_ID: string, RESOURCE_SECRET: string, REMOTE_TUNNEL_HTTP: string) {
    console.log(`${TAG} process version= `, process.version);

    if (!REMOTE_TUNNEL_HTTP || REMOTE_TUNNEL_HTTP === '/lte/info') {
        console.log(`${TAG} Skipping empty REMOTE_TUNNEL_HTTP for home`, HUD_ID);
        return null;
    }

    const TOKEN_BASE64 = Buffer.from(`${HUD_ID}:${RESOURCE_SECRET}`, 'utf8').toString('base64');
    const BASIC_TOKEN = `Basic ${TOKEN_BASE64}`;

    console.log(`${TAG} GET_NETWORK_INFO_URL = ${REMOTE_TUNNEL_HTTP} - BASIC_TOKEN = ${BASIC_TOKEN}`);

    try {

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        const res = await fetch(REMOTE_TUNNEL_HTTP, {
            method: 'GET',
            headers: {
                'Authorization': BASIC_TOKEN,
                'Content-Type': 'application/json'
            },
            agent: httpsAgent
        });

        if (!res.ok) {
            console.log(`${TAG} GET_HOME_NETWORK_FAILED status = ${res.status}`);
            return null;
        }

        const json = await res.json();
        console.log(`${TAG} GET_HOME_NETWORK =`, json);
        return json;
    } catch (error) {
        console.log(`${TAG} get home network error for ${HUD_ID}`, error);
        return null;
    }
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
        const networkInfo = await getNetworkInfoForHome('IST-GWH-2102-0001C031E907-L003032300001', '183624a38e6e2954577ab5cdab1032d4274db092', 'https://ist-gwh-2102-0001C031E907-L003032300001.tunnel.insentecs.cloud:9300/lte/info');
        console.error(`${TAG} Missing user networkInfo =`, networkInfo);
        const listHome = await getHomesList(USER_ID, TOKEN);
        // 🔍 chỉ lấy network info cho 1 home cụ thể
        //     for (const home of listHome) {
        //         const HUD_ID = home.hub_id ?? '';
        //         if (HUD_ID.includes('IST-GWH-2102-0001C031E907-L003032300001')) {
        // //              const HUD_ID = home.hub_id ?? '';
        // // const RESOURCE_SECRET = home.software_info?.resource_secret ?? '';
        // // const REMOTE_TUNNEL_HTTP = (home.software_info?.remote_tunnel_http ?? '') + '/lte/info';
        //             // const networkInfo = await getNetworkInfoForHome(home);
        //             // home.network_info = networkInfo; // gắn thêm field
        //         }
        //     }

        return { listHome };
    } catch (error) {
        console.log(`${TAG} get homes error = ${error}`);
        return { listHome: [] };
    }
};
