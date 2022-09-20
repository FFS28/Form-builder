import { getPrograms } from "$services/programService.js";
import { SearchFilters } from '$structures/searchFilters';
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const searchFilters = new SearchFilters();

	const response = await getPrograms(searchFilters.formatParams(), event);

	return {
		...response
	};
}
