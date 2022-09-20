import { writable } from 'svelte/store';

export const sortingParams = writable({
	sortColumn: '',
	isAscending: true
});
