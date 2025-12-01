import type { PageServerLoad } from './$types';
import type { HomeInfoRes, UserDevice, DeviceOption } from '$lib/types/home';
import { env } from '$env/dynamic/private';
import { CookieStore } from '$lib/server/CookieStore';

const TAG = '[home_id_api]';

function mapStatus(apiStatus: string): DeviceOption['status'] {
    switch (apiStatus) {
        case 'OK':
            return 'Bình thường';
        case 'ERROR':
        case 'FAULT':
            return 'Lỗi';
        default:
            return 'Missing';
    }
}

function mapDevice(uDevice: UserDevice): DeviceOption {
    return {
        id: uDevice.id, // hoặc parseInt / index, vì API id đang là string
        name: uDevice.name,
        area: uDevice.zone_id || '', // tạm map từ zone_id, sau này có area riêng thì đổi
        status: mapStatus('OK'),
        type: uDevice.type
    };
}

async function getHomesList(USER_ID: string, BEARER_TOKEN: string) {
    const BASE_API_URL = env.BASE_API_URL ?? '';
    const GET_HOMES_URL = `${BASE_API_URL.replace(/\/$/, '')}/things/v1/user/${USER_ID}/homes`;
    console.log(`${TAG} GET_HOMES_URL = ${GET_HOMES_URL}`);
    const res = await fetch(GET_HOMES_URL, {
        method: 'GET',
        headers: {
            'Authorization': BEARER_TOKEN,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        throw new Error(`${TAG} get homes ${res.status}`);
    }
    return await res.json();
}

async function getUserDevicesList(USER_ID: string, HUB_ID: string, BEARER_TOKEN: string) {
    const BASE_API_URL = env.BASE_API_URL ?? '';
    const GET_USER_DEVICE_URL = `${BASE_API_URL.replace(/\/$/, '')}/things/v1/user/${USER_ID}/home/${HUB_ID}/user-devices`;
    console.log(`${TAG} GET_HOMES_URL = ${GET_USER_DEVICE_URL}, TOKEN = ${BEARER_TOKEN}`);
    const res = await fetch(GET_USER_DEVICE_URL, {
        method: 'GET',
        headers: {
            'Authorization': BEARER_TOKEN,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        throw new Error(`${TAG} get user device ${res.status}`);
    }
    return await res.json();
}

export const load: PageServerLoad = async ({ cookies, params }) => {
    const store = new CookieStore(cookies);
    const sessionText = store.getSessionBody();
    const homeId = params.id; // lấy id từ URL
    console.log(`${TAG} homeId = ${homeId}`);
    let userId = '';
    let token = '';
    if (sessionText) {
        try {
            const data = JSON.parse(sessionText);
            userId = data?.session?.identity?.id ?? '';
            token = data?.session_token ?? '';
        } catch {
            console.warn(`${TAG} Failed to get user from session`);
        }
    }

    if (!userId || !token) {
        console.error(`${TAG} Missing user session`);
        return { listHome: [] };
    }
    const USER_ID = userId;
    const TOKEN = 'Bearer ' + token;
    try {
        const listHome = await getHomesList(USER_ID, TOKEN);
        // console.log(`${TAG} fetched listHome =`, listHome);
        const apiHome = (listHome as HomeInfoRes[]).find(home => home.hub_id === homeId);
        if (!apiHome) return undefined;
        // console.log(`${TAG} fetched apiHome =`, apiHome);
        const home = {
            id: apiHome,
            name: apiHome.name,
            address: apiHome.address ?? '',
            connection: apiHome.connected ?? 'offline',
            devicesCount: 0,
            camerasCount: 0,
            owner: '',
            devices: new Array<DeviceOption>()
        }
        console.log(`${TAG} get user device =`, USER_ID, apiHome.hub_id, TOKEN);
        const userDevices = await getUserDevicesList(USER_ID, apiHome.hub_id, TOKEN);
        const devices: DeviceOption[] = [];
        console.log(`${TAG} fetched userDevices = ${userDevices.length}, hub_id:${apiHome.hub_id} `);
        (userDevices as UserDevice[]).forEach((device) => {
            devices.push(mapDevice(device));
        });
        home.devicesCount = devices.length;
        home.devices = devices;
        console.log(`${TAG} mapped home =`, home);
        return {
            selectedHome: home
        };
    } catch (error) {
        console.log(`${TAG} get homes error = ${error}`);
        return { selectedHome: [] };
    }
};
