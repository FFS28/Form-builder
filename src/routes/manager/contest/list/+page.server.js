import { getContestCount, getContests } from '$services/contestService';
import { SearchFilters } from '$structures/searchFilters';
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const response = await getContests('', event)

	return {
		...response
	};
}
