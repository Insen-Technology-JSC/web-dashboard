// import type { LightbulbOutline } from "flowbite-svelte-icons";

export interface DeviceOption {
  id: number | string;
  name: string;
  area: string;
  status: 'Bình thường' | 'Lỗi' | 'Missing';
  // icon?: typeof LightbulbOutline;
  type: string
}

export interface Home {
  id: string | number;
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

export interface HomeInfoRes {
  hub_id: string;
  name: string;
  connected: boolean;
  address?: string;
  location?: {
    lat?: number;
    long?: number;
  };
}

export interface UserDevice {
  id: string;
  name: string;
  type: string;
  hub_id: string;
  zone_id: string;
  status: string;
  power_source: string;
  profiles: object;
  assign_devices: object;
  device_states: object;
  device_settings: object;
  device_actions: object;
}
