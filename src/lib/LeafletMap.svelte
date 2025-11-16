<script lang="ts">
  import { onMount } from 'svelte';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import type { HomePosition } from '$lib/types/home';
  import mapboxgl from 'mapbox-gl';

  let mapDiv: HTMLDivElement;
  // Generate 3 homes
  const homes: HomePosition[] = [
    { id: 1, name: 'Genki dev', lat: 10.776, long: 106.7, status: true, address: '123 Main St, City, Country' },
    { id: 2, name: 'Home B', lat: 10.78, long: 106.705, status: false, address: ' ' },
    { id: 3, name: 'Home C', lat: 10.782, long: 106.71, status: true }
  ];

  let map: mapboxgl.Map;

  function createMarkerElement(home: HomePosition) {
    const container = document.createElement('div');
    container.className = 'flex items-center gap-1';

    // icon
    const icon = document.createElement('div');
    icon.style.width = '24px';
    icon.style.height = '24px';
    icon.style.backgroundSize = 'cover';
    icon.style.backgroundImage = 'url(/images/ic_launcher.png)';

    // label
    const label = document.createElement('span');
    label.textContent = home.name;
    label.style.color = 'white';
    label.style.fontSize = '14px';
    label.style.fontWeight = '500';
    label.style.padding = '2px 6px';
    label.style.borderRadius = '4px';
    label.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)';
    label.style.background = home.status ? 'green' : 'red';

    container.appendChild(icon);
    container.appendChild(label);

    // === thêm popup hover ===
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    }).setText(home.address || 'No address'); // home.address là chuỗi địa chỉ

    container.addEventListener('mouseenter', () => popup.addTo(map).setLngLat([home.long, home.lat]));
    container.addEventListener('mouseleave', () => popup.remove());

    return container;
  }

  // const el = createMarkerElement('Genki Dev', true);

  onMount(async () => {
    const mapboxgl = await import('mapbox-gl');
    mapboxgl.default.accessToken = 'pk.eyJ1IjoiaW5zZW4iLCJhIjoiY2xrMjI5ajJ4MGFrZjNnbXY2OXRhd3h6NCJ9.SMlcq6iPiCA0nMWAlveW_g';
    map = new mapboxgl.default.Map({
      container: mapDiv,
      interactive: true,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [106.67499704182997, 10.7746407831968],
      zoom: 15,
      doubleClickZoom: true
    });

    homes.forEach((home) => {
      const el = createMarkerElement(home);

      new mapboxgl.Marker(el).setLngLat([home.long, home.lat]).addTo(map);
    });
  });
</script>

<div bind:this={mapDiv} class="h-screen w-screen"></div>
