<script lang="ts">
  import LeafletMap from '$lib/LeafletMap.svelte';
  import MetaTag from '../utils/MetaTag.svelte';
  const path: string = '/settings';
  const description: string = 'Settings examaple - Flowbite Svelte Admin Dashboard';
  const title: string = 'Flowbite Svelte Admin Dashboard - Settings';
  const subtitle: string = 'Settings';
  export let data; // 👈 nhận dữ liệu từ load()
  const { listHome, homePositions } = data;
</script>

<MetaTag {path} {description} {title} {subtitle} />
<main class="p-4">
  <h1 class="hidden">Dashboard</h1>
  <LeafletMap homes={homePositions} />
</main>
