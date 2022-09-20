import { getRoleList } from '$services/roleService.js';
import { SearchFilters } from '$structures/searchFilters.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const searchFilters = new SearchFilters();

	const response = await getRoleList(searchFilters.formatParams(), event);

	return {
		...response
	};
}
