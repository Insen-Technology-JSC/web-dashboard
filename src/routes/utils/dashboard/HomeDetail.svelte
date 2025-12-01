<script lang="ts">
  import { goto } from '$app/navigation';
  import { Card, Button, Badge, Gallery } from 'flowbite-svelte';
  import type { Home } from '$lib/types/home';
  export let selectedHome: Home | null = null;
  console.log('selectedHome:', selectedHome);
</script>

<div class="space-y-6 p-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-semibold dark:text-white">{selectedHome?.name} - [{selectedHome?.devices.length}] thiết bị</h2>
    <Button color="light">
      <button type="button" on:click={() => goto('/')}>Back</button>
    </Button>
  </div>
  <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
    {#each selectedHome?.devices as device}
      <Card class="relative">
        <!-- Dấu chấm trạng thái -->
        <span class={`absolute top-2 right-2 h-2 w-2 rounded-full ${device.status === 'Bình thường' ? 'bg-green-500' : device.status === 'Missing' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>

        <div class="flex flex-col items-center justify-center gap-2 p-4">
          <div class="text-4xl text-gray-700 dark:text-gray-300">
            <!-- {#if device.icon}
              <svelte:component this={device.icon} class="text-4xl text-gray-700 dark:text-gray-300" />
            {/if} -->
          </div>
          <div class="text-center">
            <h3 class="text-sm font-semibold text-gray-500 dark:text-white">{device.name}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{device.area}</p>
          </div>
        </div>
      </Card>
    {/each}
  </div>
</div>
