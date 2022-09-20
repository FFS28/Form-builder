import { getAudits } from '$services/auditService';
import { Audit } from '$structures/audit';
import { SearchFilters } from '$structures/searchFilters';
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const searchFilters = new SearchFilters();

	const resp = await getAudits(searchFilters.formatParams(), event)

	return {
		...resp
	};
}
