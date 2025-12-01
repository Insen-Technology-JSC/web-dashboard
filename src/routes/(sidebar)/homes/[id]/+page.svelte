<script lang="ts">
  import HomeDetail from '../../../utils/dashboard/HomeDetail.svelte';
  export let data; // 👈 nhận dữ liệu từ load()
  const { selectedHome } = data;
</script>

<main class="p-4">
  <h1 class="hidden">Dashboard</h1>
  <HomeDetail {selectedHome} />
</main>
