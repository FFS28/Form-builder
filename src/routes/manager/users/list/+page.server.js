import { getUsers } from '$services/userService.js';
import { SearchFilters } from '$structures/searchFilters';
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const usersResponse = await getUsers('', event);

	return {
		...usersResponse
	};
}
