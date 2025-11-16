<script lang="ts">
  import Homes from '../../utils/dashboard/Homes.svelte';
  import MetaTag from '../../utils/MetaTag.svelte';
  import Footer from '../Footer.svelte';
  const path: string = '/homes';
  const description: string = 'Admin Dashboard example using Flowbite Svelte';
  const title: string = 'Flowbite Svelte Admin Dashboard - Dashboard';
  const subtitle: string = 'Admin Dashboard';
  export let data; // 👈 nhận dữ liệu từ load()
  const { listHome } = data;
  // console.log('listHome:', listHome);
</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="p-4">
  <h1 class="hidden">Dashboard</h1>
  <Homes />
</main>
