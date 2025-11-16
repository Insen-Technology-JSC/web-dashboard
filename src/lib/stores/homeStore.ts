import { writable } from 'svelte/store';
import type { Home } from '$lib/types/home';

export const homes = writable<Home[]>([]);
export const selectedHome = writable<Home | null>(null);

export async function fetchHomes() {
    try {
        const res = await fetch('/api/homes'); // URL thật hoặc mock JSON
        if (!res.ok) throw new Error('Failed to load homes');
        const data: Home[] = await res.json();
        homes.set(data);
    } catch (err) {
        console.error('Error fetching homes:', err);
        homes.set([]); // fallback rỗng
    }
}

export function selectHome(home: Home) {
    selectedHome.set(home);
}

export function backToList() {
    selectedHome.set(null);
}
