import type { ComponentType } from 'svelte';

export interface MenuItem {
	url: string;
	name: string;
	icon?: ComponentType;
}
