import type { LightbulbOutline } from "flowbite-svelte-icons";

export interface DeviceOption {
    id: number;
    name: string;
    area: string;
    status: 'Bình thường' | 'Lỗi' | 'Missing';
    icon?: typeof LightbulbOutline;
}

export interface Home {
    id: number;
    name: string;
    address: string;
    connection: string;
    devicesCount: number;
    camerasCount: number;
    owner: string;
    devices: DeviceOption[];
}

export interface HomePosition {
    id: string;
    name: string;
    lat: number;
    long: number;
    status: boolean; // true = online, false = offline
    address?: string; // optional address field
}

export interface ApiHome {
  hub_id: string;
  name: string;
  connected: boolean;
  address?: string;
  location?: {
    lat?: number;
    long?: number;
  };
}
