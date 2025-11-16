<script lang="ts">
  import { Card, Button, Badge, Gallery } from 'flowbite-svelte';
  import { DesktopPcOutline, MobilePhoneOutline, LightbulbOutline, CameraPhotoSolid } from 'flowbite-svelte-icons';
  import type { DeviceOption } from '$lib/types';

  interface DeviceOption {
    name: string;
    area: string;
    status: 'Bình thường' | 'Lỗi' | 'Missing';
    icon?: typeof LightbulbOutline;
  }

  interface Home {
    id: number;
    name: string;
    address: string;
    connection: string;
    devicesCount: number;
    camerasCount: number;
    owner: string;
    devices: DeviceOption[];
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'Bình thường':
        return 'green';
      case 'Lỗi':
        return 'red';
      case 'Missing':
        return 'gray';
      default:
        return 'gray';
    }
  };

  export let homes: Home[] = [
    {
      id: 1,
      name: "Hiền's Home",
      address: '181 Cao Thắng',
      connection: 'Đang kết nối (LAN)',
      devicesCount: 4,
      camerasCount: 4,
      owner: 'Nguyễn Thị Hiền',
      devices: [
        { name: 'Đèn trần', area: 'Phòng ngủ', status: 'Bình thường', icon: LightbulbOutline },
        { name: 'Camera hành lang', area: 'Hành lang', status: 'Lỗi', icon: CameraPhotoSolid },
        { name: 'Nhiệt kế', area: 'Phòng khách', status: 'Missing', icon: LightbulbOutline },
        { name: 'Đèn trần', area: 'Phòng ngủ', status: 'Bình thường', icon: LightbulbOutline },
        { name: 'Camera hành lang', area: 'Hành lang', status: 'Lỗi', icon: CameraPhotoSolid },
        { name: 'Nhiệt kế', area: 'Phòng khách', status: 'Missing', icon: LightbulbOutline },
        { name: 'Đèn trần', area: 'Phòng ngủ', status: 'Bình thường', icon: LightbulbOutline },
        { name: 'Camera hành lang', area: 'Hành lang', status: 'Lỗi', icon: CameraPhotoSolid },
        { name: 'Nhiệt kế', area: 'Phòng khách', status: 'Missing', icon: LightbulbOutline }
      ]
    },
    {
      id: 2,
      name: "An's Home",
      address: '99 Lê Lợi',
      connection: 'Đang kết nối (LTE)',
      devicesCount: 2,
      camerasCount: 1,
      owner: 'Nguyễn Văn An',
      devices: [
        { name: 'Đèn trần', area: 'Phòng ngủ', status: 'Bình thường', icon: LightbulbOutline },
        { name: 'Camera hành lang', area: 'Hành lang', status: 'Lỗi', icon: CameraPhotoSolid },
        { name: 'Nhiệt kế', area: 'Phòng khách', status: 'Missing', icon: LightbulbOutline }
      ]
    },
    {
      id: 2,
      name: "An's Home",
      address: '99 Lê Lợi',
      connection: 'Mất kết nối',
      devicesCount: 2,
      camerasCount: 1,
      owner: 'Nguyễn Văn An',
      devices: [
        { name: 'Đèn trần', area: 'Phòng ngủ', status: 'Bình thường', icon: LightbulbOutline },
        { name: 'Camera hành lang', area: 'Hành lang', status: 'Lỗi', icon: CameraPhotoSolid },
        { name: 'Nhiệt kế', area: 'Phòng khách', status: 'Missing', icon: LightbulbOutline },
        { name: 'Đèn trần', area: 'Phòng ngủ', status: 'Bình thường', icon: LightbulbOutline },
        { name: 'Camera hành lang', area: 'Hành lang', status: 'Lỗi', icon: CameraPhotoSolid },
        { name: 'Nhiệt kế', area: 'Phòng khách', status: 'Missing', icon: LightbulbOutline },
        { name: 'Đèn trần', area: 'Phòng ngủ', status: 'Bình thường', icon: LightbulbOutline },
        { name: 'Camera hành lang', area: 'Hành lang', status: 'Lỗi', icon: CameraPhotoSolid },
        { name: 'Nhiệt kế', area: 'Phòng khách', status: 'Missing', icon: LightbulbOutline }
      ]
    }
  ];

  let selectedHome: Home | null = null;

  function selectHome(home: Home) {
    selectedHome = home;
  }
</script>

<div class="space-y-6 p-6">
  {#if !selectedHome}
    <h2 class="text-2xl font-semibold dark:text-white">Nhà: [{homes.length}]</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {#each homes as home}
        <button type="button" class="w-full transform cursor-pointer text-left transition duration-200 hover:scale-105" on:click={() => selectHome(home)}>
          <Card class="p-6 hover:bg-gray-50 dark:shadow-gray-900 dark:hover:bg-gray-800">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{home.name}</h3>
                <p class="mt-1 mb-4 pt-px text-sm dark:text-gray-300">{home.address}</p>
              </div>
              <Badge color={home.connection.includes('LAN') || home.connection.includes('LTE') ? 'green' : 'gray'}>
                {home.connection}
              </Badge>
            </div>

            <div class="mt-0 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p><span class="text-sm font-bold">IoT:</span> {home.devicesCount}</p>
              <p><span class="text-sm font-bold">Camera:</span> {home.camerasCount}</p>
            </div>
            <div class="mt-4">
              <Button size="sm" color="light">Chi tiết</Button>
            </div>
          </Card>
        </button>
      {/each}
    </div>
  {:else}
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold dark:text-white">{selectedHome.name} - [{selectedHome.devices.length}] thiết bị</h2>
      <Button color="light">
        <button type="button" on:click={() => (selectedHome = null)}>Back</button>
      </Button>
    </div>
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
      {#each selectedHome.devices as device}
        <Card class="relative">
          <!-- Dấu chấm trạng thái -->
          <span class={`absolute top-2 right-2 h-2 w-2 rounded-full ${device.status === 'Bình thường' ? 'bg-green-500' : device.status === 'Missing' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>

          <div class="flex flex-col items-center justify-center gap-2 p-4">
            <div class="text-4xl text-gray-700 dark:text-gray-300">
              {#if device.icon}
                <svelte:component this={device.icon} class="text-4xl text-gray-700 dark:text-gray-300" />
              {/if}
            </div>
            <div class="text-center">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-white">{device.name}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{device.area}</p>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</div>
